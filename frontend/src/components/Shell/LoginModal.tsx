"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (operatorId: string) => void;
  currentOperatorId: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentOperatorId
}) => {
  const [opId, setOpId] = useState(currentOperatorId);
  const workspace = "Operations / Process Analysis";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (opId.trim()) {
      onLogin(opId.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0C0C0C]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-sov-surface border border-sov-borderDark p-7 text-sov-bg rounded-2xl shadow-dropdown">
        {/* Title */}
        <div className="text-center pb-4 border-b border-sov-borderDark">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-sov-card flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-sov-white" />
            </div>
            <h2 className="text-base font-bold tracking-wide text-sov-white">
              SOVEREIGN
            </h2>
          </div>
          <div className="text-xs text-[#9E9E98] mt-0.5">
            On-Premise AI Workbench
          </div>
          <div className="text-[10px] text-sov-textDim uppercase tracking-wider mt-1 font-semibold">
            Local Compute Environment
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs text-sov-textDim mb-1.5 font-medium">
              Active Workspace
            </label>
            <input
              type="text"
              readOnly
              value={workspace}
              className="w-full bg-[#141414] border border-sov-borderDark px-3 py-2 text-xs text-[#9E9E98] rounded-lg focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs text-sov-white mb-1.5 font-medium">
              Operator ID
            </label>
            <input
              type="text"
              value={opId}
              onChange={(e) => setOpId(e.target.value)}
              placeholder="e.g. TECH-01"
              className="w-full bg-[#141414] border border-sov-borderDark px-3 py-2 text-xs text-sov-white rounded-lg focus:outline-none focus:border-sov-borderDark2"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sov-white hover:bg-sov-bgDarker text-sov-dark text-xs font-semibold py-2.5 transition-all rounded-lg mt-2 shadow-sm"
          >
            Enter Workspace
          </button>
        </form>

        {/* Bottom Air-gap affirmation */}
        <div className="mt-6 pt-3 border-t border-sov-borderDark text-center flex items-center justify-between text-xs text-sov-textDim">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span>Local System</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sov-green font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span>Network Isolated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
