"use client";

import React, { useState } from "react";
import { CalculationResult } from "../../lib/types";
import { runCalculation } from "../../lib/api";
import { Play } from "lucide-react";

export const SandboxView: React.FC = () => {
  const [conversionVal, setConversionVal] = useState("7.5");
  const [conversionFrom, setConversionFrom] = useState("bar");
  const [conversionTo, setConversionTo] = useState("kpa");
  const [conversionResult, setConversionResult] = useState<CalculationResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [flowVal, setFlowVal] = useState("120");
  const [headVal, setHeadVal] = useState("65");
  const [densityVal, setDensityVal] = useState("740");
  const [pumpResult, setPumpResult] = useState<CalculationResult | null>(null);
  const [isCalculatingPump, setIsCalculatingPump] = useState(false);

  const handleRunConversion = async () => {
    setIsConverting(true);
    try {
      const res = await runCalculation("unit_conversion", {
        value: parseFloat(conversionVal),
        from_unit: conversionFrom,
        to_unit: conversionTo
      });
      setConversionResult(res);
    } catch {
      // fallback
    } finally {
      setIsConverting(false);
    }
  };

  const handleRunPumpCalc = async () => {
    setIsCalculatingPump(true);
    try {
      const res = await runCalculation("pump_power", {
        flow_rate_m3h: parseFloat(flowVal),
        differential_head_m: parseFloat(headVal),
        density_kgm3: parseFloat(densityVal),
        pump_efficiency: 0.72
      });
      setPumpResult(res);
    } catch {
      // fallback
    } finally {
      setIsCalculatingPump(false);
    }
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Execution Environment & Sandbox
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Isolated Docker container runtime with restricted syscalls and zero outbound network access
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-sov-green bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] font-semibold flex items-center space-x-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span>Container Isolated</span>
          </span>
        </div>
      </div>

      {/* Sandbox Hardware & Isolation Specifications */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
          Container Isolation Specifications
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: "Sandbox Engine", value: "Docker Container", desc: "Linux namespaces" },
            { label: "Network Profile", value: "Disabled", desc: "--network=none" },
            { label: "CPU Limit", value: "2 Cores", desc: "cgroups cpu-quota" },
            { label: "Memory Limit", value: "2.0 GB RAM", desc: "OOM killer active" },
            { label: "Filesystem", value: "Temporary", desc: "tmpfs (ephemeral)" },
            { label: "Internet Access", value: "Blocked", desc: "Zero outbound route" }
          ].map((spec, idx) => (
            <div
              key={idx}
              className="bg-sov-white border border-sov-border p-4 rounded-xl shadow-card hover:border-sov-borderDark2 transition-all"
            >
              <div className="text-xs text-sov-textDim font-medium">{spec.label}</div>
              <div className="text-sm font-semibold text-sov-text mt-1.5">{spec.value}</div>
              <div className="text-[11px] text-sov-textDim mt-0.5">{spec.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Sandbox Execution Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Unit Conversion */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Task 01: Deterministic Unit Conversion
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-5 text-xs space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  Value:
                </label>
                <input
                  type="number"
                  value={conversionVal}
                  onChange={(e) => setConversionVal(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  From Unit:
                </label>
                <select
                  value={conversionFrom}
                  onChange={(e) => setConversionFrom(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                >
                  <option value="bar">bar</option>
                  <option value="psi">psi</option>
                  <option value="m3/h">m³/h</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  To Unit:
                </label>
                <select
                  value={conversionTo}
                  onChange={(e) => setConversionTo(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                >
                  <option value="kpa">kPa</option>
                  <option value="bar">bar</option>
                  <option value="l/s">L/s</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunConversion}
              disabled={isConverting}
              className="w-full bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold py-2.5 rounded-lg transition-all border border-sov-borderDark shadow-sm flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isConverting ? "Executing..." : "Execute in Isolated Sandbox"}</span>
            </button>

            {conversionResult && (
              <div className="bg-sov-bg border border-sov-border rounded-lg p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-sov-text">Task ID: {conversionResult.task_id}</span>
                  <span className="text-sov-green font-semibold bg-sov-greenLight px-2 py-0.5 rounded-full border border-[#C2D6C6]">
                    Computed in {conversionResult.execution_time_ms} ms
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-sov-border pt-2">
                  <span className="text-sov-textDim">Result:</span>
                  <span className="text-base font-bold text-sov-text">
                    {conversionResult.output_parameters.converted_value} {conversionResult.output_parameters.target_unit?.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-sov-textDim font-mono pt-1">
                  Formula: {conversionResult.formula_used}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Engineering Hydraulic & Motor Calculation */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Task 02: P-204 Hydraulic & Shaft Power Computation
          </div>
          <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-5 text-xs space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  Flow (m³/h):
                </label>
                <input
                  type="number"
                  value={flowVal}
                  onChange={(e) => setFlowVal(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  Head (m):
                </label>
                <input
                  type="number"
                  value={headVal}
                  onChange={(e) => setHeadVal(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-sov-text block mb-1">
                  Density (kg/m³):
                </label>
                <input
                  type="number"
                  value={densityVal}
                  onChange={(e) => setDensityVal(e.target.value)}
                  className="w-full bg-sov-bg border border-sov-border rounded-lg p-2.5 text-xs text-sov-text focus:outline-none focus:border-sov-dark shadow-sm"
                />
              </div>
            </div>

            <button
              onClick={handleRunPumpCalc}
              disabled={isCalculatingPump}
              className="w-full bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold py-2.5 rounded-lg transition-all border border-sov-borderDark shadow-sm flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCalculatingPump ? "Calculating..." : "Run Hydraulic Power Solver"}</span>
            </button>

            {pumpResult && (
              <div className="bg-sov-bg border border-sov-border rounded-lg p-4 space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-sov-text">Task ID: {pumpResult.task_id}</span>
                  <span className="text-sov-green font-semibold bg-sov-greenLight px-2 py-0.5 rounded-full border border-[#C2D6C6]">
                    Computed in {pumpResult.execution_time_ms} ms
                  </span>
                </div>
                <div className="space-y-1.5 text-xs border-t border-sov-border pt-2">
                  <div className="flex justify-between">
                    <span className="text-sov-textDim">Hydraulic Power:</span>
                    <span className="font-bold text-sov-text">
                      {pumpResult.output_parameters.hydraulic_power_kw} kW
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sov-textDim">Shaft Power Required:</span>
                    <span className="font-bold text-sov-text">
                      {pumpResult.output_parameters.required_shaft_power_kw} kW
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-sov-border pt-2 font-bold">
                    <span className="text-sov-text">Recommended Motor:</span>
                    <span className="text-sov-green font-bold">
                      {pumpResult.output_parameters.recommended_motor_rating_kw} kW (+15% margin)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
