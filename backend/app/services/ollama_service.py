import json
import requests
from typing import Any, Dict, Optional


class OllamaService:
    ENDPOINT = "http://localhost:11434"
    MODEL = "qwen2.5:3b"

    @classmethod
    def generate(
        cls,
        prompt: str,
        temperature: float = 0.1,
        json_output: bool = False,
    ) -> str:

        payload = {
            "model": cls.MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }

        if json_output:
            payload["format"] = "json"

        response = requests.post(
            f"{cls.ENDPOINT}/api/generate",
            json=payload,
            timeout=300
        )

        response.raise_for_status()

        data = response.json()

        return data.get("response", "").strip()

    @classmethod
    def generate_json(
        cls,
        prompt: str,
        temperature: float = 0.1,
    ) -> Dict[str, Any]:

        response = cls.generate(
            prompt=prompt,
            temperature=temperature,
            json_output=True
        )

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to recover JSON if the model wrapped it in text
            start = response.find("{")
            end = response.rfind("}")

            if start >= 0 and end > start:
                return json.loads(response[start:end + 1])

            raise ValueError(
                f"Ollama returned invalid JSON: {response}"
            )
    @classmethod
    def analyze_document(
        cls,
        instruction: str,
        extraction: dict
    ) -> list[str]:

        prompt = f"""
You are SOVEREIGN's engineering analysis assistant.

Analyze ONLY the extracted information supplied below.

User instruction:
{instruction}

Extracted document:
{json.dumps(extraction, indent=2)}

Rules:
- Do not invent facts.
- Do not invent measurements.
- Do not assume the document is a pump inspection.
- If a value is missing, say that it is unavailable.
- Separate observed facts from recommendations.
- Do not claim compliance with a standard unless the supplied
  evidence supports it.
- Return exactly a JSON object containing an "observations" array.

Format:
{{
  "observations": [
    "..."
  ]
}}
"""

        result = cls.generate_json(prompt)

        return result.get("observations", [])
