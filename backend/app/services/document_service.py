import json
import uuid
from pathlib import Path
from datetime import datetime
from typing import List, Optional
from ..core.database import get_db_connection
from ..models.schemas import DocumentItem, ExtractionResult
from .ocr_service import OCRService

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "storage" / "uploads"


class DocumentNotFoundError(Exception):
    """Raised when a document ID has no corresponding database record."""


class DemoDocumentDeletionError(Exception):
    """Raised when deletion is requested for protected demonstration data."""


class DocumentService:
    @staticmethod
    def ensure_upload_dir():
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @classmethod
    def get_documents(cls) -> List[DocumentItem]:
        cls.ensure_upload_dir()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents ORDER BY rowid ASC")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            cls.seed_synthetic_documents()
            return cls.get_documents()

        results = []
        for r in rows:
            extraction = None
            if r["extraction_json"]:
                try:
                    extraction = ExtractionResult(**json.loads(r["extraction_json"]))
                except Exception:
                    pass
                    
            results.append(DocumentItem(
                id=r["id"],
                filename=r["filename"],
                file_type=r["file_type"],
                file_size_kb=r["file_size_kb"],
                page_count=r["page_count"],
                upload_time=r["upload_time"],
                status=r["status"],
                indexed=bool(r["indexed"]),
                is_scanned=bool(r["is_scanned"]),
                extraction=extraction,
                is_demo=bool(r["is_demo"])
            ))
        return results

    @classmethod
    def get_document_by_id(cls, doc_id: str) -> Optional[DocumentItem]:
        docs = cls.get_documents()
        for d in docs:
            if d.id == doc_id:
                return d
        return None

    @classmethod
    def save_uploaded_document(cls, filename: str, content: bytes, file_type: str, is_scanned: bool = True) -> DocumentItem:
        cls.ensure_upload_dir()
        doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        file_path = UPLOAD_DIR / f"{doc_id}_{filename}"
        
        with open(file_path, "wb") as f:
            f.write(content)
            
        file_size_kb = round(len(content) / 1024.0, 1)
        page_count = 1 if file_type in ["PNG", "JPG", "CSV"] else 8
        now_str = datetime.now().strftime("%d-%m-%Y %H:%M")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO documents (id, filename, file_type, file_size_kb, page_count, upload_time, status, indexed, is_scanned, is_demo, extraction_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (doc_id, filename, file_type.upper(), file_size_kb, page_count, now_str, "READY", 1, int(is_scanned), 0, None))
        conn.commit()
        conn.close()

        return DocumentItem(
            id=doc_id,
            filename=filename,
            file_type=file_type.upper(),
            file_size_kb=file_size_kb,
            page_count=page_count,
            upload_time=now_str,
            status="READY",
            indexed=True,
            is_scanned=is_scanned,
            extraction=None,
            is_demo=False
        )

    @classmethod
    def process_uploaded_document(cls, doc_id: str, filename: str, content: bytes) -> None:
        """Run the existing OCR extraction after the upload has been persisted."""
        extraction = OCRService.extract_document_data(filename, content)

        conn = get_db_connection()
        try:
            conn.execute(
                "UPDATE documents SET extraction_json = ? WHERE id = ? AND is_demo = 0",
                (extraction.model_dump_json(), doc_id)
            )
            conn.commit()
        finally:
            conn.close()

    @classmethod
    def delete_document(cls, doc_id: str) -> dict:
        """Delete a non-demo document record and its locally stored upload."""
        cls.ensure_upload_dir()
        conn = get_db_connection()
        deleted_file_contents = None
        deleted_file_path = None

        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, filename, is_demo FROM documents WHERE id = ?",
                (doc_id,)
            )
            document = cursor.fetchone()

            if document is None:
                raise DocumentNotFoundError()
            if bool(document["is_demo"]):
                raise DemoDocumentDeletionError()

            # Only use the database filename's basename and verify that the
            # resolved target remains in the uploads directory.
            upload_root = UPLOAD_DIR.resolve()
            stored_filename = f"{document['id']}_{Path(document['filename']).name}"
            file_path = (upload_root / stored_filename).resolve()
            try:
                file_path.relative_to(upload_root)
            except ValueError as exc:
                raise OSError("Refusing to delete a file outside the uploads directory.") from exc

            # Keep the database transaction open until file removal succeeds,
            # so a filesystem failure cannot remove the document record.
            conn.execute("BEGIN")
            if file_path.exists():
                if not file_path.is_file():
                    raise OSError("Uploaded document path is not a regular file.")
                deleted_file_contents = file_path.read_bytes()
                deleted_file_path = file_path
                file_path.unlink()

            cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
            if cursor.rowcount != 1:
                conn.rollback()
                raise RuntimeError("Document database deletion did not complete.")
            conn.commit()

            return {
                "status": "DELETED",
                "document_id": document["id"],
                "filename": document["filename"],
            }
        except Exception:
            conn.rollback()
            if (
                deleted_file_path is not None
                and deleted_file_contents is not None
                and not deleted_file_path.exists()
            ):
                deleted_file_path.write_bytes(deleted_file_contents)
            raise
        finally:
            conn.close()

    @classmethod
    def seed_synthetic_documents(cls):
        demo_docs = [
            {
                "id": "DOC-P204-INSP",
                "filename": "pump_inspection_204.pdf",
                "file_type": "PDF",
                "file_size_kb": 2450.0,
                "page_count": 12,
                "upload_time": "06-09-2026 09:30",
                "status": "READY",
                "indexed": 1,
                "is_scanned": 1,
                "is_demo": 1,
                "extraction": OCRService.extract_document_data("pump_inspection_204.pdf")
            },
            {
                "id": "DOC-V204-SHT",
                "filename": "valve_inspection_sheet_v204.pdf",
                "file_type": "PDF",
                "file_size_kb": 1120.0,
                "page_count": 6,
                "upload_time": "06-09-2026 09:32",
                "status": "READY",
                "indexed": 1,
                "is_scanned": 1,
                "is_demo": 1,
                "extraction": OCRService.extract_document_data("valve_inspection_sheet_v204.pdf")
            },
            {
                "id": "DOC-VEND-MARCH",
                "filename": "vendor_quote_march.xlsx",
                "file_type": "XLSX",
                "file_size_kb": 435.0,
                "page_count": 4,
                "upload_time": "06-09-2026 09:35",
                "status": "READY",
                "indexed": 1,
                "is_scanned": 0,
                "is_demo": 1,
                "extraction": ExtractionResult(
                    equipment_id="TNDR-P204-SPARE",
                    equipment_type="Commercial Tender Bids",
                    status="Normalized Commercial Table",
                    ocr_confidence=99.2,
                    table_extraction_confidence=99.8,
                    raw_text="Commercial comparison sheet for OEM spares procurement."
                )
            },
            {
                "id": "DOC-PID-REF3",
                "filename": "refinery_pid_unit3_area4b.pdf",
                "file_type": "PDF",
                "file_size_kb": 3890.0,
                "page_count": 1,
                "upload_time": "06-09-2026 09:40",
                "status": "READY",
                "indexed": 1,
                "is_scanned": 1,
                "is_demo": 1,
                "extraction": ExtractionResult(
                    equipment_id="PID-U3-4B",
                    equipment_type="Process & Instrumentation Diagram",
                    status="Vectorized Elements Identified",
                    ocr_confidence=95.4,
                    table_extraction_confidence=93.1,
                    raw_text="P&ID Diagram for Unit 3 Heavy Naphtha Distillation Area 4B."
                )
            }
        ]

        conn = get_db_connection()
        cursor = conn.cursor()
        for doc in demo_docs:
            extraction_json = doc["extraction"].model_dump_json() if doc["extraction"] else None
            cursor.execute("""
                INSERT OR REPLACE INTO documents (id, filename, file_type, file_size_kb, page_count, upload_time, status, indexed, is_scanned, is_demo, extraction_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (doc["id"], doc["filename"], doc["file_type"], doc["file_size_kb"], doc["page_count"], doc["upload_time"], doc["status"], doc["indexed"], doc["is_scanned"], doc["is_demo"], extraction_json))
        conn.commit()
        conn.close()
