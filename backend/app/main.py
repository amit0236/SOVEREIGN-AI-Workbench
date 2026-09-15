from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .core.database import init_db
from .api import system, models, documents, knowledge, execution, artifacts, audit, analysis
from .services.document_service import DocumentService
from .services.artifact_service import ArtifactService

app = FastAPI(
    title="SOVEREIGN — On-Premise AI Workbench",
    description="Secure Local Intelligence System for Industrial, PSU, and Government Facilities",
    version="1.0.0"
)

# Strict local CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize storage and database tables on startup
@app.on_event("startup")
def startup_event():
    init_db()
    DocumentService.seed_synthetic_documents()
    ArtifactService.get_artifacts() # Pre-generate initial sample artifacts

# Mount API routers
app.include_router(system.router)
app.include_router(models.router)
app.include_router(documents.router)
app.include_router(knowledge.router)
app.include_router(execution.router)
app.include_router(artifacts.router)
app.include_router(audit.router)
app.include_router(analysis.router)

@app.get("/")
def root():
    return {
        "system": "SOVEREIGN",
        "title": "On-Premise AI Workbench",
        "subtitle": "Secure Local Intelligence System",
        "status": "OPERATIONAL",
        "network": "ISOLATED",
        "storage": "LOCAL",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8001, reload=True)
