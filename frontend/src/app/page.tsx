"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "../components/Shell/Sidebar";
import { TopBar } from "../components/Shell/TopBar";
import { LoginModal } from "../components/Shell/LoginModal";

import { OverviewView } from "../components/Views/OverviewView";
import { WorkbenchView } from "../components/Views/WorkbenchView";
import { DocumentsView } from "../components/Views/DocumentsView";
import { DocIntelView } from "../components/Views/DocIntelView";
import { PIDView } from "../components/Views/PIDView";
import { KnowledgeView } from "../components/Views/KnowledgeView";
import { ModelsView } from "../components/Views/ModelsView";
import { AgentExecView } from "../components/Views/AgentExecView";
import { SandboxView } from "../components/Views/SandboxView";
import { ArtifactsView } from "../components/Views/ArtifactsView";
import { AuditView } from "../components/Views/AuditView";
import { VerificationView } from "../components/Views/VerificationView";

import {
  DocumentItem,
  ModelInfo,
  KnowledgeSource,
  ArtifactItem,
  AuditEvent,
  AnalysisResult,
  PIDElement
} from "../lib/types";

import {
  fetchDocuments,
  fetchModels,
  fetchKnowledgeCollections,
  fetchArtifacts,
  fetchAuditLogs,
  runAnalysisPipeline
} from "../lib/api";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("overview");
  const [operatorId, setOperatorId] = useState("TECH-01");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Core Data
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("DOC-P204-INSP");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [collections, setCollections] = useState<KnowledgeSource[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);

  // Pipeline Analysis State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const loadData = async () => {
    try {
      const [docsData, modelsData, colsData, artsData, auditData] = await Promise.all([
        fetchDocuments(),
        fetchModels(),
        fetchKnowledgeCollections(),
        fetchArtifacts(),
        fetchAuditLogs()
      ]);
      setDocuments(docsData);
      setModels(modelsData);
      setCollections(colsData);
      setArtifacts(artsData);
      setAuditLogs(auditData);
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // End-to-End Hero Demonstration Trigger
  const handleRunHeroDemo = async () => {
    setIsDemoRunning(true);
    setCurrentTab("workbench");
    setSelectedDocId("DOC-P204-INSP");
    setIsAnalyzing(true);

    try {
      const result = await runAnalysisPipeline(
        "Review the pump inspection report, identify abnormal readings, cross-reference the applicable maintenance procedure, and prepare a technical observation note.",
        ["DOC-P204-INSP"]
      );
      setAnalysisResult(result);
      // Reload artifacts and audit logs
      const [arts, logs] = await Promise.all([fetchArtifacts(), fetchAuditLogs()]);
      setArtifacts(arts);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setIsDemoRunning(false);
    }
  };

  const handleInspectDocIntel = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentTab("doc-intel");
  };

  const handleAnalyzePIDElement = (element: PIDElement) => {
    setSelectedDocId("DOC-P204-INSP");
    setCurrentTab("workbench");
    handleRunHeroDemo();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sov-bg font-sans select-text">
      {/* Persistent Left Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Compact Top Navigation & Telemetry Bar */}
        <TopBar
          onRunHeroDemo={handleRunHeroDemo}
          onOpenLogin={() => setIsLoginOpen(true)}
          operatorId={operatorId}
          isDemoRunning={isDemoRunning}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto bg-sov-bg">
          {currentTab === "overview" && (
            <OverviewView
              onNavigate={setCurrentTab}
              onRunHeroDemo={handleRunHeroDemo}
            />
          )}

          {currentTab === "workbench" && (
            <WorkbenchView
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
              analysisResult={analysisResult}
              onAnalysisComplete={(res) => {
                setAnalysisResult(res);
                fetchArtifacts().then(setArtifacts);
                fetchAuditLogs().then(setAuditLogs);
              }}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          )}

          {currentTab === "documents" && (
            <DocumentsView
  documents={documents}
  onSelectDoc={setSelectedDocId}
  onViewDocIntel={handleInspectDocIntel}
  onDocumentsUpdated={setDocuments}
/>
          )}

          {currentTab === "doc-intel" && (
            <DocIntelView
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
            />
          )}

          {currentTab === "pid-viewer" && (
            <PIDView onAnalyzeElement={handleAnalyzePIDElement} />
          )}

          {currentTab === "knowledge" && (
            <KnowledgeView collections={collections} />
          )}

          {currentTab === "models" && <ModelsView models={models} />}

          {currentTab === "agent-exec" && (
            <AgentExecView steps={analysisResult?.execution_steps} />
          )}

          {currentTab === "sandbox" && <SandboxView />}

          {currentTab === "artifacts" && (
            <ArtifactsView
              artifacts={artifacts}
              onRefresh={() => fetchArtifacts().then(setArtifacts)}
            />
          )}

          {currentTab === "audit" && (
            <AuditView
              logs={auditLogs}
              onRefresh={() => fetchAuditLogs().then(setAuditLogs)}
            />
          )}

          {currentTab === "verification" && <VerificationView />}
        </main>
      </div>

      {/* Operator Session Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={setOperatorId}
        currentOperatorId={operatorId}
      />
    </div>
  );
}
