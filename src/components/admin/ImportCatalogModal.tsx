"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { sanitizeCatalogProducts } from "@/lib/catalog-service";
import { deepScanBrowserStorage, ScanResult } from "@/lib/storage-recovery";

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
  const [activeTab, setActiveTab] = useState<"scan" | "localhost" | "upload" | "paste">("scan");
  const [copiedCode, setCopiedCode] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

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

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const results = await deepScanBrowserStorage();
      setScanResults(results);
    } catch {}
    setIsScanning(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      handleScan();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-variant/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">sync_alt</span>
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-medium">
                Import & Recover Products Catalog
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Auto-scan browser storage, transfer from localhost, or import backup files.
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
        <div className="flex border-b border-surface-variant/30 px-6 bg-surface-container-lowest overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab("scan");
              handleScan();
            }}
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "scan"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">travel_explore</span>
            <span>Deep Storage Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("localhost")}
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
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
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
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
            className={`py-3 px-4 text-xs font-label-md uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
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

          {activeTab === "scan" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
                <div>
                  <h4 className="font-semibold text-primary text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">saved_search</span>
                    <span>Browser Storage Deep Scan</span>
                  </h4>
                  <p className="text-on-surface-variant text-[11px]">
                    Inspects all localStorage keys and IndexedDB databases on this origin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="px-3 py-1.5 rounded-lg border border-surface-variant hover:border-primary text-xs font-medium text-primary transition-colors flex items-center gap-1.5 bg-surface-container-low"
                >
                  <span className={`material-symbols-outlined text-sm ${isScanning ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  <span>{isScanning ? "Scanning..." : "Re-Scan"}</span>
                </button>
              </div>

              {isScanning ? (
                <div className="p-8 text-center text-on-surface-variant space-y-2">
                  <span className="material-symbols-outlined text-3xl animate-spin text-primary">
                    hourglass_top
                  </span>
                  <p>Searching all browser partitions for saved product catalogs...</p>
                </div>
              ) : scanResults.length === 0 ? (
                <div className="p-6 rounded-xl bg-surface-container-low border border-surface-variant/30 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-neutral-400">
                    inventory_2
                  </span>
                  <p className="font-medium text-primary text-sm">No secondary storage partitions found on this origin.</p>
                  <p className="text-on-surface-variant text-xs max-w-md mx-auto">
                    If you created products in an incognito window, another browser (Edge, Firefox, Safari), or another device, open that browser window to export your catalog!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-on-surface-variant font-medium">Discovered Collections in this Browser:</p>
                  {scanResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-surface-variant/50 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary text-sm font-mono">{res.source}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            {res.count} Products Found
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant">
                          Sample items: {res.sampleNames.join(", ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onImport(res.products);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
                      >
                        Restore These {res.count} Items
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
