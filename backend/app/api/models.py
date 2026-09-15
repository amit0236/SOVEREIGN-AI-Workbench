from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from ..models.schemas import ModelInfo, ModelRoute
from ..services.routing_service import RoutingService

router = APIRouter(prefix="/api/models", tags=["Models"])
routing_service = RoutingService()

class RouteRequest(BaseModel):
    task_instruction: str
    has_scanned_docs: bool = False
    has_calc: bool = False

@router.get("", response_model=List[ModelInfo])
def list_models():
    return routing_service.get_models()

@router.post("/route", response_model=ModelRoute)
def route_model(req: RouteRequest):
    return routing_service.route_request(
        task_instruction=req.task_instruction,
        has_scanned_docs=req.has_scanned_docs,
        has_calc=req.has_calc
    )
