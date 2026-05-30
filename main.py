import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import inngest
import inngest.fast_api
from dotenv import load_dotenv
import uuid
import os
import datetime
from data_loader import load_and_chunk_pdf, embed_texts
from vector_db import QdrantStorage
from custom_types import RAGChunkAndSrc, RAGQueryResult, RAGSearchResult, RAGUpsertResult
from llama_index.llms.groq import Groq
from llama_index.core.llms import ChatMessage


load_dotenv()

inngest_client = inngest.Inngest(
    app_id = "RAG_APP",
    logger=logging.getLogger("uvicorn"),
    is_production = False,
    serializer = inngest.PydanticSerializer()
)

@inngest_client.create_function(
    fn_id="RAG: Ingest PDF",
    trigger = inngest.TriggerEvent(event = "rag/ingest_pdf")
)

async def rag_ingest_pdf(ctx: inngest.Context):
    def _load(ctx: inngest.Context) -> RAGChunkAndSrc:
        pdf_path = ctx.event.data["pdf_path"]
        source_id = ctx.event.data.get("source_id",pdf_path)
        chunks = load_and_chunk_pdf(pdf_path)
        return RAGChunkAndSrc(chunks= chunks, source_id=source_id)

    def _upsert(chunk_and_src: RAGChunkAndSrc) -> RAGUpsertResult:
        chunks = chunk_and_src.chunks
        source_id = chunk_and_src.source_id
        vecs = embed_texts(chunks)
        ids = [str(uuid.uuid5(uuid.NAMESPACE_URL, name=f"{source_id}:{i}")) for i in range(len(chunks))]
        payloads = [{"source": source_id, "text": chunks[i]} for i in range(len(chunks))]
        QdrantStorage().upsert(ids, vecs, payloads)
        return RAGUpsertResult(ingested=len(chunks))

    
    chunk_and_src = await ctx.step.run(
        "load-and-chunk",
        lambda: _load(ctx), 
        output_type=RAGChunkAndSrc
    )
    inngested = await ctx.step.run(
        "embed-and-upsert",
        lambda: _upsert(chunk_and_src), output_type=RAGUpsertResult
    )
    return inngested.model_dump()

@inngest_client.create_function(
    fn_id="RAG: Query PDF",
    trigger=inngest.TriggerEvent(event="rag/query_pdf_ai")
)

async def rag_query_pdf_ai(ctx: inngest.Context):
    def _search(question: str, top_k: int=5) -> RAGSearchResult:
        query_vec = embed_texts([question])[0]
        store = QdrantStorage()
        found = store.search(query_vec, top_k)
        return RAGSearchResult(contexts=found["contexts"], sources=found["sources"])
    
    question = ctx.event.data["question"]
    top_k = int(ctx.event.data.get("top_k", 5))

    found = await ctx.step.run(
        "embed-and-search", 
        lambda: _search(question, top_k), output_type=RAGSearchResult
    )

    context_block = "\n\n".join(f"- {c}" for c in found.contexts)
    user_content = (
        "use the following context to answer the question.\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n"
        "Answer concisely using the context above."
    )
    llm = Groq(
        model = "llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY")
    )

    messages = [
        ChatMessage(
            role = "system",
            content="You answer questions using only the provided context."
        ),
        ChatMessage(
            role="user",
            content=user_content
        )
    ]
    response = llm.chat(messages)
    answer = response.message.content.strip()

    return{
        "answer": answer,
        "sources": found.sources,
        "num_contexts": len(found.contexts)
    }


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    await inngest_client.send(inngest.Event(
        name="rag/ingest_pdf",
        data={
            "pdf_path": save_path,
            "source_id": file.filename
        }
    ))
    
    return {"filename": file.filename, "path": save_path, "status": "ingestion_triggered"}

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

@app.post("/query")
async def query_endpoint(req: QueryRequest):
    query_vec = embed_texts([req.question])[0]
    store = QdrantStorage()
    found = store.search(query_vec, req.top_k)

    context_block = "\n\n".join(f"- {c}" for c in found["contexts"])
    user_content = (
        "Use the following context to answer the question.\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {req.question}\n"
        "Answer concisely using the context above."
    )

    llm = Groq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
    messages = [
        ChatMessage(role="system", content="You answer questions using only the provided context."),
        ChatMessage(role="user", content=user_content)
    ]
    response = llm.chat(messages)

    return {
        "answer": response.message.content.strip(),
        "sources": found["sources"],
        "num_contexts": len(found["contexts"])
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
inngest.fast_api.serve(
    app, 
    inngest_client,
    functions=[rag_ingest_pdf, rag_query_pdf_ai])
