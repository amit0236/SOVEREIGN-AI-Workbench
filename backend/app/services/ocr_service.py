import io
import json
from typing import Optional

from pypdf import PdfReader

from ..models.schemas import ExtractionResult
from .ollama_service import OllamaService


class OCRService:

    @staticmethod
    def _extract_pdf_text(file_bytes: bytes) -> str:
        """Extract embedded text from a PDF."""

        try:
            reader = PdfReader(io.BytesIO(file_bytes))

            pages = []

            for page in reader.pages:
                text = page.extract_text() or ""
                if text.strip():
                    pages.append(text)

            return "\n\n".join(pages).strip()

        except Exception as e:
            return f"PDF text extraction failed: {e}"

    @staticmethod
    def _build_extraction_prompt(
        filename: str,
        document_text: str
    ) -> str:

        return f"""
You are the document extraction component of SOVEREIGN,
an offline engineering document analysis system.

Analyze the actual document content below.

IMPORTANT RULES:

1. Use ONLY information explicitly present in the document.
2. NEVER invent equipment IDs, measurements, temperatures,
   pressures, flow rates, dates, inspectors, or engineering findings.
3. If a field is not present or not applicable, return null.
4. Determine whether this is actually an engineering/inspection
   document.
5. Preserve important technical values exactly as written.
6. Extract tables when possible.
7. Extract visible/mentioned stamps or approval markings when present.
8. The filename is NOT evidence of the document contents.

Return ONLY valid JSON with exactly these fields:

{{
  "equipment_id": null,
  "equipment_type": null,
  "observed_vibration": null,
  "operating_temperature": null,
  "operating_pressure": null,
  "flow_rate": null,
  "inspection_date": null,
  "inspector": null,
  "status": "Processed",
  "ocr_confidence": 0,
  "table_extraction_confidence": 0,
  "tables": [],
  "stamps": [],
  "raw_text": ""
}}

Document filename:
{filename}

Document content:
--------------------
{document_text}
--------------------
"""

    @classmethod
    def extract_document_data(
        cls,
        filename: str,
        file_bytes: Optional[bytes] = None
    ) -> ExtractionResult:

        # No actual content supplied
        if not file_bytes:
            return ExtractionResult(
                status="No document content available",
                raw_text=""
            )

        file_type = filename.lower()

        # Currently support text extraction from PDFs.
        if file_type.endswith(".pdf"):
            document_text = cls._extract_pdf_text(file_bytes)

        elif file_type.endswith(".txt"):
            try:
                document_text = file_bytes.decode(
                    "utf-8",
                    errors="replace"
                )
            except Exception:
                document_text = ""

        else:
            document_text = ""

        # If no embedded text was found, don't hallucinate.
        if not document_text.strip():
            return ExtractionResult(
                status="No extractable text - vision OCR required",
                ocr_confidence=0,
                table_extraction_confidence=0,
                raw_text=""
            )

        prompt = cls._build_extraction_prompt(
            filename,
            document_text
        )

        try:
            result = OllamaService.generate_json(prompt)

            # Don't allow the model to omit schema fields
            extraction = ExtractionResult(
                equipment_id=result.get("equipment_id"),
                equipment_type=result.get("equipment_type"),
                observed_vibration=result.get("observed_vibration"),
                operating_temperature=result.get(
                    "operating_temperature"
                ),
                operating_pressure=result.get(
                    "operating_pressure"
                ),
                flow_rate=result.get("flow_rate"),
                inspection_date=result.get("inspection_date"),
                inspector=result.get("inspector"),
                status=result.get("status", "Processed"),
                ocr_confidence=float(
                    result.get("ocr_confidence", 0)
                ),
                table_extraction_confidence=float(
                    result.get(
                        "table_extraction_confidence",
                        0
                    )
                ),
                tables=result.get("tables") or [],
                stamps=result.get("stamps") or [],
                raw_text=document_text
            )

            return extraction

        except Exception as e:

            return ExtractionResult(
                status=f"Extraction failed: {str(e)}",
                ocr_confidence=0,
                table_extraction_confidence=0,
                raw_text=document_text
            )