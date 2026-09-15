"use client";

import React, { useState } from "react";
import { DocumentItem, AnalysisResult } from "../../lib/types";
import { runAnalysisPipeline } from "../../lib/api";
import {
  FileText,
  Play,
  Download,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";

interface WorkbenchViewProps {
  documents: DocumentItem[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
  analysisResult: AnalysisResult | null;
  onAnalysisComplete: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (loading: boolean) => void;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  analysisResult,
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing
}) => {
  const [instruction, setInstruction] = useState(
    "Review the pump inspection report, identify abnormal readings, cross-reference the applicable maintenance procedure, and prepare a technical observation note."
  );
  const [activeTab, setActiveTab] = useState<"observations" | "citations" | "calculation">("observations");
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!instruction.trim()) return;
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      const docIds = selectedDocId ? [selectedDocId] : ["DOC-P204-INSP"];
      const res = await runAnalysisPipeline(instruction, docIds);
      onAnalysisComplete(res);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "The analysis pipeline could not be started."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Banner */}
      <div className="bg-sov-white border border-sov-border p-6 rounded-2xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sov-green animate-pulse"></span>
              <span>Air-Gapped Local Session</span>
            </span>
            <span className="text-xs text-sov-textDim">Session ID: SV-2026-9884</span>
          </div>
          <h1 className="text-2xl font-bold text-sov-text mt-2">
            Interactive Engineering Workbench
          </h1>
          <p className="text-xs text-sov-textDim mt-0.5">
            Select a confidential source document, specify an engineering review task, and execute a controlled multi-stage analysis pipeline.
          </p>
        </div>

        <button
          onClick={handleExecute}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-md border border-sov-borderDark disabled:opacity-50 flex-shrink-0"
        >
          <Play className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : "fill-current"}`} />
          <span>{isAnalyzing ? "Executing Pipeline..." : "Run Analysis Pipeline"}</span>
        </button>
      </div>

      {analysisError && (
        <div
          role="alert"
          className="rounded-xl border border-sov-red/30 bg-sov-redLight px-4 py-3 text-xs text-sov-red"
        >
          {analysisError} Ensure the backend is running at http://127.0.0.1:8000, or set NEXT_PUBLIC_API_URL.
        </div>
      )}

      {/* Step 1: Document Selection (Spacious Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-sov-dark text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h2 className="text-sm font-bold text-sov-text">
              Select Source Document
            </h2>
          </div>
          <span className="text-xs text-sov-textDim">
            All files are parsed locally without cloud exposure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {documents.map((doc) => {
            const isSelected = doc.id === selectedDoc?.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-sov-white border-sov-dark shadow-md ring-2 ring-sov-dark/5"
                    : "bg-sov-white hover:bg-sov-bg border-sov-border hover:border-sov-borderDark2 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sov-bg flex items-center justify-center text-sov-dark">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-sov-textDim px-2 py-0.5 bg-sov-bg rounded-md border border-sov-border">
                    {doc.file_type}
                  </span>
                </div>
                <div className="font-semibold text-xs text-sov-text truncate mb-1" title={doc.filename}>
                  {doc.filename}
                </div>
                <div className="flex items-center justify-between text-xs text-sov-textDim mt-2 pt-2 border-t border-sov-border/50">
                  <span>{doc.page_count} {doc.page_count === 1 ? "page" : "pages"}</span>
                  <span className="text-sov-green font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                    <span>Ready</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Task Instruction & Composer (Spacious Card) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-sov-dark text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h2 className="text-sm font-bold text-sov-text">
              Analysis Instruction & Templates
            </h2>
          </div>
          <span className="text-xs text-sov-textDim">
            Routed automatically to specialized local models
          </span>
        </div>

        <div className="bg-sov-white border border-sov-border rounded-2xl p-6 shadow-card space-y-4">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={3}
            placeholder="Describe the engineering or administrative task to perform against the selected documents..."
            className="w-full bg-sov-bg border border-sov-border rounded-xl p-4 text-xs text-sov-text focus:outline-none focus:border-sov-dark transition-all resize-none shadow-sm leading-relaxed"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-sov-textDim mr-1">One-Click Templates:</span>
            {[
              {
                label: "Review Pump P-204 Inspection",
                text: "Review the pump inspection report, identify abnormal readings, cross-reference the applicable maintenance procedure, and prepare a technical observation note."
              },
              {
                label: "Cross-Check Pressure Vessel SOP",
                text: "Cross-check the pressure vessel inspection sheet against MRPL-SOP-PV-018 and verify proof test pressure limits."
              },
              {
                label: "Commercial L1 Vendor Quotes",
                text: "Analyze vendor quotes, normalize landed prices including 3-year OEM spares, and determine L1 compliant bidder."
              }
            ].map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => setInstruction(tmpl.text)}
                className="text-xs bg-sov-bg hover:bg-sov-bgDarker text-sov-text border border-sov-border px-3 py-1.5 rounded-full font-medium transition-all shadow-sm"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Execution Pipeline (Spacious Cards) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-sov-dark text-white flex items-center justify-center text-xs font-bold">
            3
          </div>
          <h2 className="text-sm font-bold text-sov-text">
            Controlled Execution Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: "1", name: "Extraction", tool: "Local Ingestion", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" },
            { step: "2", name: "Visual OCR", tool: "Qwen2-VL 7B", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" },
            { step: "3", name: "SOP Search", tool: "bge-m3 + Qdrant", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" },
            { step: "4", name: "Calculation", tool: "Docker Sandbox", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" },
            { step: "5", name: "Validation", tool: "Safety Rules", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" },
            { step: "6", name: "Artifact Build", tool: "python-docx", status: isAnalyzing ? "Processing" : analysisResult ? "Done" : "Ready" }
          ].map((s, idx) => {
            const isDone = analysisResult && !isAnalyzing;
            return (
              <div
                key={idx}
                className="bg-sov-white border border-sov-border rounded-xl p-3.5 shadow-card flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-sov-bg flex items-center justify-center font-bold text-xs text-sov-text border border-sov-border">
                    {s.step}
                  </span>
                  {isDone ? (
                    <span className="text-[10px] font-bold text-sov-green bg-sov-greenLight px-2 py-0.5 rounded-full border border-[#C2D6C6]">
                      Done
                    </span>
                  ) : isAnalyzing ? (
                    <span className="text-[10px] font-bold text-sov-amber bg-sov-amberLight px-2 py-0.5 rounded-full border border-[#E0D3BC] animate-pulse">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-sov-textDim bg-sov-bg px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs text-sov-text truncate">{s.name}</div>
                <div className="text-[11px] text-sov-textDim truncate mt-0.5">{s.tool}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 4: Evidence & Generated Deliverables */}
      {analysisResult && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-sov-green text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <h2 className="text-sm font-bold text-sov-text">
                Evidence, Calculations & Official Deliverables
              </h2>
            </div>
            <span className="text-xs text-sov-green font-semibold bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sov-green"></span>
              <span>All Calculations Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Observations & Citations (7 cols) */}
            <div className="lg:col-span-7 bg-sov-white border border-sov-border rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex border-b border-sov-border space-x-2">
                {[
                  { id: "observations", label: "Key Observations" },
                  { id: "citations", label: "SOP Citations" },
                  { id: "calculation", label: "Sandbox Math" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-2 text-xs rounded-xl transition-all font-medium ${
                      activeTab === t.id
                        ? "bg-sov-dark text-white font-semibold shadow-sm"
                        : "text-sov-textDim hover:text-sov-text bg-sov-bg"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "observations" && (
                <div className="space-y-3">
                  {analysisResult.observations.map((obs, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-sov-bg border border-sov-border rounded-xl text-xs flex items-start space-x-3 shadow-sm"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sov-green flex-shrink-0 mt-1" />
                      <span className="text-sov-text leading-relaxed">{obs}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "citations" && (
                <div className="space-y-3">
                  {analysisResult.citations.map((cite, idx) => (
                    <div key={idx} className="p-4 bg-sov-bg border border-sov-border rounded-xl space-y-2 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-sov-text">
                        <span className="font-mono">{cite.document_code}</span>
                        <span className="text-sov-green font-semibold bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6]">
                          {(cite.relevance_score * 100).toFixed(1)}% Match
                        </span>
                      </div>
                      <div className="text-xs text-sov-textDim">
                        {cite.source_title} — {cite.clause} (Page {cite.page})
                      </div>
                      <p className="text-xs text-sov-text bg-sov-white p-3 rounded-lg border border-sov-border leading-relaxed">
                        &ldquo;{cite.excerpt}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "calculation" && analysisResult.calculation && (
                <div className="p-4 bg-sov-bg border border-sov-border rounded-xl space-y-3 text-xs shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-sov-border">
                    <span className="font-bold text-sov-text">Task ID: {analysisResult.calculation.task_id}</span>
                    <span className="text-xs font-semibold text-sov-red bg-sov-redLight px-3 py-1 rounded-full border border-[#E0BCBC]">
                      Trip Threshold Breached
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sov-textDim block mb-1">Formula Applied:</span>
                    <div className="bg-sov-white p-2.5 rounded-lg border border-sov-border font-mono text-xs text-sov-text">
                      {analysisResult.calculation.formula_used}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-sov-textDim">Measured Vibration:</span>
                      <span className="font-bold text-sov-red">7.20 mm/s RMS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sov-textDim">Allowable Alarm Limit:</span>
                      <span className="font-medium text-sov-text">4.50 mm/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sov-textDim">ISO 10816 Trip Limit:</span>
                      <span className="font-medium text-sov-text">7.10 mm/s</span>
                    </div>
                    <div className="flex justify-between border-t border-sov-border pt-1.5 font-bold">
                      <span className="text-sov-text">Exceedance Delta:</span>
                      <span className="text-sov-red">+2.70 mm/s over alarm limit</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Direct Deliverable Download (5 cols) */}
            <div className="lg:col-span-5 bg-sov-white border border-sov-border rounded-2xl p-6 shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase text-sov-textDim font-bold tracking-wider mb-2">
                  Official Business Deliverable
                </div>
                <h3 className="text-base font-bold text-sov-text">
                  Signed Observation Note
                </h3>
                <p className="text-xs text-sov-textDim mt-1 leading-relaxed">
                  Generated automatically by Sovereign on this machine. Ready for sign-off by refinery lead reliability inspectors.
                </p>

                {analysisResult.generated_artifacts.map((art) => (
                  <div
                    key={art.id}
                    className="mt-4 p-4 bg-sov-bg border border-sov-border rounded-xl space-y-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-sov-greenLight border border-[#C2D6C6] flex items-center justify-center text-sov-green">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-sov-text font-mono">
                          {art.filename}
                        </div>
                        <div className="text-[11px] text-sov-textDim">
                          Format: {art.format} • Produced Offline
                        </div>
                      </div>
                    </div>

                    <a
                      href={`http://127.0.0.1:8000${art.url}`}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold py-3 rounded-xl transition-all shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Word Report (.docx)</span>
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-sov-border text-[11px] text-sov-textDim">
                Recorded into local immutable audit ledger with SHA-256 integrity tag.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
