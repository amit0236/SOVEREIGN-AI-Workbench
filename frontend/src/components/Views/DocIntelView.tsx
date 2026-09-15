"use client";

import React, { useState } from "react";
import { DocumentItem } from "../../lib/types";
import {
  Stamp,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface DocIntelViewProps {
  documents: DocumentItem[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
}

export const DocIntelView: React.FC<DocIntelViewProps> = ({
  documents,
  selectedDocId,
  onSelectDoc
}) => {
  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const extraction = currentDoc?.extraction;
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-full flex flex-col p-4 bg-sov-bg gap-4">
      {/* Top Header Card */}
      <div className="bg-sov-white border border-sov-border px-5 py-3 rounded-xl shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-normal text-sov-text">
            Document Intelligence
          </h2>
          <div className="text-xs text-sov-textDim mt-0.5">
            Local Vision OCR & Structured Tabular Extraction System
          </div>
        </div>

        {extraction && (
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-sov-bg px-3 py-1 rounded-full border border-sov-border">
              <span className="text-sov-textDim">OCR Confidence:</span>
              <span className="font-semibold text-sov-green">{extraction.ocr_confidence}%</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-sov-bg px-3 py-1 rounded-full border border-sov-border">
              <span className="text-sov-textDim">Table Extraction:</span>
              <span className="font-semibold text-sov-green">{extraction.table_extraction_confidence}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 3-Column Layout with Rounded Panels */}
      <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        {/* Left: Document List (3 cols) */}
        <div className="col-span-3 bg-sov-white border border-sov-border rounded-xl shadow-card p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sov-border">
            <span className="text-xs font-bold text-sov-text uppercase tracking-wider">
              Document Repository
            </span>
            <span className="text-xs text-sov-textDim bg-sov-bgDarker px-2 py-0.5 rounded-full">
              {documents.length} Files
            </span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = doc.id === currentDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-left text-xs ${
                    isSelected
                      ? "bg-sov-bgDarker border-sov-dark text-sov-text font-semibold shadow-sm"
                      : "bg-sov-bg hover:bg-sov-bgDarker/70 border-sov-border text-sov-textMuted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[140px] font-medium">{doc.filename}</span>
                    <span className="text-[10px] uppercase bg-sov-white px-2 py-0.5 rounded-md border border-sov-border">
                      {doc.file_type}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-sov-textDim">
                    <span>{doc.is_scanned ? "Scanned OCR" : "Digital Parsed"}</span>
                    <span className="text-sov-green font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                      <span>Parsed</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-sov-bg border border-sov-border rounded-lg text-xs space-y-1 text-sov-textDim">
            <div className="font-semibold text-sov-text uppercase text-[10px]">Ingestion Profile</div>
            <div>Engine: PaddleOCR + PyMuPDF</div>
            <div>Color Space: Greyscale 300DPI</div>
            <div>BBox Detector: DBNet++</div>
          </div>
        </div>

        {/* Center: Document Visual Representation Preview (5 cols) */}
        <div className="col-span-5 bg-[#ECECE8] border border-sov-border rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="bg-sov-white border-b border-sov-border px-4 py-2 flex items-center justify-between text-xs">
            <span className="truncate max-w-[220px] text-sov-text font-semibold">
              Preview: {currentDoc?.filename}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom((z) => Math.max(z - 15, 60))}
                className="p-1 hover:bg-sov-bgDarker text-sov-text rounded border border-sov-border"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs w-9 text-center font-medium">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 15, 140))}
                className="p-1 hover:bg-sov-bgDarker text-sov-text rounded border border-sov-border"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulated Scanned Engineering Document Sheet */}
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              className="w-[500px] min-h-[680px] bg-white border border-sov-border shadow-md rounded-lg p-8 text-sov-text text-xs transition-transform duration-150 relative select-text"
            >
              {/* Document Header */}
              <div className="border-b-2 border-sov-dark pb-3 mb-4">
                <div className="text-sm font-bold text-sov-dark">
                  MANGALORE REFINERY & PETROCHEMICALS LIMITED
                </div>
                <div className="text-xs text-sov-textDim mt-0.5">
                  Rotating Machinery Reliability Division — Field Inspection
                </div>
                <div className="text-[11px] text-sov-textDim flex justify-between mt-1">
                  <span>Ref: MRPL/RE/2026/08/P204-INSP</span>
                  <span>Date: 18/08/2026</span>
                </div>
              </div>

              {/* Tag Block */}
              <div className="bg-sov-bg p-3 rounded-lg border border-sov-border mb-4">
                <div className="font-bold text-sm text-sov-dark">
                  Equipment: {extraction?.equipment_id || "P-204"}
                </div>
                <div className="text-xs text-sov-textMuted mt-0.5">
                  {extraction?.equipment_type || "Centrifugal Pump"}
                </div>
              </div>

              {/* Scanned Text Simulation */}
              <div className="space-y-3 leading-relaxed text-xs text-sov-text">
                <p>
                  Vibration spectrum logged at DE bearing shows abnormal amplitude at 7.2 mm/s RMS.
                  Bearing housing surface temp measured at 84°C under standard operation.
                </p>

                {/* Scanned Table */}
                <div className="border border-sov-border rounded-lg overflow-hidden my-3">
                  <div className="bg-sov-bgDarker font-semibold px-3 py-1.5 text-xs border-b border-sov-border">
                    Field Telemetry Log (ISO 10816-3)
                  </div>
                  <table className="w-full text-left text-xs">
                    <tbody>
                      <tr className="border-b border-sov-border">
                        <td className="p-2 font-medium">DE Horizontal Vib</td>
                        <td className="p-2 text-sov-red font-bold">7.2 mm/s (Breach)</td>
                      </tr>
                      <tr className="border-b border-sov-border">
                        <td className="p-2 font-medium">DE Vertical Vib</td>
                        <td className="p-2">4.8 mm/s</td>
                      </tr>
                      <tr className="border-b border-sov-border">
                        <td className="p-2 font-medium">Bearing Housing Temp</td>
                        <td className="p-2 text-sov-red font-bold">84°C (Exceeded)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Flow / Differential P</td>
                        <td className="p-2">120 m³/h / 8.2 bar</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  Inspector recommendations: Handover to standby unit. Check alignment and replace rolling element bearing set.
                </p>
              </div>

              {/* Scanned Verification Stamp */}
              <div className="mt-8 border-2 border-dashed border-[#8A6A32] p-2.5 rounded-lg text-center text-xs font-bold text-[#8A6A32] uppercase rotate-[-2deg] inline-block">
                MRPL Reliability QA • Verified 18-AUG-2026
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] text-sov-textDim">
                Page 1 of {currentDoc?.page_count || 12}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Extracted Structured Information (4 cols) */}
        <div className="col-span-4 bg-sov-white border border-sov-border rounded-xl shadow-card p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sov-border">
            <span className="text-xs uppercase tracking-wider text-sov-text font-bold">
              Extracted Parameters
            </span>
            <span className="text-xs text-sov-green font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
              <span>Structured Entities</span>
            </span>
          </div>

          {extraction ? (
            <div className="space-y-4">
              {/* Equipment Metadata */}
              <div className="bg-sov-bg border border-sov-border rounded-lg p-3.5 space-y-2 text-xs">
                <div className="text-[10px] text-sov-textDim uppercase font-bold">
                  Equipment Identification
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-sov-textDim block">Equipment Tag:</span>
                    <span className="font-bold text-sov-text">{extraction.equipment_id}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-sov-textDim block">Inspection Date:</span>
                    <span className="font-medium text-sov-text">{extraction.inspection_date}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-sov-textDim block">Type / Classification:</span>
                  <span className="font-medium text-sov-text">{extraction.equipment_type}</span>
                </div>
                <div>
                  <span className="text-[11px] text-sov-textDim block">Inspection Status:</span>
                  <span className="inline-block mt-1 text-xs font-semibold text-sov-red bg-sov-redLight px-2.5 py-0.5 rounded-full border border-[#E0BCBC]">
                    {extraction.status}
                  </span>
                </div>
              </div>

              {/* Physical Telemetry */}
              <div className="bg-sov-bg border border-sov-border rounded-lg p-3.5 space-y-2 text-xs">
                <div className="text-[10px] text-sov-textDim uppercase font-bold">
                  Telemetry Readings
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-sov-border pb-1.5">
                    <span className="text-sov-textDim">Observed Vibration:</span>
                    <span className="font-bold text-sov-red">{extraction.observed_vibration}</span>
                  </div>
                  <div className="flex justify-between border-b border-sov-border pb-1.5">
                    <span className="text-sov-textDim">Operating Temperature:</span>
                    <span className="font-bold text-sov-red">{extraction.operating_temperature}</span>
                  </div>
                  <div className="flex justify-between border-b border-sov-border pb-1.5">
                    <span className="text-sov-textDim">Operating Pressure:</span>
                    <span className="font-medium text-sov-text">{extraction.operating_pressure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sov-textDim">Flow Rate:</span>
                    <span className="font-medium text-sov-text">{extraction.flow_rate}</span>
                  </div>
                </div>
              </div>

              {/* Tables Found */}
              {extraction.tables && extraction.tables.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] text-sov-textDim uppercase font-bold">
                    Extracted Tables ({extraction.tables.length})
                  </div>
                  {extraction.tables.map((tbl, idx) => (
                    <div key={idx} className="bg-sov-bg border border-sov-border rounded-lg p-3">
                      <div className="text-xs font-bold text-sov-text mb-1.5">{tbl.title}</div>
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-sov-border text-sov-textDim font-medium">
                            {tbl.headers.slice(0, 3).map((h, i) => (
                              <th key={i} className="py-1">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tbl.rows.slice(0, 3).map((r, i) => (
                            <tr key={i} className="border-b border-sov-border/50">
                              {r.slice(0, 3).map((cell, ci) => (
                                <td key={ci} className="py-1">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* Stamps */}
              {extraction.stamps && extraction.stamps.length > 0 && (
                <div className="bg-sov-bg border border-sov-border rounded-lg p-3 text-xs space-y-1.5">
                  <div className="text-[10px] text-sov-textDim uppercase font-bold flex items-center space-x-1.5">
                    <Stamp className="w-3.5 h-3.5 text-sov-amber" />
                    <span>Detected Quality Stamps</span>
                  </div>
                  {extraction.stamps.map((st, i) => (
                    <div key={i} className="text-xs text-sov-textMuted bg-sov-white p-2 rounded border border-sov-border font-medium">
                      {st}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-sov-textDim p-4 text-center">
              No extraction metadata available for this file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
