"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product, ProductImage } from "@/types";
import { useAdminStore, DEFAULT_CATEGORIES } from "@/store/useAdminStore";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (productData: Product) => void;
}

export const STANDARD_BEDDING_SIZES = ["Single", "Double", "Queen", "King"];

export function ProductModal({ isOpen, onClose, productToEdit, onSave }: ProductModalProps) {
  const { categories, addCategory } = useAdminStore();
  const currentCategories = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("LOOMSDAY");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<string>("bedsheets");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["Single", "Double", "Queen", "King"]);
  const [retailPrice, setRetailPrice] = useState<number | string>("");
  const [basePrice, setBasePrice] = useState<number | string>("");
  const [material, setMaterial] = useState("100% French Flax Linen");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [directUrlInput, setDirectUrlInput] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormError(null);
    setImageError(null);
    setIsProcessingImage(false);
    setDirectUrlInput("");
    setIsAddingCategory(false);
    setNewCategoryName("");
    setNewCategoryError(null);

    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setBrand(productToEdit.brand || "LOOMSDAY");
      setTagline(productToEdit.tagline || "");
      setCategory(productToEdit.category);
      setSelectedSizes(
        productToEdit.availableSizes && productToEdit.availableSizes.length > 0
          ? productToEdit.availableSizes
          : ["Single", "Double", "Queen", "King"]
      );
      setRetailPrice(productToEdit.retailPrice ?? "");
      setBasePrice(productToEdit.basePrice);
      setMaterial(productToEdit.material);
      setDescription(productToEdit.description);
      const initialImages = Array.isArray(productToEdit.images) && productToEdit.images.length > 0
        ? productToEdit.images.map((img, idx) => ({
            ...img,
            sortOrder: img.sortOrder ?? idx,
            isPrimary: img.isPrimary ?? (idx === 0),
          }))
        : [
            {
              id: `img-${Date.now()}-1`,
              productId: productToEdit.id,
              url: "/images/hero-bedding.jpg",
              altText: productToEdit.name,
              sortOrder: 0,
              isPrimary: true,
            },
          ];
      setImages(initialImages);
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsNewArrival(Boolean(productToEdit.isNewArrival));
    } else {
      // Defaults for new product
      setName("");
      setSlug("");
      setBrand("LOOMSDAY");
      setTagline("Stone-Washed Normandy Flax • Impossibly Soft");
      setCategory("bedsheets");
      setSelectedSizes(["Single", "Double", "Queen", "King"]);
      setRetailPrice("");
      setBasePrice("");
      setMaterial("100% French Flax Linen");
      setDescription("Woven from slow-harvested 100% certified organic European flax. Stone-washed for immediate softness and effortless drape.");
      setImages([
        {
          id: `img-${Date.now()}-1`,
          productId: "",
          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
          altText: "Stone-Washed Normandy Flax",
          sortOrder: 0,
          isPrimary: true,
        },
      ]);
      setIsBestSeller(false);
      setIsNewArrival(true);
    }
  }, [productToEdit, isOpen]);

  const toggleSize = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length === 1) return; // Maintain at least 1 size
      setSelectedSizes(selectedSizes.filter((s) => s !== sz));
    } else {
      const ordered = STANDARD_BEDDING_SIZES.filter(
        (s) => selectedSizes.includes(s) || s === sz
      );
      setSelectedSizes(ordered);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (formError) setFormError(null);
    if (!productToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Image compressor helper: creates high-res optimized Data URL
  const processSingleImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        return reject(new Error("File is not an image"));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          try {
            const maxDimension = 2048;
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
            if (!ctx) return resolve(dataUrl);

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const optimized = canvas.toDataURL("image/jpeg", 0.90);
            resolve(optimized);
          } catch {
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error("Failed to decode image file"));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const processImageFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) {
      setImageError("Please choose valid image files (PNG, JPG, WEBP, AVIF).");
      return;
    }

    setImageError(null);
    setFormError(null);
    setIsProcessingImage(true);

    try {
      const urls = await Promise.all(fileList.map((f) => processSingleImageFile(f)));
      setImages((prev) => {
        const next = [...prev];
        urls.forEach((url, idx) => {
          next.push({
            id: `img-${Date.now()}-${next.length + idx + 1}`,
            productId: productToEdit?.id || "",
            url,
            altText: `${name || "Linen piece"} view ${next.length + idx + 1}`,
            sortOrder: next.length + idx,
            isPrimary: next.length === 0 && idx === 0,
          });
        });
        if (!next.some((img) => img.isPrimary) && next.length > 0) {
          next[0].isPrimary = true;
        }
        return next;
      });
    } catch (err: any) {
      console.warn("Image upload error:", err);
      setImageError("Failed to process one or more images. Please use standard JPG or PNG.");
    } finally {
      setIsProcessingImage(false);
    }
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
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleAddDirectUrl = () => {
    if (!directUrlInput.trim()) return;
    setImages((prev) => {
      const next = [
        ...prev,
        {
          id: `img-${Date.now()}-${prev.length + 1}`,
          productId: productToEdit?.id || "",
          url: directUrlInput.trim(),
          altText: `${name || "Linen piece"} angle ${prev.length + 1}`,
          sortOrder: prev.length,
          isPrimary: prev.length === 0,
        },
      ];
      if (!next.some((img) => img.isPrimary) && next.length > 0) {
        next[0].isPrimary = true;
      }
      return next;
    });
    setDirectUrlInput("");
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setImageError(null);

    if (!name.trim()) {
      setFormError("Product Title is required. Please provide a title.");
      return;
    }
    if (isProcessingImage) {
      setFormError("Product photography is currently optimizing. Please wait a moment.");
      return;
    }
    if (images.length === 0) {
      setFormError("Please upload or provide at least one product photo.");
      return;
    }

    const cleanBasePriceStr = typeof basePrice === "number" ? String(basePrice) : (basePrice || "");
    const finalBasePrice = Number(String(cleanBasePriceStr).replace(/[^0-9.]/g, "")) || 0;
    if (finalBasePrice <= 0) {
      setFormError("Please enter a valid Actual Selling Price in PKR greater than Rs. 0 (e.g. 28500).");
      return;
    }

    const cleanRetailPriceStr = typeof retailPrice === "number" ? String(retailPrice) : (retailPrice || "");
    const parsedRetail = Number(String(cleanRetailPriceStr).replace(/[^0-9.]/g, "")) || 0;
    const finalRetailPrice = parsedRetail > 0 ? parsedRetail : undefined;

    const cleanSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const finalSlug = cleanSlug || `prod-${Date.now()}`;
    const categoryLabels: Record<string, string> = {
      bedsheets: "Bedsheets",
      pillows: "Pillows & cushions Covers",
      duvets: "Duvets & Inserts",
    };
    const matchedCategory = currentCategories.find(
      (c) => c.slug === category || c.id === category
    );
    const finalCategoryLabel = matchedCategory?.name || categoryLabels[category] || category;

    const normalizedImages: ProductImage[] = images.map((img, idx) => ({
      ...img,
      id: img.id || `img-${Date.now()}-${idx + 1}`,
      productId: productToEdit?.id || `prod-${Date.now()}`,
      sortOrder: idx,
      isPrimary: img.isPrimary ?? (idx === 0),
    }));

    if (!normalizedImages.some((img) => img.isPrimary) && normalizedImages.length > 0) {
      normalizedImages[0].isPrimary = true;
    }

    const finalProduct: Product = {
      id: productToEdit?.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      brand: brand.trim() || "LOOMSDAY",
      tagline: tagline.trim() || "Stone-Washed Normandy Flax • Impossibly Soft",
      description: description.trim() || "Woven from slow-harvested 100% certified organic European flax. Stone-washed for immediate softness and effortless drape.",
      category,
      categoryLabel: finalCategoryLabel,
      basePrice: finalBasePrice,
      retailPrice: finalRetailPrice,
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      material: material.trim() || "100% French Flax Linen",
      origin: productToEdit?.origin || "",
      isBestSeller,
      isNewArrival,
      availableSizes: selectedSizes.length > 0 ? selectedSizes : ["Single", "Double", "Queen", "King"],
      availableColors: productToEdit?.availableColors || [
        { name: "Warm Ivory", hex: "#FAF7F2" },
        { name: "Soft Sand", hex: "#E8DFD0" },
        { name: "Muted Sage", hex: "#C2C9BC" },
      ],
      images: normalizedImages,
      variants: (selectedSizes.length > 0 ? selectedSizes : ["Single", "Double", "Queen", "King"]).map((sz, idx) => ({
        id: `var-${Date.now()}-${idx + 1}`,
        productId: productToEdit?.id || `prod-${Date.now()}`,
        size: sz,
        colorName: "Warm Ivory",
        colorHex: "#FAF7F2",
        price: finalBasePrice,
        retailPrice: finalRetailPrice,
        stock: 30,
        sku: `${finalSlug.slice(0, 4).toUpperCase()}-${sz.slice(0, 2).toUpperCase()}-IVR`,
      })),
    };

    try {
      onSave(finalProduct);
      onClose();
    } catch (err: any) {
      console.error("onSave failed:", err);
      setFormError(err?.message || "Failed to save product. Please try again.");
    }
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

        {/* Prominent Alert Banner for Validation / Save Issues */}
        {formError && (
          <div className="p-3.5 rounded-lg bg-error/10 border border-error/30 text-error text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">error</span>
              <span className="font-medium">{formError}</span>
            </div>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="text-error hover:opacity-70 p-1"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Brand Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
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

            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-primary mb-1 flex items-center justify-between">
                <span>Brand Name *</span>
                <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Atelier</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. LOOMSDAY"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-medium focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Category, Retail Price (PKR), Actual Selling Price (PKR) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-primary">Category *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(!isAddingCategory);
                    setNewCategoryError(null);
                  }}
                  className="text-[11px] text-secondary hover:text-primary transition-colors underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isAddingCategory ? "close" : "add"}
                  </span>
                  <span>{isAddingCategory ? "Cancel" : "+ New Category"}</span>
                </button>
              </div>

              {isAddingCategory ? (
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-secondary/40 space-y-2 mb-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Throws &amp; Blankets"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const nameClean = newCategoryName.trim();
                          if (!nameClean) {
                            setNewCategoryError("Please enter a category name");
                            return;
                          }
                          const slugClean = nameClean
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)+/g, "");
                          const res = addCategory({
                            id: `cat-${slugClean}-${Date.now().toString(36)}`,
                            name: nameClean,
                            slug: slugClean,
                            subtitle: `COLLECTION : ${nameClean.toUpperCase()}`,
                            displayInNav: true,
                            isDefault: false,
                          });
                          if (!res.success) {
                            setNewCategoryError(res.error || "Category already exists");
                            return;
                          }
                          setCategory(slugClean);
                          setNewCategoryName("");
                          setIsAddingCategory(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nameClean = newCategoryName.trim();
                        if (!nameClean) {
                          setNewCategoryError("Please enter a category name");
                          return;
                        }
                        const slugClean = nameClean
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)+/g, "");
                        const res = addCategory({
                          id: `cat-${slugClean}-${Date.now().toString(36)}`,
                          name: nameClean,
                          slug: slugClean,
                          subtitle: `COLLECTION : ${nameClean.toUpperCase()}`,
                          displayInNav: true,
                          isDefault: false,
                        });
                        if (!res.success) {
                          setNewCategoryError(res.error || "Category already exists");
                          return;
                        }
                        setCategory(slugClean);
                        setNewCategoryName("");
                        setIsAddingCategory(false);
                      }}
                      className="px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                  {newCategoryError && (
                    <p className="text-[10px] text-error">{newCategoryError}</p>
                  )}
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary transition-colors"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.id || cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
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

          {/* Row 3: URL Slug Identifier */}
          <div>
            <label className="block text-xs font-medium text-primary mb-1 flex items-center justify-between">
              <span>URL Identifier (Slug)</span>
              <span className="text-[10px] text-on-surface-variant">Auto-generated from title</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                setSlug(val);
              }}
              placeholder="e.g. the-french-flax-linen-sheet-set"
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary transition-colors"
            />
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

          {/* Row 3: Available Bedding Sizes (Single, Double, Queen, King) */}
          <div className="space-y-2 p-3.5 rounded-lg bg-surface-container-low border border-surface-variant/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">straighten</span>
                Available Bedding Sizes *
              </label>
              <span className="text-[11px] text-on-surface-variant">
                Click to toggle sizes available for this piece
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {STANDARD_BEDDING_SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-label-md transition-all border ${
                      isSelected
                        ? "bg-primary text-on-primary border-primary shadow-sm font-semibold"
                        : "bg-surface text-on-surface border-surface-variant/80 hover:border-secondary/60 hover:bg-surface-container"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] opacity-80">
                        {sz === "Single" ? "single_bed" : sz === "Double" ? "bed" : sz === "Queen" ? "hotel" : "king_bed"}
                      </span>
                      <span>{sz}</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? "check_circle" : "radio_button_unchecked"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
              <span>Standard dimensions: Single (42&quot;×78&quot;), Double (54&quot;×78&quot;), Queen (60&quot;×80&quot;), King (72&quot;×78&quot;)</span>
              <span className="text-primary font-medium">{selectedSizes.length} {selectedSizes.length === 1 ? "size" : "sizes"} active</span>
            </div>
          </div>

          {/* Row 4: Material & Tagline (Thread Count and Geographic Origin Removed) */}
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

          {/* Row 5: Multi-Image Product Photography Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">photo_library</span>
                <span>Product Photography Assets ({images.length} {images.length === 1 ? "photo" : "photos"}) *</span>
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (Upload room views, drape angles, texture closeups)
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlFallback(!showUrlFallback)}
                className="text-[11px] text-secondary hover:text-primary transition-colors underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">add_link</span>
                <span>{showUrlFallback ? "Hide URL input" : "Add by Image URL"}</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
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
              className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group ${
                isDragging
                  ? "border-secondary bg-secondary/10 ring-4 ring-secondary/20"
                  : "border-surface-variant hover:border-secondary bg-surface-container-lowest hover:bg-surface-container-low"
              }`}
            >
              {isProcessingImage ? (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                  <p className="text-xs text-primary font-medium">Optimizing &amp; converting photos...</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Drag &amp; drop photos here or <span className="text-secondary font-semibold underline">browse multiple files</span>
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Select multiple images at once (PNG, JPG, WEBP). First photo is your storefront cover.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Image URL input */}
            {showUrlFallback && (
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-variant/50 space-y-2">
                <label className="block text-[11px] font-medium text-on-surface-variant">
                  Add Photo by Direct URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrlInput}
                    onChange={(e) => setDirectUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDirectUrl();
                      }
                    }}
                    placeholder="https://... (paste direct image link)"
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-medium hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    Add Photo
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-on-surface-variant">
                  <span>Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImages((prev) => [
                        ...prev,
                        {
                          id: `img-${Date.now()}-normandy`,
                          productId: productToEdit?.id || "",
                          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
                          altText: "Normandy Flax",
                          sortOrder: prev.length,
                          isPrimary: prev.length === 0,
                        },
                      ]);
                    }}
                    className="underline hover:text-primary"
                  >
                    + Normandy Flax
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImages((prev) => [
                        ...prev,
                        {
                          id: `img-${Date.now()}-pumice`,
                          productId: productToEdit?.id || "",
                          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUZzpp8szKlCaNHPJemnC7kx29DdEaV7E3I1TFOfneVOOybqWHexi6-MoM23vQoMPe-EnSSE2tUyGvgGr3ZTPpE86VvolITvNzUwRts0j1NCnviBoNlO5_6V-s6-RXuAB6NH9REQV0N-tMe6dClU48x6HFueH2sf_aGFB8ibRlDUBD9_BgcAkh1KkDa1a4b1KRICZQhiy1Da8CrR9z0C0iGTVN7zluXFgR4S8CVkA8M_avPXvxdVssvw",
                          altText: "Volcanic Linen",
                          sortOrder: prev.length,
                          isPrimary: prev.length === 0,
                        },
                      ]);
                    }}
                    className="underline hover:text-primary"
                  >
                    + Volcanic Linen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImages((prev) => [
                        ...prev,
                        {
                          id: `img-${Date.now()}-down`,
                          productId: productToEdit?.id || "",
                          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtOoYRRk0vGHuHkhoXB0ih8gsU0xTM_GGMq5APfzivgWXTvPdiG1uI5jfW5mWymwl1GqLYK1sXDsPR60PueZgV_M9jJ6mR4_ORPyDSiIL6iowMgRPg0-4jAEit5AXiKX7v-AEly6B792PSm3XJMHU-6RS572no-rMjGSSppdgxpLhDfgv4UU7c6EJ6R15wlZW6Qn1QOO6xcHPjvGne-45X8aJ-DoUpGwVFICvJVHXa8qcD5tp2I1-uMg",
                          altText: "Duvet Insert",
                          sortOrder: prev.length,
                          isPrimary: prev.length === 0,
                        },
                      ]);
                    }}
                    className="underline hover:text-primary"
                  >
                    + Duvet Loft
                  </button>
                </div>
              </div>
            )}

            {imageError && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {imageError}
              </p>
            )}

            {/* Uploaded Photos Grid */}
            {images.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Photo Gallery Ordering (First image is Cover)</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-secondary hover:underline font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Add more photos</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => {
                    const isCover = img.isPrimary || idx === 0;
                    return (
                      <div
                        key={img.id || idx}
                        className={`relative rounded-xl overflow-hidden border transition-all duration-200 group bg-surface-container-low flex flex-col ${
                          isCover
                            ? "border-secondary ring-2 ring-secondary/30 shadow-sm"
                            : "border-surface-variant hover:border-primary"
                        }`}
                      >
                        {/* Thumbnail View */}
                        <div className="relative aspect-square w-full bg-surface-container-highest overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.altText || `Product photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />

                          {/* Cover badge */}
                          {isCover && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-secondary text-primary text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">star</span>
                              <span>Cover</span>
                            </span>
                          )}

                          {/* Index badge */}
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                            #{idx + 1}
                          </span>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm opacity-90 group-hover:opacity-100"
                            title="Remove photo"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>

                        {/* Card Controls */}
                        <div className="p-2 flex items-center justify-between gap-1 bg-surface border-t border-surface-variant/40">
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="text-[10px] font-medium text-secondary hover:text-primary transition-colors flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px]">star_border</span>
                              <span>Make Cover</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-secondary flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">check</span>
                              <span>Primary</span>
                            </span>
                          )}

                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, idx - 1)}
                              className="p-1 rounded hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none text-on-surface-variant"
                              title="Move photo left"
                            >
                              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => handleMoveImage(idx, idx + 1)}
                              className="p-1 rounded hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none text-on-surface-variant"
                              title="Move photo right"
                            >
                              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              disabled={isProcessingImage}
              className={`px-6 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest transition-colors shadow-md flex items-center gap-2 ${
                isProcessingImage ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-800"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isProcessingImage ? "hourglass_empty" : "save"}
              </span>
              <span>
                {isProcessingImage
                  ? "Compressing Photo..."
                  : productToEdit
                  ? "Save Changes"
                  : "Create Product"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
