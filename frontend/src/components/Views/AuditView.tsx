"use client";

import React, { useState } from "react";
import { AuditEvent } from "../../lib/types";
import { Filter, Download } from "lucide-react";

interface AuditViewProps {
  logs: AuditEvent[];
  onRefresh?: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ logs }) => {
  const [actionFilter, setActionFilter] = useState("ALL");
  const [modelFilter, setModelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = logs.filter((l) => {
    if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
    if (modelFilter !== "ALL" && l.model !== modelFilter) return false;
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    return true;
  });

  const exportAuditCSV = () => {
    const headers = ["TIMESTAMP,USER,ACTION,RESOURCE,MODEL,STATUS,DETAILS"];
    const rows = filteredLogs.map(
      (l) => `"${l.timestamp}","${l.user}","${l.action}","${l.resource}","${l.model}","${l.status}","${l.details || ""}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sovereign_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Local Immutable Audit Log
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Tamper-evident operational ledger stored locally in SQLite database
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportAuditCSV}
            className="flex items-center space-x-2 bg-sov-white hover:bg-sov-bg text-sov-text text-xs font-semibold px-4 py-2 border border-sov-border rounded-lg transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sov-textDim" />
          <span className="font-bold text-sov-text uppercase text-[11px] tracking-wider">Filters:</span>
        </div>

        <div>
          <label className="text-xs text-sov-textDim mr-1.5">Action:</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-sov-bg border border-sov-border rounded-lg px-3 py-1.5 text-sov-text focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
            <option value="OCR_PROCESS">OCR_PROCESS</option>
            <option value="KNOWLEDGE_SEARCH">KNOWLEDGE_SEARCH</option>
            <option value="CALCULATION">CALCULATION</option>
            <option value="ARTIFACT_CREATE">ARTIFACT_CREATE</option>
            <option value="ANALYSIS_PIPELINE">ANALYSIS_PIPELINE</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-sov-textDim mr-1.5">Model / Engine:</label>
          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="bg-sov-bg border border-sov-border rounded-lg px-3 py-1.5 text-sov-text focus:outline-none"
          >
            <option value="ALL">All Engines</option>
            <option value="SYSTEM">SYSTEM</option>
            <option value="local-general">local-general</option>
            <option value="local-vision">local-vision</option>
            <option value="local-code">local-code</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-sov-textDim mr-1.5">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-sov-bg border border-sov-border rounded-lg px-3 py-1.5 text-sov-text focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-sov-textDim font-medium">
          Showing {filteredLogs.length} of {logs.length} records
        </div>
      </div>

      {/* Audit Log Table in Rounded Card */}
      <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-left tech-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Engine / Model</th>
              <th>Status</th>
              <th>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((entry) => (
              <tr key={entry.id}>
                <td className="text-xs text-sov-textDim whitespace-nowrap font-mono">
                  {entry.timestamp}
                </td>
                <td className="text-xs font-semibold text-sov-text">
                  {entry.user}
                </td>
                <td>
                  <span className="text-xs font-medium text-sov-dark bg-sov-bg px-2.5 py-0.5 rounded-full border border-sov-border">
                    {entry.action}
                  </span>
                </td>
                <td className="text-xs text-sov-textMuted max-w-[160px] truncate font-mono">
                  {entry.resource}
                </td>
                <td className="text-xs text-sov-text whitespace-nowrap font-medium">
                  {entry.model}
                </td>
                <td>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center space-x-1 ${
                      entry.status === "SUCCESS"
                        ? "bg-sov-greenLight text-sov-green border-[#C2D6C6]"
                        : "bg-sov-redLight text-sov-red border-[#E0BCBC]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        entry.status === "SUCCESS" ? "bg-sov-green" : "bg-sov-red"
                      }`}
                    />
                    <span>{entry.status}</span>
                  </span>
                </td>
                <td className="text-xs text-sov-textDim max-w-md truncate">
                  {entry.details || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
