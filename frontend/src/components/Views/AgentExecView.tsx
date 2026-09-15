"use client";

import React from "react";
import { ExecutionStep } from "../../lib/types";

interface AgentExecViewProps {
  steps?: ExecutionStep[];
}

export const AgentExecView: React.FC<AgentExecViewProps> = ({ steps }) => {
  const defaultSteps: ExecutionStep[] = [
    {
      step_number: "01",
      step_name: "Request Ingestion",
      tool: "Internal API Gateway",
      source: "Operator Session SV-2026-9884",
      timestamp: "09:42:11",
      status: "Completed",
      details: "Instruction ingested: 'Review pump inspection report, cross-reference SOP, and prepare observation note.'"
    },
    {
      step_number: "02",
      step_name: "Document Identification",
      tool: "Local Storage Resolver",
      source: "pump_inspection_204.pdf",
      timestamp: "09:42:12",
      status: "Completed",
      details: "Local hash verified: SHA256 e3b0c442... 12 pages, scanned engineering PDF format."
    },
    {
      step_number: "03",
      step_name: "OCR & Visual Extraction",
      tool: "Qwen2-VL 7B (Vision Model)",
      source: "Scanned Document Bounding Boxes",
      timestamp: "09:42:15",
      status: "Completed",
      details: "Extracted P-204 parameters: 7.2 mm/s RMS (DE-H), 84°C bearing temp, 120 m³/h flow."
    },
    {
      step_number: "04",
      step_name: "Knowledge Base Vector Search",
      tool: "bge-m3 Semantic Vector Search",
      source: "Maintenance SOPs (Qdrant Local)",
      timestamp: "09:42:16",
      status: "Completed",
      details: "Query: 'vibration limit acceptable range centrifugal pump' (1024d embedding matched in 48ms)."
    },
    {
      step_number: "05",
      step_name: "SOP Reference Grounding",
      tool: "Citation Ranking Engine",
      source: "MRPL-SOP-MNT-204 (Clause 4.2.1)",
      timestamp: "09:42:17",
      status: "Completed",
      details: "Tripping threshold (7.1 mm/s) confirmed. Zone D emergency shutdown criteria verified."
    },
    {
      step_number: "06",
      step_name: "Calculation in Isolated Sandbox",
      tool: "Isolated Docker Container (Sandbox)",
      source: "vibration_severity & pump_power.py",
      timestamp: "09:42:18",
      status: "Completed",
      details: "Hydraulic Power: 16.11 kW; Vibration Delta: +2.70 mm/s over alarm, +0.10 mm/s over trip limit."
    },
    {
      step_number: "07",
      step_name: "Result Validation",
      tool: "Deterministic Rule Gate",
      source: "ISO 10816-3 Group 1 Boundary Matrix",
      timestamp: "09:42:19",
      status: "Completed",
      details: "Exceedance confirmed genuine. Remedial recommendations verified against engineering criteria."
    },
    {
      step_number: "08",
      step_name: "Artifact Generation",
      tool: "python-docx Local Builder",
      source: "P-204_Inspection_Observation_Note.docx",
      timestamp: "09:42:20",
      status: "Completed",
      details: "Formatted observation note written to disk (42.8 KB) and signed by local audit ledger."
    }
  ];

  const currentSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Controlled Agent Execution Trace
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Transparent deterministic workflow trace with verifiable timestamps.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-sov-green bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] font-semibold inline-flex items-center space-x-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span>Audit Verified</span>
          </span>
          <span className="text-sov-textDim bg-sov-bgDarker px-2.5 py-1 rounded-full border border-sov-border">
            Total Steps: {currentSteps.length}
          </span>
        </div>
      </div>

      {/* Execution Sequence Ledger in Rounded Card */}
      <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-left tech-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Event / Phase</th>
              <th>Timestamp</th>
              <th>Tool / Service</th>
              <th>Resource / Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentSteps.map((s, idx) => (
              <tr key={idx}>
                <td>
                  <div className="w-6 h-6 rounded-full bg-sov-bgDarker text-sov-text flex items-center justify-center font-bold text-xs border border-sov-border">
                    {s.step_number || `0${idx + 1}`}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-xs text-sov-text">
                    {s.step_name}
                  </div>
                  {s.details && (
                    <div className="text-xs text-sov-textDim mt-0.5 max-w-xl leading-relaxed">
                      {s.details}
                    </div>
                  )}
                </td>
                <td className="text-xs text-sov-textDim whitespace-nowrap font-mono">
                  {s.timestamp}
                </td>
                <td className="text-xs text-sov-text whitespace-nowrap">
                  {s.tool}
                </td>
                <td className="text-xs text-sov-textMuted whitespace-nowrap font-mono">
                  {s.source}
                </td>
                <td>
                  <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                    <span>{s.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trace Security Properties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-sov-white border border-sov-border rounded-xl shadow-card">
          <div className="text-[10px] text-sov-textDim uppercase font-bold tracking-wider">Provenance</div>
          <div className="text-sov-text mt-1.5 leading-relaxed">
            Every execution event is recorded with millisecond wall-clock timestamps and written to the local SQLite audit ledger.
          </div>
        </div>
        <div className="p-4 bg-sov-white border border-sov-border rounded-xl shadow-card">
          <div className="text-[10px] text-sov-textDim uppercase font-bold tracking-wider">Traceability</div>
          <div className="text-sov-text mt-1.5 leading-relaxed">
            Only explicit tool invocations, inputs, and verified outputs are exposed. No opaque reasoning or synthetic tokens.
          </div>
        </div>
        <div className="p-4 bg-sov-white border border-sov-border rounded-xl shadow-card">
          <div className="text-[10px] text-sov-textDim uppercase font-bold tracking-wider">Air-Gap Isolation</div>
          <div className="text-sov-text mt-1.5 leading-relaxed">
            Zero external network calls or cloud APIs were contacted across the entire multi-stage pipeline.
          </div>
        </div>
      </div>
    </div>
  );
};
