"use client";

import React, { useState } from "react";
import { ModelInfo, ModelRoute } from "../../lib/types";
import { routeModelRequest } from "../../lib/api";
import { ArrowRight } from "lucide-react";

interface ModelsViewProps {
  models: ModelInfo[];
}

export const ModelsView: React.FC<ModelsViewProps> = ({ models }) => {
  const [testQuery, setTestQuery] = useState("Perform unit conversion from 7.5 bar to kPa in sandbox");
  const [routingResult, setRoutingResult] = useState<ModelRoute | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const handleTestRoute = async () => {
    if (!testQuery.trim()) return;
    setIsRouting(true);
    try {
      const res = await routeModelRequest(testQuery);
      setRoutingResult(res);
    } catch {
      // fallback
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Local Model Registry & Router
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            On-premise infrastructure configuration loaded from models.yaml
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-sov-text bg-sov-white border border-sov-border px-3 py-1 rounded-full font-semibold shadow-sm">
            Provider: Ollama / vLLM (Air-Gapped)
          </span>
        </div>
      </div>

      {/* Model Inventory Table */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
          Active Local Model Engines
        </div>
        <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-left tech-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Role</th>
                <th>Format</th>
                <th>Quantization</th>
                <th>VRAM Allocation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="font-semibold text-sov-text text-xs">{m.name}</div>
                    <div className="text-[11px] text-sov-textDim font-mono">{m.id}</div>
                  </td>
                  <td className="text-xs text-sov-textMuted">{m.role}</td>
                  <td className="text-xs font-mono text-sov-text">{m.format}</td>
                  <td className="text-xs font-semibold text-sov-textDim">{m.quantization}</td>
                  <td>
                    <div className="text-xs font-semibold text-sov-text">
                      {m.vram_usage} GB
                    </div>
                    <div className="w-28 bg-sov-bgDarker h-2 mt-1 rounded-full overflow-hidden border border-sov-border">
                      <div
                        className="bg-sov-dark h-full rounded-full"
                        style={{ width: `${(m.vram_usage / 12) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                      <span>{m.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure Routing Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Routing Rules Table */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Static Routing Policy Matrix
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-4 text-xs space-y-2.5">
            {[
              {
                task: "Text / Policy / SOP Questions",
                model: "Local-General (Qwen 2.5 14B)",
                reason: "Knowledge retrieval & specification cross-check"
              },
              {
                task: "Image / Scanned PDF / P&ID",
                model: "Local-Vision (Qwen2-VL 7B)",
                reason: "OCR, symbol detection, table boundary extraction"
              },
              {
                task: "Code / Calculation / Formulas",
                model: "Local-Code (Qwen2.5-Coder 7B)",
                reason: "Deterministic computation inside isolated sandbox"
              },
              {
                task: "Comprehensive Industrial Inspection",
                model: "Agent Pipeline (Multi-Model)",
                reason: "Sequential orchestration across Vision, RAG, and Code"
              }
            ].map((rule, idx) => (
              <div
                key={idx}
                className="p-3 bg-sov-bg border border-sov-border rounded-lg flex items-center justify-between hover:border-sov-borderDark2 transition-all shadow-sm"
              >
                <div>
                  <div className="font-semibold text-sov-text text-xs">{rule.task}</div>
                  <div className="text-[11px] text-sov-textDim mt-0.5">{rule.reason}</div>
                </div>
                <div className="flex items-center space-x-1 text-xs font-semibold text-sov-dark bg-sov-white px-2.5 py-1 rounded-full border border-sov-border shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 text-sov-textDim" />
                  <span>{rule.model.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Router Verification */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Router Evaluation Test
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-5 text-xs space-y-4">
            <div>
              <label className="text-xs font-semibold text-sov-text block mb-1.5">
                Test Request Query:
              </label>
              <textarea
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                rows={3}
                className="w-full bg-sov-bg border border-sov-border rounded-lg p-3 text-xs text-sov-text focus:outline-none focus:border-sov-dark resize-none shadow-sm transition-all"
              />
            </div>

            <button
              onClick={handleTestRoute}
              disabled={isRouting}
              className="w-full bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold py-2.5 rounded-lg transition-all border border-sov-borderDark shadow-sm"
            >
              {isRouting ? "Evaluating Route..." : "Evaluate Routing Decision"}
            </button>

            {routingResult && (
              <div className="bg-sov-bg border border-sov-border rounded-lg p-3.5 space-y-2 shadow-sm">
                <div className="text-[10px] text-sov-textDim uppercase font-bold">
                  Routing Decision
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sov-textDim">Target Model:</span>
                  <span className="font-semibold text-sov-dark bg-sov-white px-2.5 py-0.5 rounded-full border border-sov-border">
                    {routingResult.selected_model}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-sov-textDim">Task Classification:</span>
                  <span className="font-medium text-sov-text">{routingResult.task_type}</span>
                </div>
                <div className="border-t border-sov-border pt-1.5 text-xs text-sov-textMuted">
                  Rationale: {routingResult.reason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
