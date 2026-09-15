"use client";

import React, { useState } from "react";
import { ArtifactItem } from "../../lib/types";
import { generateArtifact } from "../../lib/api";
import { Download, Plus } from "lucide-react";

interface ArtifactsViewProps {
  artifacts: ArtifactItem[];
  onRefresh: () => void;
}

export const ArtifactsView: React.FC<ArtifactsViewProps> = ({ artifacts, onRefresh }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("DOCX");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateArtifact(selectedType);
      onRefresh();
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Artifact Production & Export
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Automated generation of business-ready Word, Excel, and PowerPoint records
          </p>
        </div>

        {/* Generate New Artifact Bar */}
        <div className="flex items-center space-x-2.5 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-sov-white border border-sov-border px-3.5 py-2 text-sov-text font-semibold rounded-lg shadow-sm focus:outline-none"
          >
            <option value="DOCX">DOCX (Observation Note)</option>
            <option value="XLSX">XLSX (L1 Vendor Quotes)</option>
            <option value="PPTX">PPTX (Reliability Briefing)</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-sov-dark hover:bg-sov-surface text-sov-white px-4 py-2 font-semibold rounded-lg border border-sov-borderDark flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isGenerating ? "Building..." : "Generate Deliverable"}</span>
          </button>
        </div>
      </div>

      {/* Production Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Generated Deliverable Repository ({artifacts.length} Files)
          </div>
          <span className="text-xs text-sov-green font-semibold bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6]">
            Built with python-docx, openpyxl, python-pptx
          </span>
        </div>

        <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-left tech-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Document Title / File Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Generated Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((art) => {
                const isDocx = art.format === "DOCX";
                const isXlsx = art.format === "XLSX";

                return (
                  <tr key={art.id}>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          isDocx
                            ? "bg-sov-bgDarker text-sov-dark border-sov-border"
                            : isXlsx
                            ? "bg-sov-greenLight text-sov-green border-[#C2D6C6]"
                            : "bg-sov-amberLight text-sov-amber border-[#E0D3BC]"
                        }`}
                      >
                        {art.format}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-sov-text">
                        {art.title}
                      </div>
                      <div className="text-xs text-sov-textDim font-mono">
                        {art.file_name}
                      </div>
                    </td>
                    <td className="text-xs text-sov-textMuted">
                      {art.category}
                    </td>
                    <td className="text-xs text-sov-textDim">
                      {art.file_size_kb} KB
                    </td>
                    <td className="text-xs text-sov-textDim whitespace-nowrap">
                      {art.generated_at}
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                        <span>{art.status}</span>
                      </span>
                    </td>
                    <td>
                      <a
                        href={`http://127.0.0.1:8000${art.download_url}`}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-sov-dark hover:bg-sov-surface text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
