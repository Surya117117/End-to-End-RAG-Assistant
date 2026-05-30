# 🤖 End-to-End RAG Assistant

A production-ready **Retrieval-Augmented Generation (RAG)** system that lets you upload PDF documents and chat with them using AI. Built with a cyberpunk-themed frontend and a robust Python backend powered by Inngest, Qdrant, and Groq.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18+-cyan?style=flat-square&logo=react)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-red?style=flat-square)
![Inngest](https://img.shields.io/badge/Inngest-Workflow_Engine-purple?style=flat-square)

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start Qdrant with Docker](#2-start-qdrant-with-docker)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Start Inngest Dev Server](#4-start-inngest-dev-server)
  - [5. Frontend Setup](#5-frontend-setup)
- [Running the App](#-running-the-app)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture Overview

```
User uploads PDF
      │
      ▼
React Frontend (port 5173)
      │
      ▼
FastAPI Backend (port 8000)  ──── /upload ────►  Save PDF to disk
      │                                                │
      │                                               ▼
      │                                    Inngest Dev Server (port 8288)
      │                                               │
      │                               ┌──────────────┼──────────────────┐
      │                               ▼              ▼                  ▼
      │                          Load & Chunk   Embed Texts      Upsert to Qdrant
      │                         (LlamaIndex)  (BAAI/bge-large)  (Docker port 6333)
      │
      ▼
FastAPI /query endpoint
      │
      ├── Embed question  (BAAI/bge-large)
      ├── Search Qdrant   (cosine similarity)
      └── Generate answer (Groq / LLaMA 3.3 70B)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.10+ |
| Workflow Engine | Inngest (background jobs) |
| Vector Database | Qdrant (via Docker) |
| Embeddings | `BAAI/bge-large-en-v1.5` (HuggingFace) |
| LLM | Groq API — LLaMA 3.3 70B Versatile |
| PDF Processing | LlamaIndex, SentenceSplitter |

---

## ✅ Prerequisites

Make sure you have all of these installed before starting:

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)
- **Inngest CLI** — install via: `npm install -g inngest-cli`
- **Groq API Key** — get it free at [console.groq.com](https://console.groq.com)
- **Git** — [Download](https://git-scm.com/)

---

## 📁 Project Structure

```
End-to-End-RAG-Assistant/
│
├── frontend/                  # React frontend
│   ├── src/
│   │   └── App.jsx            # Main UI component
│   ├── package.json
│   └── ...
│
├── main.py                    # FastAPI app + Inngest functions
├── data_loader.py             # PDF chunking + embedding logic
├── vector_db.py               # Qdrant storage wrapper
├── custom_types.py            # Pydantic models
├── requirements.txt           # Python dependencies
├── test.py                    # Manual test script
└── .env                       # Your API keys (create this)
```

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Surya117117/End-to-End-RAG-Assistant.git
cd End-to-End-RAG-Assistant
```

---

### 2. Start Qdrant with Docker

Qdrant is the vector database that stores your document embeddings. Run it as a Docker container:

```bash
docker run -d \
  --name qdrantRAG \
  -p 6333:6333 \
  -p 6334:6334 \
  qdrant/qdrant
```

Verify it's running:

```bash
docker ps
```

You should see `qdrantRAG` listed with status `Up`. You can also open [http://localhost:6333/dashboard](http://localhost:6333/dashboard) in your browser to confirm.

> **Note:** If you restart your machine, start Qdrant again with:
> ```bash
> docker start qdrantRAG
> ```

---

### 3. Backend Setup

#### Create a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ The HuggingFace embedding model (`BAAI/bge-large-en-v1.5`) will be downloaded automatically on first run (~1.3 GB). This only happens once and is cached locally.

#### Create your `.env` file

Create a file named `.env` in the root of the project:

```bash
# .env
GROQ_API_KEY=your_groq_api_key_here
```

Replace `your_groq_api_key_here` with your actual key from [console.groq.com](https://console.groq.com). It's free to get.

#### Start the FastAPI backend

```bash
uvicorn main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

### 4. Start Inngest Dev Server

Inngest handles the background PDF ingestion pipeline (chunking, embedding, storing). Open a **new terminal** and run:

```bash
npx inngest-cli@latest dev -u http://localhost:8000/api/inngest
```

You should see the Inngest dashboard open at [http://localhost:8288](http://localhost:8288).

> **Keep this terminal open** while using the app. Inngest runs the background jobs triggered when you upload a PDF.

---

### 5. Frontend Setup

Open another **new terminal** and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## ▶️ Running the App

Once all four services are running, here is what your terminals should look like:

| Terminal | Command | URL |
|---|---|---|
| Terminal 1 | `docker start qdrantRAG` | http://localhost:6333 |
| Terminal 2 | `uvicorn main:app --reload` | http://localhost:8000 |
| Terminal 3 | `npx inngest-cli@latest dev -u http://localhost:8000/api/inngest` | http://localhost:8288 |
| Terminal 4 | `cd frontend && npm run dev` | http://localhost:5173 |

Open [http://localhost:5173](http://localhost:5173) in your browser and you should see the **PDF RAG Assistant** interface.

### Using the app

1. **Upload a PDF** — drag and drop or click to browse
2. **Watch the pipeline** — the UI shows each stage: uploading → extracting → chunking → embedding → indexing → ready
3. **Ask questions** — once the knowledge base is ready, type any question about your document

---

## ⚙️ How It Works

### PDF Ingestion Pipeline (via Inngest)

When you upload a PDF, the backend:

1. Saves the file to the `uploads/` folder
2. Sends a `rag/ingest_pdf` event to Inngest
3. Inngest triggers the background function which:
   - Loads and chunks the PDF using LlamaIndex `SentenceSplitter` (200 token chunks, 50 overlap)
   - Generates 1024-dimensional embeddings using `BAAI/bge-large-en-v1.5`
   - Upserts all chunk vectors into Qdrant with their source metadata

### Query Pipeline (direct via FastAPI)

When you ask a question:

1. The question is embedded using the same HuggingFace model
2. Qdrant performs a cosine similarity search and returns the top 5 most relevant chunks
3. Those chunks are passed as context to Groq's LLaMA 3.3 70B model
4. The answer is streamed back to the frontend

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload a PDF file, triggers ingestion pipeline |
| `POST` | `/query` | Ask a question, returns AI answer with sources |
| `GET` | `/health` | Health check |
| `POST` | `/api/inngest` | Inngest webhook (internal use) |

### Example: Query request

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of the document?", "top_k": 5}'
```

### Example: Query response

```json
{
  "answer": "The document discusses...",
  "sources": ["your_file.pdf"],
  "num_contexts": 5
}
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for LLaMA inference |

---

## 🔧 Troubleshooting

**Qdrant connection refused**
> Make sure Docker Desktop is running and the `qdrantRAG` container is started:
> ```bash
> docker start qdrantRAG
> ```

**Inngest not receiving events**
> Ensure the dev server is pointed at your FastAPI app:
> ```bash
> npx inngest-cli@latest dev -u http://localhost:8000/api/inngest
> ```

**Embedding model downloading slowly**
> The first run downloads `BAAI/bge-large-en-v1.5` (~1.3 GB). This is a one-time download. Subsequent runs load from cache instantly.

**CORS errors in browser**
> Make sure your frontend is running on port `3000` or `5173`. Both are whitelisted in the backend. If you use a different port, add it to the `allow_origins` list in `main.py`.

**`GROQ_API_KEY` not found**
> Ensure your `.env` file exists in the project root (same folder as `main.py`) and contains the correct key.

**PDF upload shows error**
> Only `.pdf` files are accepted. Make sure the file extension is lowercase `.pdf`.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙋 Author

**Surya Pratap Singh** — [GitHub](https://github.com/Surya117117)
