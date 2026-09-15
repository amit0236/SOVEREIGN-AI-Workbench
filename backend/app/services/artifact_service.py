import os
import uuid
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
from ..core.database import get_db_connection
from ..models.schemas import ArtifactItem

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from pptx import Presentation
from pptx.util import Inches as PptxInches, Pt as PptxPt
from pptx.dml.color import RGBColor as PptxRGBColor

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "storage" / "artifacts"

class ArtifactService:
    @staticmethod
    def ensure_storage_dir():
        ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    @classmethod
    def generate_docx_observation_note(cls, equipment_id: str = "P-204", operator: str = "operator_tech_01") -> ArtifactItem:
        cls.ensure_storage_dir()
        artifact_id = f"ART-{uuid.uuid4().hex[:8].upper()}"
        file_name = f"{equipment_id}_Inspection_Observation_Note.docx"
        file_path = ARTIFACTS_DIR / file_name

        doc = docx.Document()
        
        # Styles
        normal_style = doc.styles['Normal']
        normal_style.font.name = 'Arial'
        normal_style.font.size = Pt(10)
        normal_style.font.color.rgb = RGBColor(23, 23, 23)

        # Header Title
        title_p = doc.add_paragraph()
        title_run = title_p.add_run("SOVEREIGN — TECHNICAL OBSERVATION NOTE")
        title_run.bold = True
        title_run.font.size = Pt(16)
        title_run.font.color.rgb = RGBColor(17, 17, 17)

        sub_p = doc.add_paragraph()
        sub_run = sub_p.add_run("CLASSIFICATION: CONFIDENTIAL / INTERNAL TECHNICAL RECORD")
        sub_run.bold = True
        sub_run.font.size = Pt(9)
        sub_run.font.color.rgb = RGBColor(115, 115, 110)

        doc.add_paragraph("―" * 55)

        # Metadata Table
        meta_table = doc.add_table(rows=4, cols=2)
        meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        meta_data = [
            ("Document Reference:", f"SOV-OBS-2026-{equipment_id}-001"),
            ("Inspection Target:", f"{equipment_id} Heavy Naphtha Booster Pump (Centrifugal, API 610)"),
            ("Execution Timestamp:", datetime.now().strftime("%d-%b-%Y %H:%M:%S UTC+05:30")),
            ("Processing Node:", "SOVEREIGN Air-Gapped Local Intelligence Engine (SV-2026-REF3)")
        ]
        for idx, (label, val) in enumerate(meta_data):
            row = meta_table.rows[idx]
            cell_lbl = row.cells[0]
            cell_lbl.text = label
            cell_lbl.paragraphs[0].runs[0].bold = True
            row.cells[1].text = val
        doc.add_paragraph()

        # Section 1: Ingestion & OCR Telemetry
        h1 = doc.add_paragraph()
        h1_run = h1.add_run("1. SCANNED DOCUMENT OCR & EXTRACTION SUMMARY")
        h1_run.bold = True
        h1_run.font.size = Pt(12)

        doc.add_paragraph(
            f"The field inspection report for equipment {equipment_id} was ingested into local non-volatile storage. "
            "Local Vision Model (Qwen2-VL 4-bit) performed optical character recognition and tabular structural extraction "
            "with an overall confidence rating of 94.8%."
        )

        data_table = doc.add_table(rows=5, cols=4)
        data_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        headers = ["Parameter", "Measured Value", "Standard Limit", "Evaluation"]
        for c_idx, h in enumerate(headers):
            cell = data_table.rows[0].cells[c_idx]
            cell.text = h
            cell.paragraphs[0].runs[0].bold = True
        
        rows_content = [
            ["DE-H Vibration", "7.2 mm/s RMS", "4.5 mm/s (Alarm)", "CRITICAL (Zone D)"],
            ["DE-V Vibration", "4.8 mm/s RMS", "4.5 mm/s (Alarm)", "WARNING (Zone C)"],
            ["DE Bearing Temp", "84°C", "75°C Max Design", "ELEVATED (+9°C)"],
            ["Discharge Flow", "120 m³/h", "110-130 m³/h Range", "NORMAL"]
        ]
        for r_idx, row_data in enumerate(rows_content):
            row = data_table.rows[r_idx + 1]
            for c_idx, text in enumerate(row_data):
                row.cells[c_idx].text = text
        doc.add_paragraph()

        # Section 2: Governing SOP Cross-Reference
        h2 = doc.add_paragraph()
        h2_run = h2.add_run("2. LOCAL KNOWLEDGE BASE & SOP GOVERNANCE")
        h2_run.bold = True
        h2_run.font.size = Pt(12)

        doc.add_paragraph(
            "The retrieved parameter set was evaluated against local index repository 'MAINTENANCE SOPs' "
            "(MRPL-SOP-MNT-204, Section 4.2.1). Clause 4.2.1 explicitly stipulates:\n"
            "• Steady-state vibration exceeding 4.5 mm/s constitutes Zone C restricted operation.\n"
            "• Steady-state vibration equal to or exceeding 7.1 mm/s constitutes Zone D trip condition, "
            "mandating planned shutdown within 24 hours to avert catastrophic bearing cage failure."
        )

        # Section 3: Sandboxed Engineering Calculation
        h3 = doc.add_paragraph()
        h3_run = h3.add_run("3. SANDBOXED ENGINEERING COMPUTATION")
        h3_run.bold = True
        h3_run.font.size = Pt(12)

        doc.add_paragraph(
            "An isolated computation container (Docker isolated tmpfs, network disabled) executed "
            "hydraulic and vibration deviation modeling:\n"
            "• Hydraulic Power = 16.11 kW (Q = 120 m³/h, Head = 65 m, Density = 740 kg/m³)\n"
            "• Shaft Power = 22.37 kW (assumed η = 72%)\n"
            "• Alarm Threshold Exceedance Delta = +2.70 mm/s\n"
            "• Trip Threshold Exceedance Delta = +0.10 mm/s (Breached)"
        )

        # Section 4: Engineering Actions
        h4 = doc.add_paragraph()
        h4_run = h4.add_run("4. MANDATED TECHNICAL ACTION")
        h4_run.bold = True
        h4_run.font.size = Pt(12)

        doc.add_paragraph(
            "1. Initiate controlled handover to standby unit P-204B within 12 operating hours.\n"
            "2. Isolate suction and discharge block valves (V-204 and CV-204) per lock-out tag-out SOP.\n"
            "3. Conduct lube oil spectrographic sampling for metallic wear debris.\n"
            "4. Perform laser alignment and bearing replacement prior to return-to-service."
        )

        doc.add_paragraph("―" * 55)
        foot = doc.add_paragraph()
        foot_run = foot.add_run("CONFIDENTIAL RECORD PRODUCED BY SOVEREIGN AIR-GAPPED ON-PREMISE AI WORKBENCH. ZERO EXTERNAL CLOUD TELEMETRY.")
        foot_run.font.size = Pt(8)
        foot_run.font.color.rgb = RGBColor(115, 115, 110)

        doc.save(str(file_path))
        file_size_kb = round(os.path.getsize(str(file_path)) / 1024.0, 1)

        cls._register_artifact(
            artifact_id=artifact_id,
            title="Pump Inspection Observation Note",
            file_name=file_name,
            fmt="DOCX",
            category="Technical Observation",
            file_size_kb=file_size_kb,
            operator=operator,
            file_path=str(file_path)
        )

        return ArtifactItem(
            id=artifact_id,
            title="Pump Inspection Observation Note",
            file_name=file_name,
            format="DOCX",
            category="Technical Observation",
            file_size_kb=file_size_kb,
            generated_at=datetime.now().strftime("%d %b %Y %H:%M"),
            operator=operator,
            status="Ready",
            download_url=f"/api/artifacts/download/{file_name}"
        )

    @classmethod
    def generate_xlsx_comparison(cls, operator: str = "operator_tech_01") -> ArtifactItem:
        cls.ensure_storage_dir()
        artifact_id = f"ART-{uuid.uuid4().hex[:8].upper()}"
        file_name = "Vendor_Quote_Comparison.xlsx"
        file_path = ARTIFACTS_DIR / file_name

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "L1 Commercial Evaluation"

        # Styles
        header_fill = PatternFill(start_color="181818", end_color="181818", fill_type="solid")
        header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
        title_font = Font(name="Arial", size=14, bold=True, color="111111")
        border_thin = Border(
            left=Side(style='thin', color='D4D4D0'),
            right=Side(style='thin', color='D4D4D0'),
            top=Side(style='thin', color='D4D4D0'),
            bottom=Side(style='thin', color='D4D4D0')
        )

        # Title
        ws["A1"] = "SOVEREIGN COMMERCIAL EVALUATION — VENDOR QUOTE COMPARISON"
        ws["A1"].font = title_font
        ws["A2"] = "Procurement Tender Ref: MRPL/ENG/2026/P204-SPARES | Air-Gapped Local Analysis"
        ws["A2"].font = Font(name="Arial", size=10, italic=True, color="73736E")

        headers = ["Item No", "Description", "Technical Standard", "Vendor A (Sulzer)", "Vendor B (Flowserve)", "Vendor C (Kirloskar)", "Lowest Compliant (L1)"]
        for col_idx, h in enumerate(headers, start=1):
            cell = ws.cell(row=4, column=col_idx, value=h)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")

        data_rows = [
            [1, "API 610 Impeller (Duplex SS)", "ASTM A890 Gr 4A", 420000, 445000, 395000, "Vendor C"],
            [2, "Mechanical Seal Cartridge Plan 53A", "API 682 4th Ed", 185000, 192000, 178000, "Vendor C"],
            [3, "DE Rolling Element Bearing Set", "SKF Explorer 7312", 45000, 48000, 44000, "Vendor C"],
            [4, "Shaft Sleeve & Wear Rings", "AISI 410 Hardened", 65000, 68000, 62000, "Vendor C"],
            [5, "Emergency 3-Year Overhaul Spares Kit", "OEM Certified Kit", 310000, 330000, 305000, "Vendor C"],
        ]

        for row_idx, row_vals in enumerate(data_rows, start=5):
            for col_idx, val in enumerate(row_vals, start=1):
                cell = ws.cell(row=row_idx, column=col_idx, value=val)
                cell.border = border_thin
                if isinstance(val, (int, float)):
                    cell.number_format = '#,##0 "INR"'
                    cell.alignment = Alignment(horizontal="right")
                else:
                    cell.alignment = Alignment(horizontal="left")

        # Total Row
        ws["B10"] = "TOTAL LANDED COST"
        ws["B10"].font = Font(bold=True)
        ws["D10"] = "=SUM(D5:D9)"
        ws["E10"] = "=SUM(E5:E9)"
        ws["F10"] = "=SUM(F5:F9)"
        ws["G10"] = "Vendor C (L1 Qualified)"
        ws["G10"].font = Font(bold=True, color="3F6B4F")

        for c in ["D10", "E10", "F10"]:
            ws[c].number_format = '#,##0 "INR"'
            ws[c].font = Font(bold=True)

        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

        wb.save(str(file_path))
        file_size_kb = round(os.path.getsize(str(file_path)) / 1024.0, 1)

        cls._register_artifact(
            artifact_id=artifact_id,
            title="Vendor Comparison Sheet",
            file_name=file_name,
            fmt="XLSX",
            category="Procurement Analysis",
            file_size_kb=file_size_kb,
            operator=operator,
            file_path=str(file_path)
        )

        return ArtifactItem(
            id=artifact_id,
            title="Vendor Comparison Sheet",
            file_name=file_name,
            format="XLSX",
            category="Procurement Analysis",
            file_size_kb=file_size_kb,
            generated_at=datetime.now().strftime("%d %b %Y %H:%M"),
            operator=operator,
            status="Ready",
            download_url=f"/api/artifacts/download/{file_name}"
        )

    @classmethod
    def generate_pptx_review(cls, operator: str = "operator_tech_01") -> ArtifactItem:
        cls.ensure_storage_dir()
        artifact_id = f"ART-{uuid.uuid4().hex[:8].upper()}"
        file_name = "Maintenance_Review_Presentation.pptx"
        file_path = ARTIFACTS_DIR / file_name

        prs = Presentation()
        prs.slide_width = PptxInches(10)
        prs.slide_height = PptxInches(5.625) # 16:9 ratio

        # Slide 1: Title
        slide_layout = prs.slide_layouts[0]
        slide1 = prs.slides.add_slide(slide_layout)
        title1 = slide1.shapes.title
        sub1 = slide1.placeholders[1]
        title1.text = "SOVEREIGN WORKBENCH — UNIT-3 RELIABILITY REVIEW"
        sub1.text = "Technical Assessment: P-204 Booster Pump Exceedance\nAir-Gapped Local Model Pipeline | Confirmed Offline"

        # Slide 2: Technical Observations
        slide_layout2 = prs.slide_layouts[1]
        slide2 = prs.slides.add_slide(slide_layout2)
        title2 = slide2.shapes.title
        title2.text = "Key Observations & Procedural Breaches"
        body2 = slide2.placeholders[1]
        tf2 = body2.text_frame
        tf2.text = "Field Inspection Report (MRPL/RE/2026/08/P204-INSP):"
        
        p = tf2.add_paragraph()
        p.text = "• Measured Vibration: 7.2 mm/s RMS (ISO 10816 Zone D trip threshold breached)"
        p.level = 1
        
        p = tf2.add_paragraph()
        p.text = "• Bearing Housing Temperature: 84°C (+9°C over design max limit of 75°C)"
        p.level = 1
        
        p = tf2.add_paragraph()
        p.text = "• Local RAG Grounding: MRPL-SOP-MNT-204 Section 4.2.1 mandates shutdown within 24h"
        p.level = 1

        # Slide 3: Recommendations
        slide3 = prs.slides.add_slide(slide_layout2)
        title3 = slide3.shapes.title
        title3.text = "Execution Sandbox Action Plan"
        body3 = slide3.placeholders[1]
        tf3 = body3.text_frame
        tf3.text = "Sandboxed Computation & Remedial Schedule:"
        
        p = tf3.add_paragraph()
        p.text = "1. Immediate transfer of hydrocarbon line flow to redundant pump P-204B"
        p.level = 1
        p = tf3.add_paragraph()
        p.text = "2. Hot work permit and LOTO execution by Reliability Maintenance Crew"
        p.level = 1
        p = tf3.add_paragraph()
        p.text = "3. Bearing cage replacement & shaft alignment test logged to SOVEREIGN audit ledger"
        p.level = 1

        prs.save(str(file_path))
        file_size_kb = round(os.path.getsize(str(file_path)) / 1024.0, 1)

        cls._register_artifact(
            artifact_id=artifact_id,
            title="Maintenance Review Presentation",
            file_name=file_name,
            fmt="PPTX",
            category="Executive Briefing",
            file_size_kb=file_size_kb,
            operator=operator,
            file_path=str(file_path)
        )

        return ArtifactItem(
            id=artifact_id,
            title="Maintenance Review Presentation",
            file_name=file_name,
            format="PPTX",
            category="Executive Briefing",
            file_size_kb=file_size_kb,
            generated_at=datetime.now().strftime("%d %b %Y %H:%M"),
            operator=operator,
            status="Ready",
            download_url=f"/api/artifacts/download/{file_name}"
        )

    @classmethod
    def get_artifacts(cls) -> List[ArtifactItem]:
        cls.ensure_storage_dir()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, file_name, format, category, file_size_kb, generated_at, operator, status FROM artifacts ORDER BY rowid DESC")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            # Pre-generate initial three artifacts if none exist
            cls.generate_docx_observation_note()
            cls.generate_xlsx_comparison()
            cls.generate_pptx_review()
            return cls.get_artifacts()

        return [
            ArtifactItem(
                id=r["id"],
                title=r["title"],
                file_name=r["file_name"],
                format=r["format"],
                category=r["category"],
                file_size_kb=r["file_size_kb"],
                generated_at=r["generated_at"],
                operator=r["operator"],
                status=r["status"],
                download_url=f"/api/artifacts/download/{r['file_name']}"
            )
            for r in rows
        ]

    @staticmethod
    def _register_artifact(artifact_id: str, title: str, file_name: str, fmt: str, category: str, file_size_kb: float, operator: str, file_path: str):
        conn = get_db_connection()
        cursor = conn.cursor()
        now_str = datetime.now().strftime("%d %b %Y %H:%M")
        cursor.execute("""
            INSERT OR REPLACE INTO artifacts (id, title, file_name, format, category, file_size_kb, generated_at, operator, status, file_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (artifact_id, title, file_name, fmt, category, file_size_kb, now_str, operator, "Ready", file_path))
        conn.commit()
        conn.close()
