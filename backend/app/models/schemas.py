from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ModelInfo(BaseModel):
    id: str
    name: str
    role: str
    format: str
    quantization: str
    vram_usage: float
    vram_allocated_gb: float
    context_window: int
    status: str
    category: str
    description: str

class ModelRoute(BaseModel):
    task_type: str
    selected_model: str
    reason: str

class DocumentPage(BaseModel):
    page_number: int
    ocr_confidence: float
    text_content: str
    tables_found: int
    detected_stamps: List[str] = []

class ExtractionResult(BaseModel):
    equipment_id: Optional[str] = None
    equipment_type: Optional[str] = None
    observed_vibration: Optional[str] = None
    operating_temperature: Optional[str] = None
    operating_pressure: Optional[str] = None
    flow_rate: Optional[str] = None
    inspection_date: Optional[str] = None
    inspector: Optional[str] = None
    status: str = "Requires Review"
    ocr_confidence: float = 94.8
    table_extraction_confidence: float = 97.1
    tables: List[Dict[str, Any]] = []
    stamps: List[str] = []
    raw_text: str = ""

class DocumentItem(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_kb: float
    page_count: int
    upload_time: str
    status: str # "READY", "PROCESSING", "INDEXED"
    indexed: bool
    is_scanned: bool
    extraction: Optional[ExtractionResult] = None
    is_demo: bool = False

class KnowledgeSource(BaseModel):
    id: str
    title: str
    category: str
    document_code: str
    total_pages: int
    status: str = "INDEXED"
    summary: str
    last_indexed: str

class KnowledgeSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    top_k: int = 5

class Citation(BaseModel):
    source_title: str
    document_code: str
    section: str
    page: int
    clause: str
    relevance_score: float
    excerpt: str

class CalculationRequest(BaseModel):
    task_name: str
    calculation_type: str # "unit_conversion", "pump_power", "vibration_severity", "pressure_test"
    parameters: Dict[str, Any]

class CalculationResult(BaseModel):
    task_id: str
    status: str # "SUCCESS", "FAILED"
    input_parameters: Dict[str, Any]
    output_parameters: Dict[str, Any]
    formula_used: str
    execution_time_ms: float
    sandbox_specs: Dict[str, Any]
    verification_passed: bool
    notes: str

class AnalysisRequest(BaseModel):
    task_instruction: str
    document_ids: List[str]
    session_id: Optional[str] = None
    operator_id: Optional[str] = "operator_tech_01"

class ExecutionStep(BaseModel):
    step_number: str
    step_name: str
    tool: str
    source: str
    timestamp: str
    status: str # "COMPLETED", "IN_PROGRESS", "QUEUED", "FAILED"
    details: Optional[str] = None

class AnalysisResult(BaseModel):
    session_id: str
    task_instruction: str
    routed_model: str
    routing_reason: str
    execution_steps: List[ExecutionStep]
    observations: List[str]
    extracted_data: Optional[ExtractionResult] = None
    citations: List[Citation] = []
    calculation: Optional[CalculationResult] = None
    generated_artifacts: List[Dict[str, str]] = []
    status: str
    completed_at: str

class ArtifactItem(BaseModel):
    id: str
    title: str
    file_name: str
    format: str # "DOCX", "XLSX", "PPTX", "PDF"
    category: str
    file_size_kb: float
    generated_at: str
    operator: str
    status: str = "Ready"
    download_url: str

class AuditEvent(BaseModel):
    id: str
    timestamp: str
    user: str
    action: str
    resource: str
    model: str
    status: str
    details: Optional[str] = None

class SystemStatus(BaseModel):
    inference_engine: str = "ONLINE"
    models_loaded: str = "3 / 3"
    vector_index: str = "READY"
    ocr_engine: str = "READY"
    execution_sandbox: str = "READY"
    external_network: str = "BLOCKED"
    network_isolation: Dict[str, Any] = {
        "outbound_connections": 0,
        "external_api_calls": 0,
        "telemetry_connections": 0,
        "cdn_requests": 0,
        "dns_requests": 0,
        "internet_access": "BLOCKED"
    }
    local_services: List[Dict[str, str]] = [
        {"name": "Frontend Workstation", "endpoint": "localhost:3000", "status": "ACTIVE"},
        {"name": "Backend Sovereign API", "endpoint": "localhost:8000", "status": "ACTIVE"},
        {"name": "Local Inference Core", "endpoint": "localhost:11434", "status": "ACTIVE"},
        {"name": "Vector Store (Qdrant/SQLite)", "endpoint": "localhost:6333", "status": "ACTIVE"},
        {"name": "Local OCR Engine (PaddleOCR)", "endpoint": "localhost/in-process", "status": "ACTIVE"},
        {"name": "Execution Sandbox (Docker)", "endpoint": "isolated-container", "status": "RESTRICTED"}
    ]
    hardware: Dict[str, Any] = {
        "gpu_model": "NVIDIA RTX A5000 (24GB)",
        "vram_used_gb": 14.2,
        "vram_total_gb": 24.0,
        "ram_used_gb": 18.4,
        "ram_total_gb": 64.0,
        "storage_free_gb": 68.4,
        "storage_total_gb": 512.0
    }
