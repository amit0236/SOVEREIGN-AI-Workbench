from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List
from pydantic import BaseModel
from ..models.schemas import ArtifactItem
from ..services.artifact_service import ArtifactService, ARTIFACTS_DIR
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/artifacts", tags=["Artifacts"])

class GenerateArtifactRequest(BaseModel):
    artifact_type: str # "DOCX", "XLSX", "PPTX"
    equipment_id: str = "P-204"
    operator: str = "operator_tech_01"

@router.get("", response_model=List[ArtifactItem])
def get_artifacts():
    return ArtifactService.get_artifacts()

@router.post("/generate", response_model=ArtifactItem)
def generate_artifact(req: GenerateArtifactRequest):
    fmt = req.artifact_type.upper()
    if fmt == "DOCX":
        artifact = ArtifactService.generate_docx_observation_note(equipment_id=req.equipment_id, operator=req.operator)
    elif fmt == "XLSX":
        artifact = ArtifactService.generate_xlsx_comparison(operator=req.operator)
    elif fmt == "PPTX":
        artifact = ArtifactService.generate_pptx_review(operator=req.operator)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format {fmt}")

    AuditService.log_event(
        user=req.operator,
        action="ARTIFACT_CREATE",
        resource=artifact.file_name,
        model="local-general",
        status="SUCCESS",
        details=f"Generated {artifact.format} document ({artifact.file_size_kb} KB)"
    )

    return artifact

@router.get("/download/{filename}")
def download_artifact(filename: str):
    file_path = ARTIFACTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Artifact {filename} not found on local storage")
    
    media_types = {
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".pdf": "application/pdf"
    }
    ext = file_path.suffix.lower()
    media_type = media_types.get(ext, "application/octet-stream")
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type=media_type
    )
