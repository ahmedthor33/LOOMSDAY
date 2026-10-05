"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const [retailPrice, setRetailPrice] = useState<number | string>("");
  const [basePrice, setBasePrice] = useState<number | string>(28500);
  const [material, setMaterial] = useState("100% French Flax Linen");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setTagline(productToEdit.tagline || "");
      setCategory(productToEdit.category);
      setRetailPrice(productToEdit.retailPrice ?? "");
      setBasePrice(productToEdit.basePrice);
      setMaterial(productToEdit.material);
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
      setRetailPrice(34500);
      setBasePrice(28500);
      setMaterial("100% French Flax Linen");
      setDescription("Woven from slow-harvested 100% certified organic European flax. Stone-washed for immediate softness and effortless drape.");
      setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ");
      setIsBestSeller(false);
      setIsNewArrival(true);
    }
    setImageError(null);
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

  // Image compressor helper: creates high quality 1400px webp/jpeg to protect localStorage quota
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose a valid image file (PNG, JPG, WEBP, AVIF).");
      return;
    }

    setImageError(null);
    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDimension = 1400;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setImageUrl(dataUrl);
          setIsProcessingImage(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const optimized = canvas.toDataURL("image/webp", 0.85);
          setImageUrl(optimized);
        } catch {
          setImageUrl(dataUrl);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setImageUrl(dataUrl);
        setIsProcessingImage(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setImageError("Failed to read image file.");
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const finalSlug = cleanSlug || `prod-${Date.now()}`;
    const categoryLabels: Record<string, string> = {
      bedsheets: "Bedsheets",
      pillows: "Pillows & Covers",
      duvets: "Duvets & Inserts",
    };

    const finalBasePrice = Number(basePrice) || 0;
    const finalRetailPrice =
      retailPrice !== "" && Number(retailPrice) > 0 ? Number(retailPrice) : undefined;

    const finalProduct: Product = {
      id: productToEdit?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      categoryLabel: categoryLabels[category] || "Bedsheets",
      basePrice: finalBasePrice,
      retailPrice: finalRetailPrice,
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      material: material.trim(),
      origin: productToEdit?.origin || "",
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
          id: productToEdit?.images?.[0]?.id || `img-${Date.now()}-1`,
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
              price: finalBasePrice,
              retailPrice: finalRetailPrice,
              stock: 30,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-Q-WIV`,
            },
            {
              id: `var-${Date.now()}-2`,
              productId: productToEdit?.id || `prod-${Date.now()}`,
              size: "King",
              colorName: "Warm Ivory",
              colorHex: "#FAF7F2",
              price: finalBasePrice + 2000,
              retailPrice: finalRetailPrice ? finalRetailPrice + 2000 : undefined,
              stock: 20,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-K-WIV`,
            },
            {
              id: `var-${Date.now()}-3`,
              productId: productToEdit?.id || `prod-${Date.now()}`,
              size: "Queen",
              colorName: "Muted Sage",
              colorHex: "#C2C9BC",
              price: finalBasePrice,
              retailPrice: finalRetailPrice,
              stock: 15,
              sku: `${finalSlug.slice(0, 4).toUpperCase()}-Q-MSG`,
            },
          ],
    };

    onSave(finalProduct);
    onClose();
  };

  const numRetail = Number(retailPrice) || 0;
  const numBase = Number(basePrice) || 0;
  const hasSavings = numRetail > numBase && numBase > 0;
  const savingsAmount = numRetail - numBase;
  const discountPercent = numRetail > 0 ? Math.round((savingsAmount / numRetail) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-variant/70 rounded-xl shadow-2xl p-6 md:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
          <div>
            <h2 className="font-headline-sm text-xl text-primary font-medium">
              {productToEdit ? "Edit Linen Specification" : "Craft New Bedding Creation"}
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Manage luxury attributes, PKR pricing, specifications, and catalog placement.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. The French Flax Linen Sheet Set"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">URL Identifier (Slug) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  setSlug(val);
                }}
                placeholder="e.g. french-flax-linen-sheet-set"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Category, Retail Price (PKR), Actual Selling Price (PKR) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
              >
                <option value="bedsheets">Bedsheets</option>
                <option value="pillows">Pillows &amp; Covers</option>
                <option value="duvets">Duvets &amp; Inserts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Retail Price (PKR)
                <span className="text-[10px] text-on-surface-variant font-normal ml-1">(Original)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-on-surface-variant font-semibold">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={retailPrice}
                  onChange={(e) =>
                    setRetailPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="e.g. 34500"
                  className="w-full pl-10 pr-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Actual Selling Price (PKR) *
                <span className="text-[10px] text-secondary font-medium ml-1">(Charged)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-secondary font-semibold">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={basePrice}
                  onChange={(e) =>
                    setBasePrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="e.g. 28500"
                  className="w-full pl-10 pr-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing Savings Pill */}
          {hasSavings && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary text-xs">
              <span className="material-symbols-outlined text-[16px]">local_offer</span>
              <span>
                Displays with <strong>Rs. {numBase.toLocaleString()}</strong> selling price &amp;{" "}
                <del className="opacity-75">Rs. {numRetail.toLocaleString()}</del> retail price (Customer saves{" "}
                <strong>Rs. {savingsAmount.toLocaleString()}</strong> • {discountPercent}% off).
              </span>
            </div>
          )}

          {/* Row 3: Material & Tagline (Thread Count and Geographic Origin Removed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Material Composition *</label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% French Flax Linen"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Tagline / Sub-header</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Stone-Washed Normandy Flax • Impossibly Soft"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-medium text-primary mb-1">Editorial Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed sensory narrative regarding drape, softness, weave technique..."
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary resize-none transition-colors"
            />
          </div>

          {/* Row 5: Drag & Drop Product Photography */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-primary flex items-center gap-1.5">
                <span>Product Photography Asset *</span>
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (Drag &amp; drop or browse)
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlFallback(!showUrlFallback)}
                className="text-[11px] text-secondary hover:text-primary transition-colors underline"
              >
                {showUrlFallback ? "Hide URL input" : "Or enter direct Image URL"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Dropzone container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 group ${
                isDragging
                  ? "border-secondary bg-secondary/10 ring-4 ring-secondary/20"
                  : imageUrl
                  ? "border-surface-variant/80 bg-surface-container-low hover:border-secondary"
                  : "border-surface-variant hover:border-secondary bg-surface-container-lowest hover:bg-surface-container-low"
              }`}
            >
              {isProcessingImage ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                  <p className="text-xs text-primary font-medium">Optimizing luxury photography...</p>
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-surface-container-highest border border-surface-variant shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      <span className="text-xs font-medium text-primary">Image loaded &amp; ready</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      Drop another image here or click to choose a new file.
                    </p>
                    <div className="pt-2 flex items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3 py-1 rounded bg-surface hover:bg-surface-container text-xs text-primary font-medium border border-surface-variant shadow-xs transition-colors"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl("");
                        }}
                        className="px-3 py-1 rounded bg-error/10 hover:bg-error/20 text-xs text-error font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Drag and drop high-resolution product photo here
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      or <span className="text-secondary font-semibold underline">browse from your computer</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-wider">
                    PNG, JPG, WEBP, AVIF • Auto-optimized for instant performance
                  </span>
                </div>
              )}
            </div>

            {imageError && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {imageError}
              </p>
            )}

            {/* URL Fallback Accordion */}
            {showUrlFallback && (
              <div className="mt-2 p-3 rounded-lg bg-surface-container-low border border-surface-variant/50 space-y-2">
                <label className="block text-[11px] font-medium text-on-surface-variant">
                  Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /images/hero-bedding.jpg"
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("/images/hero-bedding.jpg")}
                    className="px-3 py-1.5 rounded bg-surface hover:bg-surface-container text-[11px] text-secondary font-medium transition-colors border border-surface-variant shrink-0"
                  >
                    Use 8K Hero
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Badges */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-primary">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded accent-secondary w-3.5 h-3.5"
              />
              <span>Feature in Bestsellers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-primary">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded accent-secondary w-3.5 h-3.5"
              />
              <span>Mark as New Seasonal Arrival</span>
            </label>
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 rounded bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-colors shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{productToEdit ? "Save Changes" : "Create Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
