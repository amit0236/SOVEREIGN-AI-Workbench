"use client";

import React, { useRef, useState } from "react";
import { DocumentItem } from "../../lib/types";
import { deleteDocument, fetchDocuments, uploadDocument } from "../../lib/api";
import {
  FileText,
  UploadCloud,
  Eye,
  Trash2
} from "lucide-react";

interface DocumentsViewProps {
  documents: DocumentItem[];
  onSelectDoc?: (id: string) => void;
  onViewDocIntel: (id: string) => void;
  onDocumentsUpdated: (documents: DocumentItem[]) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onViewDocIntel,
  onDocumentsUpdated
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

const handleFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setIsUploading(true);

  try {
    await uploadDocument(file, true);

    const updatedDocuments = await fetchDocuments();
    onDocumentsUpdated(updatedDocuments);

    alert(`${file.name} uploaded successfully.`);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Document upload failed."
    );
  } finally {
    setIsUploading(false);

    // Allow selecting the same file again
    event.target.value = "";
  }
};

  const handleDelete = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDocument(documentToDelete.id);
      onDocumentsUpdated(documents.filter((doc) => doc.id !== documentToDelete.id));
      setDocumentToDelete(null);

      try {
        onDocumentsUpdated(await fetchDocuments());
      } catch {
        // The confirmed deletion is already reflected locally; a later refresh
        // will reconcile the list if the refresh request was unavailable.
      }

      alert(`${documentToDelete.filename} deleted permanently.`);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Document deletion failed."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="border-b border-sov-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sov-text font-sans">
            Source Documents Repository
          </h2>
          <p className="text-xs text-sov-textDim mt-1">
            Local non-volatile document storage for offline optical and semantic ingestion
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
  type="file"
  ref={fileInputRef}
  className="hidden"
  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.csv"
  onChange={handleFileUpload}
/>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-sov-dark hover:bg-sov-surface text-sov-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-sov-borderDark shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Local Document</span>
          </button>
        </div>
      </div>

      {/* Supported Formats & Air-gap Notice */}
      <div className="bg-sov-white border border-sov-border rounded-xl shadow-card p-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-sov-textDim uppercase text-[11px] font-bold">Supported Formats:</span>
          <div className="flex items-center space-x-1.5">
            {["PDF", "DOCX", "XLSX", "PNG", "JPG", "CSV"].map((fmt) => (
              <span
                key={fmt}
                className="bg-sov-bg px-2.5 py-0.5 rounded-full border border-sov-border font-semibold text-sov-text text-[11px]"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-sov-green font-semibold bg-sov-greenLight px-3 py-1 rounded-full border border-[#C2D6C6]">
          <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
          <span>All Processing Occurs Locally</span>
        </div>
      </div>

      {/* Document Row Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-sov-textDim font-bold">
            Ingested Documents ({documents.length} Files)
          </div>
          <span className="text-xs text-sov-textDim bg-sov-bgDarker px-2.5 py-0.5 rounded-full border border-sov-border">
            Synthetic Refinery Dataset Pre-Seeded
          </span>
        </div>

        <div className="bg-sov-white border border-sov-border rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-left tech-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Pages / Sheets</th>
                <th>Size</th>
                <th>Ingestion Date</th>
                <th>Status</th>
                <th>Indexed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="font-semibold text-xs text-sov-text flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-sov-textDim" />
                      <span>{doc.filename}</span>
                    </div>
                    {doc.is_demo && (
                      <span className="text-[10px] text-sov-amber bg-sov-amberLight px-2 py-0.5 rounded-full border border-[#E0D3BC] mt-1 inline-block font-medium">
                        Synthetic Demonstration Data
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="text-xs font-semibold bg-sov-bg px-2.5 py-0.5 rounded-md border border-sov-border">
                      {doc.file_type}
                    </span>
                  </td>
                  <td className="text-xs text-sov-text">
                    {doc.page_count} {doc.page_count === 1 ? "page" : "pages"}
                  </td>
                  <td className="text-xs text-sov-textDim">
                    {doc.file_size_kb} KB
                  </td>
                  <td className="text-xs text-sov-textDim whitespace-nowrap">
                    {doc.upload_time}
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-sov-green bg-sov-greenLight px-2.5 py-0.5 rounded-full border border-[#C2D6C6] inline-flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sov-green"></span>
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-sov-text">
                      {doc.indexed ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDocIntel(doc.id)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-sov-bg hover:bg-sov-bgDarker text-sov-text px-3 py-1.5 rounded-lg border border-sov-border transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-sov-textDim" />
                        <span>Inspect OCR</span>
                      </button>
                      {doc.is_demo ? (
                        <span className="text-[10px] text-sov-textDim font-medium">
                          Protected demo
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setDocumentToDelete(doc);
                          }}
                          className="inline-flex items-center justify-center p-2 text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                          aria-label={`Delete ${doc.filename}`}
                          title="Delete uploaded document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {documentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0C0C]/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-document-title"
        >
          <div className="w-full max-w-md rounded-xl border border-sov-border bg-sov-white p-6 shadow-dropdown">
            <h3 id="delete-document-title" className="text-base font-bold text-sov-text">
              Delete &quot;{documentToDelete.filename}&quot;?
            </h3>
            <p className="mt-2 text-sm text-sov-textDim">
              This will permanently remove the uploaded document from local storage.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDocumentToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-sov-border px-4 py-2 text-xs font-semibold text-sov-text disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
