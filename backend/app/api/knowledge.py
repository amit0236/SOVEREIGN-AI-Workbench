from fastapi import APIRouter
from typing import List
from ..models.schemas import KnowledgeSource, KnowledgeSearchRequest, Citation
from ..services.rag_service import RAGService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge"])

@router.get("/collections", response_model=List[KnowledgeSource])
def get_collections():
    return RAGService.get_collections()

@router.post("/search", response_model=List[Citation])
def search_knowledge(req: KnowledgeSearchRequest):
    citations = RAGService.search_knowledge(query=req.query, category=req.category)
    
    # Audit log entry
    AuditService.log_event(
        user="operator",
        action="KNOWLEDGE_SEARCH",
        resource="Local Vector Index",
        model="local-general",
        status="SUCCESS",
        details=f"Query: '{req.query}' -> Retrieved {len(citations)} citations"
    )
    
    return citations
