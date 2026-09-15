"use client";

import React, { useState } from "react";
import { PIDElement } from "../../lib/types";
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  FileText
} from "lucide-react";

interface PIDViewProps {
  onAnalyzeElement: (element: PIDElement) => void;
}

export const PIDView: React.FC<PIDViewProps> = ({ onAnalyzeElement }) => {
  const [zoom, setZoom] = useState(100);
  const [selectedElementTag, setSelectedElementTag] = useState<string>("P-204");
  const [showLabels, setShowLabels] = useState(true);
  const [showPipelines, setShowPipelines] = useState(true);

  const elements: PIDElement[] = [
    {
      tag: "P-204",
      name: "Heavy Naphtha Booster Pump",
      type: "Centrifugal Pump (API 610 BB2)",
      coordinates: { x: 380, y: 280, width: 95, height: 70 },
      status: "ATTENTION_REQUIRED",
      parameters: { Flow: "120 m³/h", Head: "65 m", Vib: "7.2 mm/s", Temp: "84°C" }
    },
    {
      tag: "V-204",
      name: "Suction Block Gate Valve",
      type: "Gate Valve 8\" CL300 RF",
      coordinates: { x: 220, y: 295, width: 50, height: 42 },
      status: "NORMAL",
      parameters: { Rating: "300# RF", Position: "100% OPEN", Leakage: "0 drops/min" }
    },
    {
      tag: "FT-204",
      name: "Discharge Flow Transmitter",
      type: "Orifice Differential Transmitter",
      coordinates: { x: 560, y: 220, width: 44, height: 44 },
      status: "NORMAL",
      parameters: { Range: "0-180 m³/h", Reading: "120 m³/h", Loop: "4-20 mA" }
    },
    {
      tag: "PT-204",
      name: "Discharge Pressure Transmitter",
      type: "Piezoelectric Gauge Sensor",
      coordinates: { x: 500, y: 220, width: 44, height: 44 },
      status: "ELEVATED",
      parameters: { Range: "0-15 bar", Reading: "8.2 bar", Alarm: "9.0 bar" }
    },
    {
      tag: "CV-204",
      name: "Discharge Control Valve",
      type: "Pneumatic Globe Valve (Fail Open)",
      coordinates: { x: 650, y: 220, width: 48, height: 48 },
      status: "NORMAL",
      parameters: { Position: "64%", DeltaP: "1.2 bar", Actuator: "Air-to-Close" }
    },
    {
      tag: "TT-204",
      name: "DE Bearing Temp Sensor",
      type: "Duplex PT100 RTD Sensor",
      coordinates: { x: 410, y: 230, width: 40, height: 40 },
      status: "ELEVATED",
      parameters: { MaxDesign: "75°C", Current: "84°C", Status: "HIGH ALARM" }
    }
  ];

  const selectedElement = elements.find((e) => e.tag === selectedElementTag) || elements[0];

  return (
    <div className="h-full flex flex-col p-4 bg-sov-bg gap-4">
      {/* Top Header Card */}
      <div className="bg-sov-white border border-sov-border px-5 py-3 rounded-xl shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-normal text-sov-text">
            P&ID Engineering Drawing Viewer
          </h2>
          <div className="text-xs text-sov-textDim mt-0.5">
            Drawing Ref: MRPL-PID-U3-AREA4B • Rev 4 • Vectorized Local Symbology
          </div>
        </div>

        {/* CAD Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 bg-sov-bg border border-sov-border rounded-lg p-1">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                showLabels ? "bg-sov-dark text-white shadow-sm" : "text-sov-textDim hover:text-sov-text"
              }`}
            >
              Labels
            </button>
            <button
              onClick={() => setShowPipelines(!showPipelines)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                showPipelines ? "bg-sov-dark text-white shadow-sm" : "text-sov-textDim hover:text-sov-text"
              }`}
            >
              Pipelines
            </button>
          </div>

          <div className="flex items-center space-x-1 border border-sov-border bg-sov-bg rounded-lg p-1">
            <button
              onClick={() => setZoom((z) => Math.max(z - 15, 60))}
              className="p-1 hover:bg-sov-bgDarker rounded"
            >
              <ZoomOut className="w-3.5 h-3.5 text-sov-text" />
            </button>
            <span className="w-10 text-center font-semibold text-xs">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 15, 150))}
              className="p-1 hover:bg-sov-bgDarker rounded"
            >
              <ZoomIn className="w-3.5 h-3.5 text-sov-text" />
            </button>
          </div>

          <div className="text-xs text-sov-textDim font-medium">
            Sheet 1 of 1
          </div>
        </div>
      </div>

      {/* Main Grid: CAD Canvas + Detected Elements with Rounded Panels */}
      <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        {/* CAD Drawing Canvas (8 cols) */}
        <div className="col-span-8 bg-[#F2F2EE] border border-sov-border rounded-xl shadow-card relative overflow-auto p-5 flex items-center justify-center">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center"
            }}
            className="w-[820px] h-[540px] bg-white border border-sov-border rounded-xl shadow-sm relative transition-transform duration-150 select-none overflow-hidden"
          >
            {/* Engineering Drawing Grid Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="cadGrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#F2F2ED"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cadGrid)" />

              {/* Title Block Border */}
              <rect
                x="15"
                y="15"
                width="790"
                height="510"
                rx="8"
                fill="none"
                stroke="#242424"
                strokeWidth="1.5"
              />

              {/* P&ID Pipelines */}
              {showPipelines && (
                <g stroke="#1C1C1C" strokeWidth="2.5" fill="none">
                  {/* Suction line */}
                  <line x1="100" y1="315" x2="380" y2="315" />
                  <text x="140" y="305" fontSize="10" fontFamily="sans-serif" fill="#787873" stroke="none">
                    8&quot;-HC-3021-CS (Suction Line)
                  </text>

                  {/* Discharge line */}
                  <polyline points="475,315 500,315 500,240 760,240" />
                  <text x="520" y="210" fontSize="10" fontFamily="sans-serif" fill="#787873" stroke="none">
                    6&quot;-HC-3022-CS (Discharge Line)
                  </text>

                  {/* Recirculation Bypass line */}
                  <polyline points="630,240 630,140 330,140 330,315" strokeDasharray="5,3" strokeWidth="1.5" />
                  <text x="420" y="130" fontSize="9" fontFamily="sans-serif" fill="#787873" stroke="none">
                    Min Flow Recirculation Line 3&quot;
                  </text>
                </g>
              )}
            </svg>

            {/* Interactive Equipment Symbols with Rounded Corners */}
            {elements.map((el) => {
              const isSelected = el.tag === selectedElementTag;
              const isBreached = el.status === "ATTENTION_REQUIRED" || el.status === "ELEVATED";

              return (
                <div
                  key={el.tag}
                  onClick={() => setSelectedElementTag(el.tag)}
                  style={{
                    left: `${el.coordinates.x}px`,
                    top: `${el.coordinates.y}px`,
                    width: `${el.coordinates.width}px`,
                    height: `${el.coordinates.height}px`
                  }}
                  className={`absolute rounded-lg border cursor-pointer flex flex-col items-center justify-center transition-all shadow-sm ${
                    isSelected
                      ? "border-2 border-sov-dark bg-sov-white ring-2 ring-sov-dark/10"
                      : isBreached
                      ? "border border-sov-red bg-sov-redLight/60 hover:bg-sov-redLight"
                      : "border border-sov-border bg-white hover:border-sov-dark"
                  }`}
                >
                  <span className="text-xs font-bold text-sov-text">
                    {el.tag}
                  </span>
                  {showLabels && (
                    <span className="text-[9px] text-sov-textDim truncate max-w-[90%] text-center">
                      {el.type.split(" ")[0]}
                    </span>
                  )}
                  {isBreached && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sov-red rounded-full flex items-center justify-center text-[8px] text-white font-bold ring-2 ring-white">
                      !
                    </span>
                  )}
                </div>
              );
            })}

            {/* Engineering Drawing Title Box */}
            <div className="absolute bottom-6 right-6 border border-sov-dark bg-white rounded-lg p-3 text-xs text-sov-text w-64 shadow-sm">
              <div className="font-bold border-b border-sov-border pb-1">
                MRPL Unit-3 Naphtha Fractionation
              </div>
              <div className="flex justify-between pt-1 text-sov-textDim text-[11px]">
                <span>System: P-204 Area 4B</span>
                <span>Status: Operational</span>
              </div>
              <div className="flex justify-between text-sov-textDim text-[11px]">
                <span>Standards: API 610 / ASME B31.3</span>
                <span>Rev: 04</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detected Elements & Analysis Action Panel (4 cols) */}
        <div className="col-span-4 bg-sov-white border border-sov-border rounded-xl shadow-card p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sov-border">
            <span className="text-xs uppercase tracking-wider text-sov-text font-bold">
              Detected Elements
            </span>
            <span className="text-xs text-sov-textDim bg-sov-bgDarker px-2 py-0.5 rounded-full">
              {elements.length} Identified
            </span>
          </div>

          {/* Selected Element Card */}
          <div className="bg-sov-bg border border-sov-border rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-sov-border">
              <div>
                <span className="text-sm font-bold text-sov-text">{selectedElement.tag}</span>
                <div className="text-xs text-sov-textDim">{selectedElement.name}</div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center space-x-1 ${
                  selectedElement.status === "ATTENTION_REQUIRED"
                    ? "bg-sov-redLight text-sov-red border-[#E0BCBC]"
                    : selectedElement.status === "ELEVATED"
                    ? "bg-sov-amberLight text-sov-amber border-[#E0D3BC]"
                    : "bg-sov-greenLight text-sov-green border-[#C2D6C6]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedElement.status === "ATTENTION_REQUIRED"
                      ? "bg-sov-red"
                      : selectedElement.status === "ELEVATED"
                      ? "bg-sov-amber"
                      : "bg-sov-green"
                  }`}
                />
                <span>
                  {selectedElement.status === "ATTENTION_REQUIRED"
                    ? "Attention Required"
                    : selectedElement.status === "ELEVATED"
                    ? "Elevated"
                    : "Normal"}
                </span>
              </span>
            </div>

            <div className="text-xs">
              <span className="text-[10px] text-sov-textDim uppercase font-bold">
                Equipment Type:
              </span>
              <div className="text-sov-text font-medium mt-0.5">{selectedElement.type}</div>
            </div>

            {/* Parameters Table */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-sov-textDim uppercase font-bold">
                Telemetry Parameters:
              </span>
              <div className="bg-sov-white p-3 rounded-lg border border-sov-border space-y-1.5">
                {Object.entries(selectedElement.parameters).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-sov-textDim">{key}:</span>
                    <span
                      className={`font-semibold ${
                        key === "Vib" && parseFloat(val) > 4.5
                          ? "text-sov-red"
                          : key === "Temp" && parseFloat(val) > 75
                          ? "text-sov-red"
                          : "text-sov-text"
                      }`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onAnalyzeElement(selectedElement)}
              className="w-full bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm border border-sov-borderDark flex items-center justify-center space-x-2 mt-2"
            >
              <FileText className="w-4 h-4" />
              <span>Trigger Deep Workbench Analysis</span>
            </button>
          </div>

          {/* Element Quick List */}
          <div className="space-y-2 text-xs">
            <div className="text-[10px] text-sov-textDim uppercase font-bold mb-1">
              System Element Inventory
            </div>
            {elements.map((el) => (
              <div
                key={el.tag}
                onClick={() => setSelectedElementTag(el.tag)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  el.tag === selectedElementTag
                    ? "bg-sov-bgDarker border-sov-dark text-sov-text font-semibold shadow-sm"
                    : "bg-sov-bg hover:bg-sov-bgDarker/70 border-sov-border text-sov-textMuted"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Crosshair className="w-3.5 h-3.5 text-sov-textDim" />
                  <span className="font-semibold text-sov-text">{el.tag}</span>
                  <span className="text-[11px] text-sov-textDim">({el.type.split(" ")[0]})</span>
                </div>
                <span
                  className={`text-[11px] font-semibold flex items-center space-x-1 ${
                    el.status === "ATTENTION_REQUIRED"
                      ? "text-sov-red"
                      : el.status === "ELEVATED"
                      ? "text-sov-amber"
                      : "text-sov-green"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      el.status === "ATTENTION_REQUIRED"
                        ? "bg-sov-red"
                        : el.status === "ELEVATED"
                        ? "bg-sov-amber"
                        : "bg-sov-green"
                    }`}
                  />
                  <span>
                    {el.status === "ATTENTION_REQUIRED"
                      ? "Critical"
                      : el.status === "ELEVATED"
                      ? "Warning"
                      : "Normal"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
