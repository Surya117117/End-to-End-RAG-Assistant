from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-large-en-v1.5"
)

splitter = SentenceSplitter(
    chunk_size=200,
    chunk_overlap=50
)

def load_and_chunk_pdf(path: str):

    documents = SimpleDirectoryReader(
        input_files=[path]
    ).load_data()

    nodes = splitter.get_nodes_from_documents(documents)

    return [node.text for node in nodes]


def embed_texts(texts: list[str]):
    return embed_model.get_text_embedding_batch(texts)