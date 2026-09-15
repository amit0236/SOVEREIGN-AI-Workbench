from fastapi import APIRouter, Query
from typing import List, Optional
from ..models.schemas import AuditEvent
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/audit", tags=["Audit"])

@router.get("", response_model=List[AuditEvent])
def get_audit_trail(
    action: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    return AuditService.get_events(action=action, model=model, status=status)
