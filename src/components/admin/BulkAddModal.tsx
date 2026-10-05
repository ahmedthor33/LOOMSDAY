"use client";

import React, { useState } from "react";
import { Product } from "@/types";

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProducts: (products: Product[]) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  bedsheets: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
  pillows: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZln3uLX8fzZHDzCdaDgClEvINVhmgMFiG4LsS37402s-SGkXCoE-TIQUWYQ1VX43haCPKu1WNH7BQaD8dnuGl_BXE7OZhLfJ8XcDReVMe9ij43mIRCzskGIHasidrAkhdA9-DJbD0cUNCDiX3kmjrd5ayu3p-M_XEE7KUfQHaP4S7q3kc4IDU28mLbYpUATW3foxTcK2jNND0uSjpwPbtrqE39A80lzluICl4QyPAiAmbRiBPNq_Bjg",
  duvets: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtOoYRRk0vGHuHkhoXB0ih8gsU0xTM_GGMq5APfzivgWXTvPdiG1uI5jfW5mWymwl1GqLYK1sXDsPR60PueZgV_M9jJ6mR4_ORPyDSiIL6iowMgRPg0-4jAEit5AXiKX7v-AEly6B792PSm3XJMHU-6RS572no-rMjGSSppdgxpLhDfgv4UU7c6EJ6R15wlZW6Qn1QOO6xcHPjvGne-45X8aJ-DoUpGwVFICvJVHXa8qcD5tp2I1-uMg",
};

export function BulkAddModal({ isOpen, onClose, onAddProducts }: BulkAddModalProps) {
  const [textInput, setTextInput] = useState("");
  const [defaultCategory, setDefaultCategory] = useState<"bedsheets" | "pillows" | "duvets">("bedsheets");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessBulk = () => {
    setErrorMsg(null);
    if (!textInput.trim()) {
      setErrorMsg("Please enter at least one product name or line.");
      return;
    }

    const lines = textInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));

    const newProducts: Product[] = [];
    const timestamp = Date.now();

    lines.forEach((line, index) => {
      // Parse line format: Name, Price, Category (optional), Material (optional)
      // Supports tab-separated (from Excel) or comma-separated
      const parts = line.includes("\t")
        ? line.split("\t").map((p) => p.trim())
        : line.split(",").map((p) => p.trim());

      const name = parts[0] || `Luxury Linen Piece ${index + 1}`;
      const rawPrice = parts[1] ? parts[1].replace(/[^0-9.]/g, "") : "";
      const basePrice = Number(rawPrice) > 0 ? Number(rawPrice) : 24500;

      let catStr = (parts[2] || defaultCategory).toLowerCase();
      let category: "bedsheets" | "pillows" | "duvets" = defaultCategory;
      if (catStr.includes("pillow") || catStr.includes("sham")) category = "pillows";
      else if (catStr.includes("duvet") || catStr.includes("insert")) category = "duvets";
      else if (catStr.includes("bed") || catStr.includes("sheet")) category = "bedsheets";

      const material = parts[3] || "100% French Flax Linen";

      const slugBase = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slug = `${slugBase || "piece"}-${timestamp.toString().slice(-4)}-${index + 1}`;
      const productId = `prod-${timestamp}-${index + 1}`;

      const sizes =
        category === "pillows"
          ? ["Standard Pair", "King Pair"]
          : ["Single", "Double", "Queen", "King"];

      const variants = sizes.map((s, sIdx) => ({
        id: `v-${productId}-${sIdx + 1}`,
        productId,
        size: s,
        colorName: "Warm Ivory",
        colorHex: "#FAF7F2",
        price: basePrice,
        retailPrice: Math.round(basePrice * 1.25),
        stock: 25,
        sku: `${slug.toUpperCase().slice(0, 4)}-${s.slice(0, 3).toUpperCase()}`,
      }));

      const product: Product = {
        id: productId,
        name,
        slug,
        tagline: "Stone-Washed Normandy Flax • Impossibly Soft",
        description: `Handcrafted from ${material}. Pre-washed with volcanic stones for signature lived-in drape, breathability, and quiet relaxation.`,
        category,
        categoryLabel:
          category === "bedsheets"
            ? "Bedsheets"
            : category === "pillows"
            ? "Pillows & Covers"
            : "Duvets & Inserts",
        basePrice,
        retailPrice: Math.round(basePrice * 1.25),
        rating: 4.9,
        reviewCount: Math.floor(Math.random() * 80) + 20,
        material,
        threadCountOrGsm: "175 GSM",
        origin: "Normandy, France",
        isBestSeller: index < 4,
        isNewArrival: index >= 4 && index < 10,
        availableSizes: sizes,
        availableColors: [
          { name: "Warm Ivory", hex: "#FAF7F2" },
          { name: "Soft Sand", hex: "#E8DFD0" },
          { name: "Muted Sage", hex: "#C2C9BC" },
        ],
        features: [
          "Woven from slow-harvested 100% certified organic European flax",
          "Pumice stone-washed for instant lived-in handfeel",
          "Deep fitted sheet pocket with 360° high-tensile elastic",
          "OEKO-TEX® Standard 100 Certified free from harmful dyes",
        ],
        dimensions: {
          fitted: "Standard fitted with 16-inch deep corner pockets",
          flat: "Generously cut with 4-inch double-turned tailored hem",
        },
        images: [
          {
            id: `img-${productId}-1`,
            productId,
            url: CATEGORY_IMAGES[category] || CATEGORY_IMAGES.bedsheets,
            altText: name,
            sortOrder: 0,
            isPrimary: true,
          },
        ],
        variants,
      };

      newProducts.push(product);
    });

    if (newProducts.length === 0) {
      setErrorMsg("No products could be parsed.");
      return;
    }

    onAddProducts(newProducts);
    onClose();
  };

  const sampleTemplate = `The Belgian Waffle Linen Blanket, 18500, bedsheets, 100% Belgian Flax
Normandy Sateen Duvet Set, 32000, duvets, 100% Egyptian Cotton
Mulberry Silk Pillowcases, 9500, pillows, 22-Momme Mulberry Silk
Volcanic Washed Fitted Sheet, 14000, bedsheets, 100% French Flax
All-Season Cloudfiber Duvet, 26000, duvets, Hypoallergenic Microfiber`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-variant/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">playlist_add</span>
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-medium">
                Fast Bulk Add Products
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Paste names & prices from Excel or notes — add dozens of products in seconds.
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-label-md uppercase tracking-wider text-on-surface-variant text-[11px]">
                Paste your product lines (One per line):
              </label>
              <button
                type="button"
                onClick={() => setTextInput(sampleTemplate)}
                className="text-[11px] text-secondary hover:underline"
              >
                Load Sample Template
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Format: <span className="font-mono text-primary font-medium">Product Name, Price (PKR), Category (optional), Material (optional)</span>
            </p>
            <textarea
              rows={12}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Linen Sheet Set, 28500, bedsheets, 100% French Flax\nGoose Down Duvet, 34000, duvets, Bavarian Down\nPure Silk Pillow, 12000, pillows, Mulberry Silk`}
              className="w-full p-3 font-mono text-xs rounded-xl border border-surface-variant bg-surface text-primary focus:outline-none focus:border-primary resize-none mt-1"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-medium text-primary">Default Category</span>
              <p className="text-[11px] text-on-surface-variant">
                Used if a line doesn&apos;t specify category
              </p>
            </div>
            <select
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg border border-surface-variant bg-surface text-primary text-xs focus:outline-none"
            >
              <option value="bedsheets">Bedsheets</option>
              <option value="pillows">Pillows &amp; Covers</option>
              <option value="duvets">Duvets &amp; Inserts</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!textInput.trim()}
            onClick={handleProcessBulk}
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>
              Create {textInput.split("\n").filter((l) => l.trim().length > 0).length || ""}{" "}
              Products Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
