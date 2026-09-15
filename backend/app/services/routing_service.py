import yaml
from pathlib import Path
from typing import List, Dict, Any, Tuple
from ..models.schemas import ModelInfo, ModelRoute

CONFIG_PATH = Path(__file__).resolve().parent.parent.parent / "config" / "models.yaml"

class RoutingService:
    def __init__(self):
        self.config = self._load_config()

    def _load_config(self) -> Dict[str, Any]:
        if not CONFIG_PATH.exists():
            return {"models": [], "routing_rules": []}
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def get_models(self) -> List[ModelInfo]:
        models_data = self.config.get("models", [])
        return [ModelInfo(**m) for m in models_data]

    def route_request(self, task_instruction: str, has_scanned_docs: bool = False, has_calc: bool = False) -> ModelRoute:
        inst_lower = task_instruction.lower()
        
        # Rule 1: Scanned document or P&ID visual inspection
        if has_scanned_docs or any(k in inst_lower for k in ["scanned", "p&id", "drawing", "diagram", "ocr", "stamp", "schematic"]):
            return ModelRoute(
                task_type="SCANNED_DOCUMENT_OR_IMAGE",
                selected_model="local-vision",
                reason="SCANNED DOCUMENT ANALYSIS & OCR"
            )
            
        # Rule 2: Pure calculation or code execution
        if has_calc or any(k in inst_lower for k in ["calculate", "formula", "unit conversion", "vibration threshold", "hydraulic power", "convert bar to kpa"]):
            return ModelRoute(
                task_type="CALCULATION_OR_FORMULA",
                selected_model="local-code",
                reason="DETERMINISTIC NUMERICAL COMPUTATION"
            )
            
        # Rule 3: Comprehensive multi-step inspection workflow
        if any(k in inst_lower for k in ["review the pump", "inspection report", "cross-reference", "prepare a technical observation", "workflow", "end-to-end"]):
            return ModelRoute(
                task_type="COMPREHENSIVE_INSPECTION_WORKFLOW",
                selected_model="agent-pipeline",
                reason="MULTI-MODEL ORCHESTRATED WORKFLOW (VISION + RAG + CODE + GENERAL)"
            )
            
        # Rule 4: Default general reasoning & policy
        return ModelRoute(
            task_type="TEXT_POLICY_OR_SOP",
            selected_model="local-general",
            reason="KNOWLEDGE RETRIEVAL & SPECIFICATION COMPARISON"
        )
