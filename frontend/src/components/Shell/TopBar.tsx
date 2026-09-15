"use client";

import React from "react";
import { Shield, Play } from "lucide-react";

interface TopBarProps {
  onRunHeroDemo?: () => void;
  onOpenLogin?: () => void;
  operatorId?: string;
  isDemoRunning?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onRunHeroDemo,
  onOpenLogin,
  operatorId = "TECH-01",
  isDemoRunning = false
}) => {
  return (
    <header className="h-12 bg-sov-white border-b border-sov-border px-5 flex items-center justify-between select-none z-10">
      {/* Left Workspace Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs font-medium text-sov-text">
          <span className="text-sov-textDim">Workspace:</span>
          <span className="font-semibold tracking-normal text-sov-text">Operations / Process Analysis</span>
        </div>
        <span className="text-sov-border font-light">|</span>
        <span className="text-xs text-sov-textDim">Session ID: SV-2026-9884</span>
      </div>

      {/* Center/Right Technical Telemetry Metrics */}
      <div className="flex items-center space-x-3">
        {/* Model Engine */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-sov-textDim">Model Engine:</span>
          <span className="text-sov-text font-medium bg-sov-bgDarker px-2.5 py-0.5 rounded-full border border-sov-border">
            3 Active
          </span>
        </div>

        {/* GPU */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-sov-textDim">GPU:</span>
          <span className="text-sov-text font-medium">14.2 / 24 GB</span>
        </div>

        {/* Storage */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-sov-textDim">Storage:</span>
          <span className="text-sov-text font-medium">68.4 GB Free</span>
        </div>

        {/* Network Status */}
        <div className="flex items-center space-x-1.5 text-xs border-l border-sov-border pl-3">
          <span className="inline-flex items-center space-x-1.5 text-sov-green font-semibold bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6]">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green animate-pulse"></span>
            <span>Network: Isolated</span>
          </span>
        </div>

        {/* Hero Demo Trigger Button */}
        <button
          onClick={onRunHeroDemo}
          disabled={isDemoRunning}
          className="flex items-center space-x-2 bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all border border-sov-borderDark shadow-sm disabled:opacity-50"
          title="Trigger complete end-to-end industrial inspection demonstration"
        >
          <Play className={`w-3.5 h-3.5 ${isDemoRunning ? "animate-spin" : "fill-current"}`} />
          <span>
            {isDemoRunning ? "Executing Demo..." : "Run Hero Demo"}
          </span>
        </button>

        {/* Operator Badge */}
        <button
          onClick={onOpenLogin}
          className="text-xs text-sov-text hover:bg-sov-bgDarker bg-sov-bg px-2.5 py-1 rounded-lg border border-sov-border flex items-center space-x-1.5 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
          <span className="text-sov-textDim text-[11px]">Operator:</span>
          <span className="font-semibold">{operatorId}</span>
        </button>
      </div>
    </header>
  );
};
