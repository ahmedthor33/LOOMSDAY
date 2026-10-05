import { Product } from "@/types";

export interface ScanResult {
  source: string;
  count: number;
  products: Product[];
  sampleNames: string[];
}

/**
 * Deep scans all localStorage keys and IndexedDB databases on the current origin
 * looking for any saved product collections (e.g. earlier 50 products listed by user).
 */
export async function deepScanBrowserStorage(): Promise<ScanResult[]> {
  if (typeof window === "undefined") return [];
  const results: ScanResult[] = [];

  // Helper to extract products from a parsed object
  const extractProducts = (obj: any): Product[] | null => {
    if (!obj) return null;
    let list: any[] | null = null;
    if (Array.isArray(obj)) {
      list = obj;
    } else if (Array.isArray(obj?.state?.products)) {
      list = obj.state.products;
    } else if (Array.isArray(obj?.products)) {
      list = obj.products;
    }
    if (list && list.length > 0 && list.some((item) => item && (item.name || item.slug || item.basePrice))) {
      return list as Product[];
    }
    return null;
  };

  // 1. Scan all localStorage keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      try {
        const val = localStorage.getItem(key);
        if (!val || val.length < 20) continue;
        const parsed = JSON.parse(val);
        const prods = extractProducts(parsed);
        if (prods && prods.length > 0) {
          results.push({
            source: `localStorage: "${key}"`,
            count: prods.length,
            products: prods,
            sampleNames: prods.slice(0, 3).map((p) => p.name || p.slug || "Item"),
          });
        }
      } catch {}
    }
  } catch (e) {
    console.warn("[LOOMSDAY Recovery] localStorage scan error:", e);
  }

  // 2. Scan known and discovered IndexedDB databases
  const knownDbs = ["loomsday_atelier_db", "loomsday_db", "keyval-store"];
  let discoveredDbs: string[] = [];
  try {
    if (window.indexedDB && "databases" in window.indexedDB) {
      const dbs = await window.indexedDB.databases();
      discoveredDbs = (dbs || []).map((d) => d.name).filter(Boolean) as string[];
    }
  } catch {}

  const allDbNames = Array.from(new Set([...knownDbs, ...discoveredDbs]));

  for (const dbName of allDbNames) {
    try {
      const prods = await scanSingleIndexedDB(dbName);
      if (prods && prods.length > 0) {
        results.push({
          source: `IndexedDB: "${dbName}"`,
          count: prods.length,
          products: prods,
          sampleNames: prods.slice(0, 3).map((p) => p.name || p.slug || "Item"),
        });
      }
    } catch {}
  }

  return results;
}

function scanSingleIndexedDB(dbName: string): Promise<Product[] | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(dbName);
      req.onerror = () => resolve(null);
      req.onsuccess = () => {
        const db = req.result;
        const storeNames = Array.from(db.objectStoreNames);
        if (storeNames.length === 0) {
          db.close();
          return resolve(null);
        }

        let bestResult: Product[] | null = null;
        let pending = storeNames.length;

        storeNames.forEach((sName) => {
          try {
            const tx = db.transaction(sName, "readonly");
            const store = tx.objectStore(sName);
            const getAllReq = store.getAll ? store.getAll() : null;

            if (getAllReq) {
              getAllReq.onsuccess = () => {
                const records = getAllReq.result || [];
                for (const rec of records) {
                  let parsed = rec;
                  if (typeof rec === "string") {
                    try {
                      parsed = JSON.parse(rec);
                    } catch {}
                  }
                  let list: any[] | null = null;
                  if (Array.isArray(parsed)) list = parsed;
                  else if (Array.isArray(parsed?.state?.products)) list = parsed.state.products;
                  else if (Array.isArray(parsed?.products)) list = parsed.products;

                  if (list && list.length > 0 && (!bestResult || list.length > bestResult.length)) {
                    bestResult = list as Product[];
                  }
                }
                pending--;
                if (pending === 0) {
                  db.close();
                  resolve(bestResult);
                }
              };
              getAllReq.onerror = () => {
                pending--;
                if (pending === 0) {
                  db.close();
                  resolve(bestResult);
                }
              };
            } else {
              pending--;
              if (pending === 0) {
                db.close();
                resolve(bestResult);
              }
            }
          } catch {
            pending--;
            if (pending === 0) {
              db.close();
              resolve(bestResult);
            }
          }
        });
      };
    } catch {
      resolve(null);
    }
  });
}
