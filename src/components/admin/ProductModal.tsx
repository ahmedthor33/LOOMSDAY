"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (productData: Product) => void;
}

export function ProductModal({ isOpen, onClose, productToEdit, onSave }: ProductModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<"bedsheets" | "pillows" | "duvets">("bedsheets");
  const [basePrice, setBasePrice] = useState(285);
  const [material, setMaterial] = useState("100% French Flax Linen");
  const [threadCountOrGsm, setThreadCountOrGsm] = useState("175 GSM");
  const [origin, setOrigin] = useState("Normandy, France");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setTagline(productToEdit.tagline || "");
      setCategory(productToEdit.category);
      setBasePrice(productToEdit.basePrice);
      setMaterial(productToEdit.material);
      setThreadCountOrGsm(productToEdit.threadCountOrGsm || "");
      setOrigin(productToEdit.origin);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.images[0]?.url || "");
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsNewArrival(Boolean(productToEdit.isNewArrival));
    } else {
      // Defaults for new product
      setName("");
      setSlug("");
      setTagline("Stone-Washed Normandy Flax • Impossibly Soft");
      setCategory("bedsheets");
      setBasePrice(285);
      setMaterial("100% French Flax Linen");
      setThreadCountOrGsm("175 GSM");
      setOrigin("Normandy, France");
      setDescription("Woven from slow-harvested 100% certified organic European flax. Stone-washed for immediate softness and effortless drape.");
      setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ");
      setIsBestSeller(false);
      setIsNewArrival(true);
    }
  }, [productToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!productToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/\s+/g, "-");
    const categoryLabels: Record<string, string> = {
      bedsheets: "Bedsheets",
      pillows: "Pillows & Covers",
      duvets: "Duvets & Inserts",
    };

    const finalProduct: Product = {
      id: productToEdit?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      categoryLabel: categoryLabels[category] || "Bedsheets",
      basePrice: Number(basePrice),
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      material: material.trim(),
      threadCountOrGsm: threadCountOrGsm.trim(),
      origin: origin.trim(),
      isBestSeller,
      isNewArrival,
      availableSizes: productToEdit?.availableSizes || (category === "pillows" ? ["Standard Pair"] : ["Full", "Queen", "King", "Cal King"]),
      availableColors: productToEdit?.availableColors || [
        { name: "Warm Ivory", hex: "#FAF7F2" },
        { name: "Soft Sand", hex: "#E8DFD0" },
        { name: "Muted Sage", hex: "#C2C9BC" },
      ],
      images: [
        {
          id: `img-${Date.now()}-1`,
          productId: productToEdit?.id || `prod-${Date.now()}`,
          url: imageUrl || "/images/hero-bedding.jpg",
          altText: `${name} styled in luxury bedroom setting`,
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      variants: productToEdit?.variants?.length
        ? productToEdit.variants
        : [
            {
              id: `var-${Date.now()}-1`,
              productId: productToEdit?.id || `prod-${Date.now()}`,
              size: "Queen",
              colorName: "Warm Ivory",
              colorHex: "#FAF7F2",
              price: Number(basePrice),
              stock: 30,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-Q-WIV`,
            },
            {
              id: `var-${Date.now()}-2`,
              productId: productToEdit?.id || `prod-${Date.now()}`,
              size: "King",
              colorName: "Warm Ivory",
              colorHex: "#FAF7F2",
              price: Number(basePrice) + 30,
              stock: 20,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-K-WIV`,
            },
            {
              id: `var-${Date.now()}-3`,
              productId: productToEdit?.id || `prod-${Date.now()}`,
              size: "Queen",
              colorName: "Muted Sage",
              colorHex: "#C2C9BC",
              price: Number(basePrice),
              stock: 15,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-Q-MSG`,
            },
          ],
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-variant/70 rounded-xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
          <div>
            <h2 className="font-headline-sm text-xl text-primary font-medium">
              {productToEdit ? "Edit Linen Specification" : "Craft New Bedding Creation"}
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Manage luxury attributes, pricing, origin, and catalog placement.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. The French Flax Linen Sheet Set"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">URL Identifier (Slug) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. french-flax-linen-sheet-set"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                <option value="bedsheets">Bedsheets</option>
                <option value="pillows">Pillows & Covers</option>
                <option value="duvets">Duvets & Inserts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Base Price ($ USD) *</label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Thread Count / GSM</label>
              <input
                type="text"
                value={threadCountOrGsm}
                onChange={(e) => setThreadCountOrGsm(e.target.value)}
                placeholder="e.g. 175 GSM or 480 TC"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Material Composition *</label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% French Flax Linen"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Geographic Origin *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Normandy, France"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary mb-1">Tagline / Sub-header</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Stone-Washed Normandy Flax • Impossibly Soft from Night One"
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary mb-1">Editorial Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed sensory narrative regarding drape, softness, weave technique..."
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-primary mb-1">Primary Image Asset (URL)</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /images/hero-bedding.jpg"
                className="flex-1 px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
              <button
                type="button"
                onClick={() => setImageUrl("/images/hero-bedding.jpg")}
                className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-variant text-[11px] text-secondary font-medium transition-colors border border-surface-variant/60"
              >
                Use 8K Hero
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-primary">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded accent-secondary"
              />
              <span>Feature in Bestsellers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-primary">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded accent-secondary"
              />
              <span>Mark as New Seasonal Arrival</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-colors shadow-md"
            >
              {productToEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
