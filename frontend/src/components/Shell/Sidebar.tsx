"use client";

import React from "react";
import {
  LayoutDashboard,
  Terminal,
  FileText,
  Scan,
  Compass,
  Database,
  Cpu,
  GitFork,
  Box,
  FileCheck,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

export type NavTab =
  | "overview"
  | "workbench"
  | "documents"
  | "doc-intel"
  | "pid-viewer"
  | "knowledge"
  | "models"
  | "agent-exec"
  | "sandbox"
  | "artifacts"
  | "audit"
  | "verification";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "workbench", label: "Workbench", icon: Terminal },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "doc-intel", label: "Document Intelligence", icon: Scan },
    { id: "pid-viewer", label: "P&ID Viewer", icon: Compass },
    { id: "knowledge", label: "Knowledge Base", icon: Database },
    { id: "models", label: "Models & Router", icon: Cpu },
    { id: "agent-exec", label: "Agent Execution", icon: GitFork },
    { id: "sandbox", label: "Execution Sandbox", icon: Box },
    { id: "artifacts", label: "Artifacts", icon: FileCheck },
    { id: "audit", label: "Audit Log", icon: ShieldAlert },
    { id: "verification", label: "System Verification", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 min-w-[256px] max-w-[256px] h-screen bg-sov-dark text-sov-bg border-r border-sov-borderDark flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <div className="p-4 border-b border-sov-borderDark">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 bg-sov-green rounded-full shadow-sm" />
            <h1 className="text-base font-bold tracking-wide text-sov-white font-sans">
              SOVEREIGN
            </h1>
          </div>
          <div className="text-xs text-[#9E9E98] font-medium tracking-normal mt-1">
            On-Premise AI Workbench
          </div>
          <div className="text-[10px] text-sov-textDim tracking-wider mt-1 uppercase border-t border-[#262626] pt-1.5 font-semibold">
            Secure Local Intelligence System
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-3">
          <div className="text-[10px] uppercase tracking-wider text-sov-textDim px-3 mb-2 font-semibold">
            Workstation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs text-left transition-all font-medium rounded-lg ${
                    isActive
                      ? "bg-sov-surface text-sov-white font-semibold shadow-sm border border-sov-borderDark"
                      : "text-[#B8B8B2] hover:bg-[#222222] hover:text-sov-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-sov-white" : "text-[#888882]"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status Block */}
      <div className="p-4 border-t border-sov-borderDark bg-[#121212] m-2 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-sov-textDim font-bold">
            System Status
          </span>
          <span className="inline-flex items-center space-x-1.5 bg-sov-greenLight/10 px-2 py-0.5 rounded-full border border-sov-green/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span className="text-[10px] text-sov-green font-semibold">ONLINE</span>
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-[#9E9E98]">
          <div className="flex justify-between">
            <span>Engine:</span>
            <span className="text-sov-white font-medium">Local On-Prem</span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="text-sov-green font-semibold">Isolated</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="text-sov-white font-medium">Local Disk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
