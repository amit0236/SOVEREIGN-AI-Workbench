"use client";

import React from "react";
import Image from "next/image";
import { NavTab } from "../Shell/Sidebar";
import {
  FileText,
  Search,
  Calculator,
  FileCheck,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Play,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

interface OverviewViewProps {
  onNavigate: (tab: NavTab) => void;
  onRunHeroDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onRunHeroDemo }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fade-in-up">
      {/* Hero Visual Section */}
      <div className="relative bg-sov-surface text-sov-bg rounded-2xl overflow-hidden border border-sov-borderDark shadow-xl">
        <div className="relative h-72 md:h-80 w-full overflow-hidden">
          <Image
            src="/images/refinery_hero.jpg"
            alt="Refinery Operations"
            fill
            priority
            className="object-cover opacity-35 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent" />
          
          <div className="absolute top-5 left-6 flex items-center space-x-2">
            <span className="text-xs text-sov-green font-semibold bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sov-green animate-pulse"></span>
              <span>100% Air-Gapped & Offline</span>
            </span>
            <span className="text-xs text-[#CECEC8] bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              Mangalore Refinery & Petrochemicals Ltd • Unit 3
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                Private, On-Premise Intelligence for Critical Infrastructure
              </h1>
              <p className="text-sm text-[#D4D4CE] leading-relaxed">
                Analyze confidential engineering documents, read scanned equipment inspection reports, calculate mechanical tolerances, and generate executive sign-off notes — without sending a single byte of data outside your machine.
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={onRunHeroDemo}
                className="bg-white hover:bg-sov-bg text-sov-dark px-5 py-3 text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Interactive Demo</span>
              </button>
              <button
                onClick={() => onNavigate("workbench")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-xs font-semibold rounded-xl border border-white/15 backdrop-blur-sm transition-all"
              >
                Open Workbench
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Clear Human Process */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg font-bold text-sov-text">
            How Sovereign Works
          </h2>
          <p className="text-xs text-sov-textDim">
            A secure three-stage pipeline designed for plant engineers, reliability teams, and technical officers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Ingest & Extract",
              desc: "Upload confidential scanned PDFs, equipment sheets, or P&IDs. Local Vision models extract telemetry, tables, and inspection stamps automatically.",
              icon: HardDrive,
              badge: "Local OCR"
            },
            {
              step: "02",
              title: "Cross-Reference & Calculate",
              desc: "Retrieved measurements are verified against internal SOPs and ISO standards, then validated in an isolated computation container.",
              icon: Calculator,
              badge: "RAG & Sandbox"
            },
            {
              step: "03",
              title: "Produce Business Deliverables",
              desc: "Instantly exports professional Word Observation Notes, Excel comparisons, or PowerPoint slides with traceable citations.",
              icon: FileCheck,
              badge: "Real Word / Excel"
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-sov-white border border-sov-border rounded-2xl p-6 shadow-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sov-bg flex items-center justify-center text-sov-dark group-hover:bg-sov-surface group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6]">
                    {card.badge}
                  </span>
                </div>
                <div className="text-xs text-sov-textDim font-bold uppercase tracking-wider mb-1">
                  Step {card.step}
                </div>
                <h3 className="text-base font-bold text-sov-text mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-sov-textDim leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Spotlight: P-204 Centrifugal Pump with Detailed Cutaway Diagram */}
      <div className="bg-sov-white border border-sov-border rounded-2xl p-6 shadow-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-sov-border pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-sov-red bg-sov-redLight px-2.5 py-0.5 rounded-full border border-[#E0BCBC] inline-flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sov-red"></span>
                <span>Active Inspection Case: P-204</span>
              </span>
              <span className="text-xs text-sov-textDim">API 610 BB2 Heavy Naphtha Booster Pump</span>
            </div>
            <h3 className="text-base font-bold text-sov-text mt-1.5">
              Live Rotating Machinery Health Assessment
            </h3>
          </div>

          <button
            onClick={onRunHeroDemo}
            className="bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 flex-shrink-0"
          >
            <span>Run Complete Compliance Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Image Display with Labeled Feature Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 relative h-72 rounded-xl overflow-hidden border border-sov-border bg-[#F5F5F0]">
            <Image
              src="/images/pump_cutaway.jpg"
              alt="P-204 Pump Technical Cutaway"
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="lg:col-span-4 space-y-3 text-xs">
            <div className="p-3.5 bg-sov-bg rounded-xl border border-sov-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sov-text">Drive End Vibration (DE-H)</span>
                <span className="text-sov-red font-bold text-xs bg-sov-redLight px-2 py-0.5 rounded-full border border-[#E0BCBC]">
                  7.2 mm/s RMS
                </span>
              </div>
              <p className="text-[11px] text-sov-textDim">
                Breaches ISO 10816-3 Zone D threshold (7.1 mm/s). Unrestricted operation prohibited.
              </p>
            </div>

            <div className="p-3.5 bg-sov-bg rounded-xl border border-sov-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sov-text">Bearing Housing Temp</span>
                <span className="text-sov-red font-bold text-xs bg-sov-redLight px-2 py-0.5 rounded-full border border-[#E0BCBC]">
                  84°C (+9°C Delta)
                </span>
              </div>
              <p className="text-[11px] text-sov-textDim">
                Exceeds maximum design limit of 75°C stipulated in MRPL-SOP-MNT-112.
              </p>
            </div>

            <div className="p-3.5 bg-sov-bg rounded-xl border border-sov-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sov-text">Calculated Hydraulic Power</span>
                <span className="text-sov-green font-bold text-xs bg-sov-greenLight px-2 py-0.5 rounded-full border border-[#C2D6C6]">
                  16.11 kW
                </span>
              </div>
              <p className="text-[11px] text-sov-textDim">
                Calculated inside isolated sandbox at 120 m³/h flow and 65 m head.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Live Hardware & Air-Gap Telemetry
          </div>
          <button
            onClick={() => onNavigate("verification")}
            className="text-xs text-sov-green hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View Full Air-Gap Probe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: "Inference Engine", value: "Online", desc: "Ollama / vLLM Local", status: "green" },
            { label: "Models Loaded", value: "3 / 3 Active", desc: "Reasoning, Vision, Code", status: "neutral" },
            { label: "Vector Index", value: "Ready", desc: "Qdrant / Chroma Local", status: "green" },
            { label: "OCR Engine", value: "Ready", desc: "PaddleOCR In-Process", status: "green" },
            { label: "Execution Sandbox", value: "Ready", desc: "Isolated Docker", status: "green" },
            { label: "External Network", value: "Blocked", desc: "0 Outbound Packets", status: "isolated" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-sov-white border border-sov-border p-4 rounded-xl shadow-card flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="text-xs text-sov-textDim font-medium">
                {item.label}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-sov-text">
                    {item.value}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.status === "green"
                        ? "bg-sov-green"
                        : item.status === "isolated"
                        ? "bg-sov-green ring-2 ring-sov-greenLight"
                        : "bg-sov-textMuted"
                    }`}
                  />
                </div>
                <div className="text-[11px] text-sov-textDim mt-1">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Work & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Industrial Work (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
              Recent Engineering Records
            </div>
            <span className="text-xs text-sov-textDim bg-sov-bgDarker px-2.5 py-0.5 rounded-full border border-sov-border">
              Synthetic Demonstration Data
            </span>
          </div>

          <div className="bg-sov-white border border-sov-border rounded-2xl shadow-card overflow-hidden">
            <table className="w-full text-left tech-table">
              <thead>
                <tr>
                  <th>Task / Analysis</th>
                  <th>Source Document</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="font-semibold text-xs text-sov-text">P-204 Pump Inspection Review</div>
                    <div className="text-xs text-sov-textDim">Vibration exceedance vs ISO 10816-3</div>
                  </td>
                  <td className="text-xs text-sov-textMuted font-mono">pump_inspection_204.pdf</td>
                  <td>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sov-greenLight text-sov-green font-semibold border border-[#C2D6C6] inline-flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                      <span>Completed</span>
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => onNavigate("workbench")}
                      className="text-xs text-sov-dark hover:underline font-semibold bg-sov-bg px-3 py-1.5 rounded-lg border border-sov-border transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="font-semibold text-xs text-sov-text">Pressure Vessel SOP Cross-Check</div>
                    <div className="text-xs text-sov-textDim">Hydrostatic recertification criteria</div>
                  </td>
                  <td className="text-xs text-sov-textMuted font-mono">PV-Inspection-SOP.pdf</td>
                  <td>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sov-greenLight text-sov-green font-semibold border border-[#C2D6C6] inline-flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                      <span>Completed</span>
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => onNavigate("knowledge")}
                      className="text-xs text-sov-dark hover:underline font-semibold bg-sov-bg px-3 py-1.5 rounded-lg border border-sov-border transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="font-semibold text-xs text-sov-text">Procurement Comparison</div>
                    <div className="text-xs text-sov-textDim">3-bid commercial L1 evaluation</div>
                  </td>
                  <td className="text-xs text-sov-textMuted font-mono">Vendor_Quotes.xlsx</td>
                  <td>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sov-amberLight text-sov-amber font-semibold border border-[#E0D3BC] inline-flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-amber"></span>
                      <span>In Progress</span>
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => onNavigate("artifacts")}
                      className="text-xs text-sov-dark hover:underline font-semibold bg-sov-bg px-3 py-1.5 rounded-lg border border-sov-border transition-colors"
                    >
                      Resume
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Action Cards */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Workstation Shortcuts
          </div>
          <div className="bg-sov-white border border-sov-border rounded-2xl shadow-card p-4 space-y-2.5">
            {[
              {
                title: "New Analysis",
                desc: "Compose instruction on local source files",
                target: "workbench" as NavTab,
                icon: FileText
              },
              {
                title: "Upload Documents",
                desc: "Ingest PDF, DOCX, XLSX, or P&ID scans",
                target: "documents" as NavTab,
                icon: HardDrive
              },
              {
                title: "Search Knowledge Base",
                desc: "Query internal SOPs with verified citations",
                target: "knowledge" as NavTab,
                icon: Search
              },
              {
                title: "Run Calculation",
                desc: "Execute formulas in isolated Docker sandbox",
                target: "sandbox" as NavTab,
                icon: Calculator
              },
              {
                title: "Generate Artifact",
                desc: "Build official DOCX, XLSX, or PPTX reports",
                target: "artifacts" as NavTab,
                icon: FileCheck
              }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(action.target)}
                  className="w-full text-left p-3.5 bg-sov-bg hover:bg-sov-bgDarker border border-sov-border rounded-xl flex items-center justify-between transition-all group shadow-sm hover:border-sov-borderDark2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-sov-white border border-sov-border flex items-center justify-center text-sov-text group-hover:bg-sov-surface group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-sov-text">
                        {action.title}
                      </div>
                      <div className="text-[11px] text-sov-textDim">
                        {action.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sov-textDim group-hover:text-sov-text group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
