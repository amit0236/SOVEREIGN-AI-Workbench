# SOVEREIGN — On-Premise AI Workbench
### Secure Local Intelligence System
*Designed for Industrial Refineries, Defense Facilities, PSUs, and Sensitive Government Infrastructure (Smart India Hackathon 2026 Prototype)*

---

## 1. Executive Summary

**SOVEREIGN** is a private, offline, multi-model AI workstation engineered for high-security environments where confidential documents, proprietary engineering drawings (P&IDs), and operational telemetry cannot be transmitted to external commercial cloud AI providers.

Unlike generic conversational chatbots, SOVEREIGN is built as an **industrial engineering workstation** emphasizing:
* **Air-gapped data sovereignty**: 0 outbound network requests, 0 external CDN calls, 0 cloud AI dependencies.
* **Traceable document intelligence**: Optical character recognition (OCR), tabular extraction, and stamp verification for scanned reports.
* **Grounded RAG retrieval**: Traceable citations linking observations directly to internal standard operating procedures (SOPs) and ISO/API standards.
* **Sandboxed calculation**: Isolated numerical execution (Docker container parameters) for deterministic unit conversions and engineering calculations.
* **Automated office artifact generation**: Directly generates genuine `.docx`, `.xlsx`, and `.pptx` documents using `python-docx`, `openpyxl`, and `python-pptx`.
* **Tamper-evident audit logging**: Local SQLite-backed immutable operational ledger logging all operator actions, resources, and model attributions.

---

## 2. Visual Design System

SOVEREIGN adheres strictly to an enterprise engineering visual language:
* **Palette**: Primary `#111111`, `#181818`, `#242424`; Surfaces `#F3F3F1`, `#EAEAE7`, `#FFFFFF`; Borders `#D4D4D0`, `#C8C8C3`; Text `#171717`, `#4A4A47`, `#73736E`.
* **Subtle Status Indicators**: Green `#3F6B4F`, Amber `#8A6A32`, Red `#8A3F3F`.
* **Zero Marketing Fluff**: No emojis, no gradients, no neon, no blue glowing AI effects, no floating cards, and no "magic AI" marketing copy.
* **Dense Desktop Typography**: Neutral system sans-serif (Inter / Geist) and monospaced metadata with 2px–4px rectangular border radii.

---

## 3. Workstation Modules & Views

1. **Workspace Overview**: Engineering operations telemetry grid, live inference engine status, recent industrial work logs, and quick operational actions.
2. **Main Workbench**: 3-panel secure analysis environment (local source documents, analysis instruction composer with multi-step pipeline, and evidence panel).
3. **Document Intelligence**: Scanned engineering report inspection with side-by-side visual preview, OCR confidence ratings (94.8%), extracted parameters, and certification stamps.
4. **P&ID / Engineering Drawing Viewer**: Vectorized CAD blueprint viewer with pan/zoom, interactive detected equipment (`P-204`, `V-204`, `FT-204`, `PT-204`, `CV-204`), and direct deep analysis triggers.
5. **Models & Model Router**: Configuration-driven registry (`models.yaml`) showing 3 loaded on-premise models (General Reasoning, Technical Vision, Execution Engine), VRAM allocation meters, and static routing policies.
6. **Local Knowledge Base**: 5 indexed document collections (Maintenance SOPs, Safety Procedures, Engineering Standards, Operating Procedures, Procurement Policies) with semantic search and traceable citations.
7. **Agent Execution Trace**: Controlled step-by-step pipeline trace displaying wall-clock timestamps, tools, and sources with zero hidden reasoning.
8. **Execution Sandbox**: Docker-isolated computation environment (2 cores, 2GB RAM, network disabled, temporary tmpfs) with interactive unit converters and pump hydraulic power solvers.
9. **Artifact Production**: Real file generation and download table for Word (`.docx`), Excel (`.xlsx`), and PowerPoint (`.pptx`) deliverables.
10. **Immutable Audit Log**: Searchable and filterable audit trail tracking operator actions, timestamps, and model attributions, with CSV export.
11. **Air-Gap Verification**: Real-time network boundary probe confirming 0 outbound connections, 0 DNS queries, 0 telemetry calls, and active local services.
12. **Operator Session**: Air-gapped single-node login modal with Operator ID identification.

---

## 4. End-to-End Hero Demonstration (P-204 Inspection)

Trigger the complete 10-step hero flow using the **`RUN HERO DEMO`** button in the top bar:
1. **Source Document Ingestion**: Ingests `pump_inspection_204.pdf` into local storage.
2. **Scanned Format Detection**: Automatically classifies the document as a scanned industrial report.
3. **Vision/OCR Pipeline**: Extracts equipment tag `P-204`, vibration velocity (`7.2 mm/s RMS`), and bearing temperature (`84°C`).
4. **SOP Identification**: Matches governing procedure `MRPL-SOP-MNT-204` (Clause 4.2.1).
5. **RAG Retrieval**: Retrieves ISO 10816-3 Zone D boundary criteria (>7.1 mm/s trip limit).
6. **Sandboxed Engineering Calculation**: Computes hydraulic power (16.11 kW) and exceedance delta (+2.70 mm/s over alarm, +0.10 mm/s over trip).
7. **Evidence & Observations**: Synthesizes verified technical findings and recommends scheduled handover.
8. **Real Document Production**: Automatically builds and serves `P-204_Inspection_Observation_Note.docx`.
9. **Audit Trail Logging**: Creates tamper-evident audit entries with exact timestamps and model IDs.
10. **System Verification**: Validates 0 outbound connections throughout the process.

---

## 5. Technology Stack & Running Instructions

### Backend (Python / FastAPI)
* **Framework**: FastAPI + Uvicorn
* **Database**: SQLite (`backend/storage/sovereign.db`)
* **Document Generation**: `python-docx`, `openpyxl`, `python-pptx`
* **Configuration**: `backend/config/models.yaml`

To run manually:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

### Frontend (Next.js / TypeScript / Tailwind CSS)
* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS with custom industrial color variables
* **Icons**: Local `lucide-react` SVG package

To run manually:
```bash
cd frontend
npm start -- -p 3000
# or for development: npm run dev
```

Both services run locally on:
* **Frontend UI**: `http://localhost:3000`
* **Backend API**: `http://127.0.0.1:8001`
