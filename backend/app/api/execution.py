from fastapi import APIRouter
from ..models.schemas import CalculationRequest, CalculationResult
from ..services.sandbox_service import SandboxService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/execution", tags=["Execution"])

@router.get("/specs")
def get_specs():
    return SandboxService.get_sandbox_specs()

@router.post("/run", response_model=CalculationResult)
def run_calculation(req: CalculationRequest):
    result = SandboxService.execute_calculation(req)
    
    AuditService.log_event(
        user="operator",
        action="CALCULATION",
        resource=f"sandbox:{req.calculation_type}",
        model="local-code",
        status=result.status,
        details=f"Formula: {result.formula_used} (Elapsed: {result.execution_time_ms}ms)"
    )
    
    return result
