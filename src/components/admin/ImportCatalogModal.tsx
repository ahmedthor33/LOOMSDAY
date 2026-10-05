"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { sanitizeCatalogProducts } from "@/lib/catalog-service";

interface ImportCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

export function ImportCatalogModal({
  isOpen,
  onClose,
  onImport,
}: ImportCatalogModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paste" | "upload" | "localhost">("localhost");
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleProcessJson = (raw: string) => {
    try {
      setErrorMsg(null);
      let parsed = JSON.parse(raw);

      // Handle Zustand persistence wrapper if they copied raw storage string
      if (parsed?.state?.products && Array.isArray(parsed.state.products)) {
        parsed = parsed.state.products;
      } else if (parsed?.products && Array.isArray(parsed.products)) {
        parsed = parsed.products;
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setErrorMsg("No valid product array detected in this JSON.");
        return;
      }

      const sanitized = sanitizeCatalogProducts(parsed);
      if (sanitized.length === 0) {
        setErrorMsg("Could not parse any valid product objects.");
        return;
      }

      onImport(sanitized);
      onClose();
    } catch (e: any) {
      setErrorMsg(`JSON Parse Error: ${e.message || "Invalid JSON format"}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessJson(content);
      }
    };
    reader.readAsText(file);
  };

  const localhostExtractionSnippet = `
// Run this in the Developer Tools Console on your localhost:3000 tab:
(async () => {
  const req = indexedDB.open('loomsday_db', 1);
  req.onsuccess = () => {
    const db = req.result;
    if (db.objectStoreNames.contains('keyval')) {
      const tx = db.transaction('keyval', 'readonly');
      const getReq = tx.objectStore('keyval').get('loomsday-admin-storage-v5');
      getReq.onsuccess = () => {
        let val = getReq.result;
        if (!val) val = localStorage.getItem('loomsday-admin-storage-v5');
        copy(val);
        alert('Catalog copied to clipboard! Switch back to loomsday.store and paste it into the Import box.');
      };
      return;
    }
    copy(localStorage.getItem('loomsday-admin-storage-v5'));
    alert('Catalog copied to clipboard! Switch back to loomsday.store and paste it into the Import box.');
  };
  req.onerror = () => {
    copy(localStorage.getItem('loomsday-admin-storage-v5'));
    alert('Catalog copied to clipboard! Switch back to loomsday.store and paste it into the Import box.');
  };
})();
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-variant/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">sync_alt</span>
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-medium">
                Import & Transfer Products Catalog
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Restore products created on localhost:3000, backup files, or JSON dumps.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-surface-variant/30 px-6 bg-surface-container-lowest">
          <button
            type="button"
            onClick={() => setActiveTab("localhost")}
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "localhost"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">laptop_chromebook</span>
            <span>From Localhost</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paste")}
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "paste"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">code</span>
            <span>Paste Raw JSON</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "localhost" && (
            <div className="space-y-4 text-xs text-on-surface-variant">
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/30 space-y-3">
                <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-base">lightbulb</span>
                  Why did products disappear after connecting the domain?
                </h4>
                <p>
                  Browsers isolate data strictly per domain origin. Products created while testing on{" "}
                  <code className="px-1.5 py-0.5 rounded bg-surface border border-surface-variant/50 text-primary font-mono">http://localhost:3000</code>{" "}
                  remain saved inside your localhost browser storage and are not shared with{" "}
                  <code className="px-1.5 py-0.5 rounded bg-surface border border-surface-variant/50 text-primary font-mono">https://loomsday.store</code>.
                </p>
                <div className="pt-2 border-t border-surface-variant/20">
                  <p className="font-medium text-primary mb-2">2-Step Quick Transfer:</p>
                  <ol className="list-decimal list-inside space-y-2 text-on-surface-variant">
                    <li>
                      Open your previous <span className="font-mono text-primary font-medium">http://localhost:3000/admin</span> tab, open Developer Tools (press <kbd className="px-1 py-0.5 rounded bg-surface border text-[10px]">F12</kbd>), go to the <strong>Console</strong>, and paste the code below:
                    </li>
                  </ol>
                  <div className="relative mt-2">
                    <pre className="p-3 rounded-lg bg-neutral-900 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-all">
                      {localhostExtractionSnippet}
                    </pre>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(localhostExtractionSnippet);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded bg-neutral-800 text-white hover:bg-neutral-700 text-[10px] uppercase tracking-wider font-semibold transition-colors"
                    >
                      {copiedCode ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <p className="mt-3">
                    2. Once copied, click the <strong>&ldquo;Paste Raw JSON&rdquo;</strong> tab above, paste the data, and click <strong>&ldquo;Import Now&rdquo;</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-surface-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors bg-surface-container-low">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  file_upload
                </span>
                <span className="font-medium text-primary text-sm">
                  Click to select <span className="font-mono">loomsday-catalog.json</span>
                </span>
                <span className="text-xs text-on-surface-variant mt-1">
                  Supports JSON catalog exports and backups
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === "paste" && (
            <div className="space-y-3">
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant">
                Paste Catalog JSON or LocalStorage dump:
              </label>
              <textarea
                rows={10}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[ { "name": "French Flax Linen Sheet Set", "basePrice": 285, ... } ]'
                className="w-full p-3 font-mono text-xs rounded-xl border border-surface-variant bg-surface text-primary focus:outline-none focus:border-primary resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </button>

          {activeTab === "paste" && (
            <button
              type="button"
              disabled={!jsonText.trim()}
              onClick={() => handleProcessJson(jsonText)}
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-40"
            >
              Import Now
            </button>
          )}

          {activeTab === "localhost" && (
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Next: Paste Copied Catalog &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
