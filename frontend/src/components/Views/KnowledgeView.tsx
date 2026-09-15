"use client";

import React, { useState } from "react";
import { KnowledgeSource, Citation } from "../../lib/types";
import { searchKnowledge } from "../../lib/api";
import { Search } from "lucide-react";

interface KnowledgeViewProps {
  collections: KnowledgeSource[];
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ collections }) => {
  const [query, setQuery] = useState("What is the acceptable vibration range for this pump class?");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchKnowledge(query);
      setCitations(res);
    } catch {
      // fallback
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Local Knowledge Base
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Air-gapped semantic document indexing and traceable citation retrieval
          </p>
        </div>

        {/* Vector Engine Telemetry */}
        <div className="flex items-center space-x-2.5 text-xs">
          <div className="bg-sov-white px-3 py-1 rounded-full border border-sov-border shadow-sm">
            <span className="text-sov-textDim">Embedding Model: </span>
            <span className="font-semibold text-sov-text">bge-m3 (dense 1024d)</span>
          </div>
          <div className="bg-sov-white px-3 py-1 rounded-full border border-sov-border shadow-sm">
            <span className="text-sov-textDim">Vector Store: </span>
            <span className="font-semibold text-sov-text">Qdrant / Chroma (Local)</span>
          </div>
          <div className="bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6] text-sov-green font-semibold inline-flex items-center space-x-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
            <span>Status: Ready</span>
          </div>
        </div>
      </div>

      {/* Collections Row */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
          Indexed Document Collections
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-sov-white border border-sov-border p-4 rounded-xl shadow-card flex flex-col justify-between hover:border-sov-borderDark2 transition-all"
            >
              <div>
                <div className="text-[10px] uppercase text-sov-textDim font-medium tracking-wider">
                  {col.document_code}
                </div>
                <div className="font-bold text-xs text-sov-text mt-1.5 leading-snug">
                  {col.title}
                </div>
                <div className="text-xs text-sov-textDim mt-1">
                  {col.total_pages} Documents
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-sov-border flex justify-between items-center text-xs">
                <span className="text-sov-green font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                  <span>Indexed</span>
                </span>
                <span className="text-sov-textDim">{col.last_indexed.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Search Interface */}
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
          Search Internal Knowledge Repository
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search procedures, tolerances, ISO codes, or operating boundaries..."
            className="flex-1 bg-sov-white border border-sov-border px-4 py-2.5 text-xs text-sov-text rounded-xl focus:outline-none focus:border-sov-dark shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm border border-sov-borderDark flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? "Searching Vectors..." : "Retrieve Citations"}</span>
          </button>
        </form>

        {/* Quick Query Templates */}
        <div className="flex items-center space-x-2 text-xs text-sov-textDim">
          <span className="font-semibold text-sov-text uppercase text-[10px]">Example Queries:</span>
          {[
            "What is the acceptable vibration range for this pump class?",
            "What is the mandatory proof test pressure for pressure vessels?",
            "What are L1 procurement evaluation guidelines for OEM spares?"
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => setQuery(example)}
              className="text-sov-text hover:bg-sov-bgDarker truncate max-w-xs border border-sov-border px-2.5 py-1 rounded-full bg-sov-white transition-all shadow-sm"
            >
              &ldquo;{example}&rdquo;
            </button>
          ))}
        </div>

        {/* Search Results / Citations */}
        {citations.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-sov-textDim">
              <span className="font-semibold uppercase text-sov-text">Traceable Citations ({citations.length} Found)</span>
              <span className="bg-sov-bgDarker px-2.5 py-0.5 rounded-full border border-sov-border">Grounded in Local Repository</span>
            </div>

            <div className="space-y-3">
              {citations.map((cite, idx) => (
                <div
                  key={idx}
                  className="bg-sov-white border border-sov-border rounded-xl p-5 shadow-card space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-sov-border">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sov-text text-xs font-mono">{cite.document_code}</span>
                      <span className="text-xs text-sov-textDim">| {cite.source_title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-sov-bg px-2.5 py-0.5 rounded-full border border-sov-border text-sov-textDim">
                        Page {cite.page}
                      </span>
                      <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6]">
                        {(cite.relevance_score * 100).toFixed(1)}% Match
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-sov-text font-semibold">
                    {cite.section} — {cite.clause}
                  </div>

                  <div className="bg-sov-bg p-3.5 rounded-lg border border-sov-border text-xs text-sov-text leading-relaxed">
                    &ldquo;{cite.excerpt}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
