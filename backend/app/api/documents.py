from fastapi import APIRouter, BackgroundTasks, UploadFile, File, Form, HTTPException
from typing import List, Optional
from ..models.schemas import DocumentItem
from ..services.document_service import (
    DemoDocumentDeletionError,
    DocumentNotFoundError,
    DocumentService,
)
from ..services.ocr_service import OCRService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentItem])
def get_all_documents():
    return DocumentService.get_documents()

@router.get("/pid/elements")
def get_pid_elements():
    return OCRService.get_pid_elements()

@router.get("/{doc_id}", response_model=DocumentItem)
def get_document(doc_id: str):
    doc = DocumentService.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {doc_id} not found in local repository")
    return doc


@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    try:
        return DocumentService.delete_document(doc_id)
    except DocumentNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Document {doc_id} not found in local repository"
        )
    except DemoDocumentDeletionError:
        raise HTTPException(
            status_code=403,
            detail="Demo documents cannot be deleted."
        )
    except OSError as exc:
        raise HTTPException(status_code=500, detail=f"Unable to delete document file: {exc}")
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/upload", response_model=DocumentItem)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    is_scanned: bool = Form(True)
):
    content = await file.read()
    filename = file.filename or "uploaded_doc.pdf"
    file_ext = filename.split(".")[-1].upper() if "." in filename else "PDF"
    
    doc = DocumentService.save_uploaded_document(
        filename=filename,
        content=content,
        file_type=file_ext,
        is_scanned=is_scanned
    )
    background_tasks.add_task(
        DocumentService.process_uploaded_document,
        doc.id,
        filename,
        content
    )
    
    # Log to audit trail
    AuditService.log_event(
        user="operator",
        action="DOCUMENT_UPLOAD",
        resource=filename,
        model="SYSTEM",
        status="SUCCESS",
        details=f"Stored locally ({doc.file_size_kb} KB). Scanned flag: {is_scanned}"
    )
    
    # If scanned, log OCR
    if is_scanned:
        AuditService.log_event(
            user="operator",
            action="OCR_PROCESS",
            resource=filename,
            model="local-vision",
            status="SUCCESS",
            details="Extracted tabular parameters and inspection data"
        )
        
    return doc
