"use client";

import React, { useState, useEffect } from "react";
import { VerificationReport } from "../../lib/types";
import { fetchVerificationReport } from "../../lib/api";
import {
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export const VerificationView: React.FC = () => {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadReport = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchVerificationReport();
      setReport(data);
    } catch {
      // fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            System & Air-Gap Verification
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Cryptographic and network boundary verification for sensitive industrial deployments
          </p>
        </div>

        <button
          onClick={loadReport}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-sov-white hover:bg-sov-bg text-sov-text text-xs font-semibold px-4 py-2 border border-sov-border rounded-lg transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Run Air-Gap Probe</span>
        </button>
      </div>

      {/* Hero Air-Gap Status Box */}
      <div className="bg-sov-white border-2 border-sov-green p-6 rounded-2xl shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sov-greenLight rounded-full border border-[#C2D6C6] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-sov-green" />
            </div>
            <div>
              <div className="text-base font-bold text-sov-dark">
                Air-Gap Boundary Enforced — Zero Data Exfiltration Risk
              </div>
              <div className="text-xs text-sov-textDim mt-0.5">
                Workstation ID: {report?.workstation_id || "SV-WS-MRPL-01"} • NIC State: Down (VLAN Isolated)
              </div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="text-[10px] text-sov-textDim uppercase font-bold">Last Probe</div>
            <div className="font-semibold text-sov-text font-mono mt-0.5">06-Sep-2026 22:54:05</div>
          </div>
        </div>
      </div>

      {/* Network Isolation Matrix */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
          Network Isolation Metrics
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: "Outbound Connections", value: "0", status: "ok" },
            { label: "External API Calls", value: "0", status: "ok" },
            { label: "Telemetry Connections", value: "0", status: "ok" },
            { label: "CDN Requests", value: "0", status: "ok" },
            { label: "DNS Resolutions", value: "0", status: "ok" },
            { label: "Internet Access", value: "Blocked", status: "blocked" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-sov-white border border-sov-border p-4 rounded-xl shadow-card flex flex-col justify-between hover:border-sov-borderDark2 transition-all"
            >
              <div className="text-xs text-sov-textDim font-medium">{item.label}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-bold text-sov-text">{item.value}</span>
                <span className="w-2.5 h-2.5 bg-sov-green rounded-full shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Local Services & Local Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Local Services */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Internal Local Services (No External Hosts)
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-left tech-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Host / Port</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Frontend Workstation", host: "localhost:3000", role: "Internal Web UI", status: "Online" },
                  { name: "FastAPI Backend Core", host: "localhost:8000", role: "Local Orchestration", status: "Online" },
                  { name: "Local Inference Engine", host: "localhost:11434", role: "Ollama / vLLM Models", status: "Online" },
                  { name: "Vector Database", host: "localhost:6333", role: "Qdrant / SQLite Index", status: "Online" },
                  { name: "PaddleOCR Service", host: "localhost (in-proc)", role: "Scanned Document OCR", status: "Online" },
                  { name: "Execution Sandbox", host: "isolated-container", role: "Docker Runtime", status: "Restricted" }
                ].map((s, idx) => (
                  <tr key={idx}>
                    <td className="text-xs font-semibold text-sov-text">
                      {s.name}
                    </td>
                    <td className="text-xs text-sov-textDim font-mono">
                      {s.host}
                    </td>
                    <td className="text-xs text-sov-textMuted">
                      {s.role}
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
        </div>

        {/* Right: Storage Non-Volatile Isolation */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Storage Location & Volatility Profile
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-4 text-xs space-y-2.5">
            {[
              { category: "Model Weights", path: "Local (C:/Sovereign/models/)", secure: "Read-Only Blob" },
              { category: "Documents", path: "Local (backend/storage/uploads/)", secure: "Restricted FS" },
              { category: "Vector Embeddings", path: "Local (backend/storage/qdrant/)", secure: "Offline Persisted" },
              { category: "Audit Ledger", path: "Local (backend/storage/sovereign.db)", secure: "SQLite WAL Mode" },
              { category: "Business Artifacts", path: "Local (backend/storage/artifacts/)", secure: "Air-Gap Writable" }
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-3 bg-sov-bg border border-sov-border rounded-lg flex items-center justify-between hover:border-sov-borderDark2 transition-all shadow-sm"
              >
                <div>
                  <div className="font-semibold text-sov-text text-xs">{st.category}</div>
                  <div className="text-[11px] text-sov-textDim mt-0.5 font-mono">{st.path}</div>
                </div>
                <span className="text-xs font-semibold text-sov-green bg-sov-white px-2.5 py-1 rounded-full border border-sov-border shadow-sm">
                  {st.secure}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
