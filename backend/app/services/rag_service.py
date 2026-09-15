from typing import List, Dict, Any, Optional
from ..models.schemas import KnowledgeSource, Citation

class RAGService:
    @staticmethod
    def get_collections() -> List[KnowledgeSource]:
        return [
            KnowledgeSource(
                id="COL-SOP-01",
                title="MAINTENANCE SOPs",
                category="Maintenance & Reliability",
                document_code="MRPL-SOP-MNT-SERIES",
                total_pages=48,
                status="INDEXED",
                summary="Standard operating procedures for rotating equipment, centrifugal pumps, overhaul protocols, and vibration alarm limits.",
                last_indexed="06/09/2026 08:30"
            ),
            KnowledgeSource(
                id="COL-SFT-02",
                title="SAFETY PROCEDURES",
                category="Health Safety & Environment",
                document_code="MRPL-HSE-SAF-2026",
                total_pages=24,
                status="INDEXED",
                summary="Permit-to-work systems, hot work safety, toxic gas isolation, and explosive environment guidelines.",
                last_indexed="05/09/2026 14:15"
            ),
            KnowledgeSource(
                id="COL-STD-03",
                title="ENGINEERING STANDARDS",
                category="Industrial Standards",
                document_code="API-ISO-STD-REF",
                total_pages=32,
                status="INDEXED",
                summary="API 610, ISO 10816-3 vibration severity standards, ASME Section VIII Boiler and Pressure Vessel codes.",
                last_indexed="04/09/2026 11:20"
            ),
            KnowledgeSource(
                id="COL-OPS-04",
                title="OPERATING PROCEDURES",
                category="Plant Operations",
                document_code="MRPL-OPS-PROC-2026",
                total_pages=41,
                status="INDEXED",
                summary="Unit-3 crude distillation startup/shutdown procedures, valve line-up checklists, emergency cooling circuits.",
                last_indexed="06/09/2026 09:10"
            ),
            KnowledgeSource(
                id="COL-PRC-05",
                title="PROCUREMENT POLICIES",
                category="Contracts & Procurement",
                document_code="MRPL-CP-POL-2025",
                total_pages=17,
                status="INDEXED",
                summary="Public sector competitive bidding guidelines, OEM spare parts qualification, warranty and penalty clauses.",
                last_indexed="02/09/2026 16:45"
            )
        ]

    @staticmethod
    def search_knowledge(query: str, category: Optional[str] = None) -> List[Citation]:
        q = query.lower()
        citations = []
        
        # Vibration query
        if any(w in q for w in ["vibration", "pump", "acceptable", "limit", "p-204", "iso 10816", "bearing"]):
            citations.append(Citation(
                source_title="MRPL Rotating Equipment Standard Maintenance SOP",
                document_code="MRPL-SOP-MNT-204",
                section="Section 4: Vibration Limits & Surveillance",
                page=18,
                clause="Clause 4.2.1 (Centrifugal Hydrocarbon Pumps >15kW)",
                relevance_score=0.984,
                excerpt="For Class II & III pumps mounted on rigid foundations, steady-state vibration velocity exceeding 4.5 mm/s RMS indicates Zone C (Unrestricted long-term operation not permissible). Immediate visual inspection and vibration frequency analysis are mandatory. If vibration reaches 7.1 mm/s RMS (Zone D), equipment trip or planned shutdown within 24 hours must be initiated."
            ))
            citations.append(Citation(
                source_title="ISO 10816-3 Mechanical Vibration Evaluation",
                document_code="ISO-10816-3:2018",
                section="Part 3: Industrial Machines on Site",
                page=9,
                clause="Table 2: Vibration Velocity Boundary Criteria",
                relevance_score=0.942,
                excerpt="Group 1 large machines on rigid foundation: Zone A: <2.3 mm/s (Newly commissioned); Zone B: 2.3 - 4.5 mm/s (Unrestricted continuous operation); Zone C: 4.5 - 7.1 mm/s (Restricted operation, remedial action required); Zone D: >7.1 mm/s (Damage likely, trip recommended)."
            ))
            citations.append(Citation(
                source_title="Lubrication & Bearing Thermal Guidelines",
                document_code="MRPL-SOP-MNT-112",
                section="Section 3: Temperature Thresholds",
                page=12,
                clause="Clause 3.4 (Rolling Element Bearings)",
                relevance_score=0.887,
                excerpt="Maximum allowable bearing housing temperature for mineral oil ISO VG 46 lubricated pumps is 75°C. Temperatures between 75°C and 85°C mandate lubricant viscosity check, vibration spectrum evaluation, and cooling water flow verification."
            ))

        # Valve / Pressure query
        elif any(w in q for w in ["valve", "pressure", "v-204", "vessel", "hydrostatic"]):
            citations.append(Citation(
                source_title="Piping & Valves Inspection Standard",
                document_code="MRPL-SOP-PIP-105",
                section="Section 6: In-Service Valve Integrity",
                page=24,
                clause="Clause 6.3 (Emergency Isolation Valves)",
                relevance_score=0.951,
                excerpt="Isolation valves operating in hydrocarbon service must undergo seat leakage and stroke timing tests every 12 months in accordance with API 598. Zero detectable through-valve seat leakage is permitted for Class 600 emergency shut-off valves."
            ))
            citations.append(Citation(
                source_title="Pressure Safety Valve & Vessel Recertification",
                document_code="MRPL-SOP-PV-018",
                section="Section 2: Proof Testing Protocols",
                page=7,
                clause="Clause 2.1 (Hydrostatic Test Criteria)",
                relevance_score=0.915,
                excerpt="Hydrostatic proof test pressure must equal 1.5 times the maximum allowable working pressure (MAWP) held steadily for a minimum duration of 30 minutes with calibrated digital pressure logging."
            ))

        # Procurement / Vendor query
        elif any(w in q for w in ["vendor", "quote", "procurement", "cost", "comparison"]):
            citations.append(Citation(
                source_title="PSU Technical Procurement & Evaluation Manual",
                document_code="MRPL-CP-POL-2025",
                section="Section 5: Two-Bid Evaluation Framework",
                page=11,
                clause="Clause 5.4 (Technical Compliance & L1 Determination)",
                relevance_score=0.963,
                excerpt="Commercial bids shall be evaluated only for vendors meeting 100% mandatory technical specifications (API 610 12th Ed / C153 standards). L1 pricing calculation must incorporate landed lifecycle cost including 3-year mandatory OEM spares."
            ))

        # General industrial fallback
        else:
            citations.append(Citation(
                source_title="General Plant Operating Standard",
                document_code="MRPL-GEN-OPS-2026",
                section="Section 1: General Operational Compliance",
                page=3,
                clause="Clause 1.1",
                relevance_score=0.812,
                excerpt="All process parameters must be maintained within approved Design Envelope limits. Any deviation exceeding alarm limits must be logged with root cause and supervisor sign-off."
            ))
            
        return citations
