"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { DEMO_PRODUCTS } from "@/lib/demo-products-data";
import { useAdminStore } from "@/store/useAdminStore";
import { formatCurrency, calculateInstallments } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/components/ui/Toast";

interface ProductDetailClientViewProps {
  slug?: string;
}

export function ProductDetailClientView({ slug }: ProductDetailClientViewProps) {
  // Resolve active slug from current browser URL first (so SPA fallback never forces demo slug)
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/product/");
      if (parts[1]) {
        const clean = parts[1].split("/")[0].split("?")[0].split("#")[0];
        if (clean && clean.trim().length > 0) {
          return decodeURIComponent(clean).trim();
        }
      }
    }
    return (slug || "").trim();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/product/");
      if (parts[1]) {
        const clean = parts[1].split("/")[0].split("?")[0].split("#")[0];
        if (clean && clean.trim().length > 0) {
          setActiveSlug(decodeURIComponent(clean).trim());
        }
      }
    }
  }, [slug]);

  const { products } = useAdminStore();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("loomsday-admin-storage-v5");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.state?.products) && parsed.state.products.length > 0) {
          setLocalProducts(parsed.state.products);
        }
      }
    } catch {
      // Storage unavailable or parsing error
    }
  }, []);

  // Combine user products: Zustand store + localStorage
  const allProducts = useMemo(() => {
    const list: Product[] = [];
    const seenIds = new Set<string>();

    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        if (p?.id && !seenIds.has(p.id)) {
          seenIds.add(p.id);
          list.push(p);
        }
      }
    }

    if (Array.isArray(localProducts) && localProducts.length > 0) {
      for (const p of localProducts) {
        if (p?.id && !seenIds.has(p.id)) {
          seenIds.add(p.id);
          list.push(p);
        }
      }
    }

    // ONLY fallback to demo catalog if the store has ZERO user products
    if (list.length === 0) {
      return DEMO_PRODUCTS;
    }

    return list;
  }, [products, localProducts]);

  // Strict matching by slug, ID, or slugified title (NO substring bleeding!)
  const product = useMemo(() => {
    if (!activeSlug) return null;
    const cleanTarget = activeSlug.toLowerCase().trim();

    // 1. Search in user's products
    const found = allProducts.find((p) => {
      const s = (p.slug || "").toLowerCase().trim();
      const id = (p.id || "").toLowerCase().trim();
      const nameSlug = (p.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return s === cleanTarget || id === cleanTarget || nameSlug === cleanTarget;
    });

    if (found) return found;

    // 2. Only if user has zero products and demo catalog is loaded, check demo products
    if (allProducts.length === 0 || allProducts === DEMO_PRODUCTS) {
      return (
        DEMO_PRODUCTS.find((p) => {
          const s = (p.slug || "").toLowerCase().trim();
          return s === cleanTarget;
        }) || null
      );
    }

    return null;
  }, [allProducts, activeSlug]);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({
    name: "Warm Ivory",
    hex: "#FAF7F2",
  });
  const [selectedSize, setSelectedSize] = useState("Queen");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Sync initial product selections once product is found
  useEffect(() => {
    if (product) {
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[1] || product.availableSizes[0]);
      }
    }
  }, [product]);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    dimensions: true,
    materials: false,
    care: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSaved = product ? isInWishlist(product.id) : false;

  // Compute price based on variant selection
  const activeVariant = useMemo(() => {
    if (!product || !product.variants) return null;
    return (
      product.variants.find(
        (v) =>
          v.size?.toLowerCase() === selectedSize.toLowerCase() &&
          v.colorName?.toLowerCase() === selectedColor.name.toLowerCase()
      ) ||
      product.variants.find((v) => v.size?.toLowerCase() === selectedSize.toLowerCase()) ||
      product.variants[0] ||
      null
    );
  }, [product, selectedSize, selectedColor]);

  const currentPrice = activeVariant?.price || product?.basePrice || 0;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: `${product.id}-${activeVariant?.id || selectedSize}-${selectedColor.name}`,
        productId: product.id,
        variantId: activeVariant?.id || `var-${product.id}`,
        productName: product.name,
        productSlug: product.slug,
        imageUrl: product.images[activeImageIndex]?.url || product.images[0]?.url || "",
        price: currentPrice,
        size: selectedSize,
        colorName: selectedColor.name,
        colorHex: selectedColor.hex,
        inStock: true,
      },
      quantity
    );

    showToast(`Added ${quantity} × ${product.name} to your bag`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const added = toggleWishlist(product, selectedColor.name, selectedSize);
    if (added) {
      showToast(`Reserved ${product.name} in your Saved Sanctuary`);
    } else {
      showToast(`Removed from your Saved Sanctuary`, "info");
    }
  };

  // 1. Loading Skeleton while waiting for client hydration IF product is not yet found
  if (!product && !mounted) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-12 animate-pulse space-y-8">
        <div className="h-4 bg-surface-container w-48 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 aspect-[4/5] bg-surface-container rounded-xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-6 bg-surface-container w-32 rounded" />
            <div className="h-10 bg-surface-container w-3/4 rounded" />
            <div className="h-8 bg-surface-container w-1/2 rounded" />
            <div className="h-24 bg-surface-container rounded" />
            <div className="h-14 bg-surface-container rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Piece Not Found Fallback View (after client hydration completes)
  if (!product) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-28 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-4xl">bed</span>
        </div>
        <div className="space-y-2">
          <p className="font-label-eyebrow text-xs uppercase tracking-widest text-secondary font-medium">
            ATELIER ARCHIVE NOTICE
          </p>
          <h1 className="font-display-hero text-3xl md:text-4xl text-primary font-normal">
            Piece Not Located
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The linen piece you requested is currently unarchived or may have been updated in the catalog.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-neutral-800 transition-colors"
          >
            Explore All Bedding
          </Link>
          <Link
            href="/shop/bedsheets"
            className="w-full sm:w-auto px-6 py-3 bg-surface-container text-primary font-label-md text-xs uppercase tracking-wider rounded-lg hover:bg-surface-variant transition-colors"
          >
            View Bedsheet Sets
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-3 border border-surface-variant text-primary font-label-md text-xs uppercase tracking-wider rounded-lg hover:bg-surface-container transition-colors"
          >
            Open Admin Atelier
          </Link>
        </div>
      </div>
    );
  }

  // 3. Complete Luxury Product Detail Showcase
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Micro Breadcrumb Tracker */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-sm text-xs uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/shop/${product.category}`}
          className="hover:text-primary transition-colors capitalize"
        >
          {product.categoryLabel || product.category}
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">{product.name}</span>
      </nav>

      {/* Main Product Showcase (Split 60/40) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 relative items-start">
        {/* Left Column (60%): Editorial Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  aria-label={`View angle ${idx + 1}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded overflow-hidden shadow-sm transition-all focus:outline-none ${
                    activeImageIndex === idx
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url || "/images/hero-bedding.jpg"}
                    alt={img.altText || product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Visual Stage */}
          <div className="relative w-full aspect-[4/5] rounded overflow-hidden bg-surface-container shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                product.images[activeImageIndex]?.url ||
                product.images[0]?.url ||
                "/images/hero-bedding.jpg"
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Floating Certification Badge */}
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface tracking-wider">
                OEKO-TEX® Standard 100
              </span>
            </div>

            {/* Material Origin Note */}
            {product.origin && (
              <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-surface-container-high/85 backdrop-blur-sm px-3.5 py-1.5 rounded">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                  {product.origin}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (40%): Sticky Merchandising Buy-Box */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-28 space-y-6">
          {/* Eyebrow & Badges */}
          <div className="flex items-center justify-between">
            <span className="inline-block bg-surface-container-high text-secondary px-2.5 py-1 rounded font-label-eyebrow text-label-eyebrow uppercase tracking-widest font-medium">
              {product.isBestSeller ? "BEST SELLER • NORMANDY FLAX" : "HERITAGE REST ARCHIVE"}
            </span>
            <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> Limited
              Atelier Batch
            </span>
          </div>

          {/* Title & Price Block */}
          <div className="space-y-2">
            <h1 className="font-display-hero text-headline-lg text-primary leading-tight font-normal">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="font-headline-md text-headline-md text-primary font-medium">
                {formatCurrency(currentPrice)}
              </span>
              {product.retailPrice && product.retailPrice > currentPrice && (
                <>
                  <span className="font-body-lg text-lg text-on-surface-variant line-through opacity-70">
                    {formatCurrency(product.retailPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-secondary/15 text-secondary uppercase tracking-wider">
                    Save{" "}
                    {Math.round(
                      ((product.retailPrice - currentPrice) / product.retailPrice) * 100
                    )}
                    %
                  </span>
                </>
              )}
              <span className="font-body-sm text-xs text-on-surface-variant">
                Includes taxes &amp; duties
              </span>
            </div>

            {/* Installment Banner */}
            <div className="flex items-center gap-2 font-body-sm text-xs text-on-surface-variant bg-surface-container-low px-3.5 py-2.5 rounded border border-surface-variant/30">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                payments
              </span>
              <span>
                Or 4 interest-free installments of{" "}
                <strong className="text-primary font-medium">
                  {calculateInstallments(currentPrice)}
                </strong>{" "}
                with
              </span>
              <span className="font-label-sm uppercase font-semibold text-primary">Klarna</span>
              <span>•</span>
              <span className="font-label-sm uppercase font-semibold text-primary">Afterpay</span>
            </div>
          </div>

          {/* Rating & Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-secondary">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-label-md text-label-md font-semibold text-primary">
              {product.rating || 5.0}
            </span>
            <span className="text-on-surface-variant font-body-sm text-xs">
              ({product.reviewCount || 1} Verified Reviews)
            </span>
            <span className="text-on-surface-variant/40">•</span>
            <a
              href="#reviews-section"
              className="font-label-sm text-xs text-secondary hover:underline uppercase tracking-wider"
            >
              Read Reviews
            </a>
          </div>

          {/* Editorial Summary */}
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                  Color: <strong className="text-primary font-medium">{selectedColor.name}</strong>
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant">
                  Naturally Milled Pigment
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.availableColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    aria-label={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full shadow-sm transition-all ${
                      selectedColor.name === color.name
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110"
                        : "hover:scale-110 border border-surface-variant/50"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                  Bed Size: <strong className="text-primary">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-label-sm text-xs text-secondary hover:underline uppercase tracking-wider flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span> Size &amp;
                  Fit Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const sizeVariant = product.variants?.find(
                    (v) => v.size?.toLowerCase() === size.toLowerCase()
                  );
                  const sizePrice = sizeVariant ? sizeVariant.price : product.basePrice;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded text-center font-label-md text-xs flex flex-col items-center transition-colors ${
                        isSelected
                          ? "bg-primary text-on-primary shadow-sm font-medium"
                          : "bg-surface-container hover:bg-surface-variant text-primary"
                      }`}
                    >
                      <span>{size}</span>
                      <span
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? "text-primary-fixed-dim" : "text-on-surface-variant"
                        }`}
                      >
                        {formatCurrency(sizePrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suite Contents Summary */}
          <div className="bg-surface-container-low p-4 rounded space-y-2 border border-surface-variant/30">
            <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                inventory_2
              </span>{" "}
              Suite Contents
            </span>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              1 Deep Fitted Sheet (fits mattresses up to 16&quot; deep with 360° elastic hem), 1
              Draped Flat Sheet, and 2 Tailored Envelope Pillowcases.
            </p>
          </div>

          {/* Quantity + Add to Cart Primary Action */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-surface-container rounded h-12 px-2 shrink-0 border border-surface-variant/40">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-8 text-center font-label-md text-sm font-semibold text-primary select-none">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest font-semibold rounded hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Add to Cart — {formatCurrency(currentPrice * quantity)}</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              aria-label="Toggle Wishlist"
              onClick={handleWishlistToggle}
              className={`w-12 h-12 rounded flex items-center justify-center transition-colors border border-surface-variant/40 ${
                isSaved
                  ? "bg-surface-container text-error"
                  : "bg-surface-container hover:bg-surface-variant text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Value Proposition Micro-Bar */}
          <div className="grid grid-cols-3 gap-2 pt-4 bg-surface-container/60 p-3.5 rounded text-center border border-surface-variant/30">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-secondary mb-1">
                local_shipping
              </span>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-primary font-medium">
                Free Shipping
              </span>
              <span className="text-[11px] text-on-surface-variant font-body-sm leading-tight">
                Orders over Rs. 5,000
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-secondary mb-1">
                hotel
              </span>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-primary font-medium">
                30-Night Trial
              </span>
              <span className="text-[11px] text-on-surface-variant font-body-sm leading-tight">
                Wash it, sleep on it
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-secondary mb-1">
                workspace_premium
              </span>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-primary font-medium">
                Lifetime Care
              </span>
              <span className="text-[11px] text-on-surface-variant font-body-sm leading-tight">
                Artisan warranty
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Specifications Accordion */}
      <section className="mt-24 pt-12 border-t border-surface-variant/40">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-12">
            <p className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
              TRANSPARENCY &amp; CARE
            </p>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Artisanal Specifications
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every detail accounted for, from premium raw textiles to your dawn repose.
            </p>
          </div>

          <div className="space-y-4">
            {/* Dimensions */}
            <div className="bg-surface-container rounded-lg overflow-hidden border border-surface-variant/30">
              <button
                type="button"
                onClick={() => toggleAccordion("dimensions")}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-headline-sm text-headline-sm text-primary flex items-center gap-3">
                  <span className="font-label-sm text-secondary uppercase tracking-widest font-mono">
                    01.
                  </span>
                  Details &amp; Dimensions
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300">
                  {openAccordions.dimensions ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openAccordions.dimensions && (
                <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md text-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-surface-container-high/60 p-4 rounded">
                      <p className="font-label-sm uppercase text-primary font-medium">
                        Fitted Sheet
                      </p>
                      <p className="mt-1 font-body-sm text-xs leading-relaxed">
                        Features 16&quot; deep pocket with high-tensile 360° elastic banding to fit
                        mattresses snug without slipping.
                      </p>
                    </div>
                    <div className="bg-surface-container-high/60 p-4 rounded">
                      <p className="font-label-sm uppercase text-primary font-medium">Flat Sheet</p>
                      <p className="mt-1 font-body-sm text-xs leading-relaxed">
                        Generous double-turned decorative top cuff that hangs effortlessly with bespoke
                        proportion.
                      </p>
                    </div>
                    <div className="bg-surface-container-high/60 p-4 rounded">
                      <p className="font-label-sm uppercase text-primary font-medium">
                        Pillowcases (Pair)
                      </p>
                      <p className="mt-1 font-body-sm text-xs leading-relaxed">
                        Deep interior 8&quot; envelope enclosure keeps pillow inserts completely concealed
                        for a pristine finish.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Materials */}
            <div className="bg-surface-container rounded-lg overflow-hidden border border-surface-variant/30">
              <button
                type="button"
                onClick={() => toggleAccordion("materials")}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-headline-sm text-headline-sm text-primary flex items-center gap-3">
                  <span className="font-label-sm text-secondary uppercase tracking-widest font-mono">
                    02.
                  </span>
                  Materials &amp; Sustainability
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300">
                  {openAccordions.materials ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openAccordions.materials && (
                <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md text-sm space-y-3">
                  <p>
                    {product.material || "100% French Flax Linen"}. Sourced from sustainable
                    agricultural partners, woven with slow tension and washed with natural pumice
                    for cloud softness.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded font-label-sm text-xs text-primary">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        eco
                      </span>{" "}
                      OEKO-TEX Standard 100 Certified
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded font-label-sm text-xs text-primary">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        water_drop
                      </span>{" "}
                      Zero Artificial Softeners
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Care */}
            <div className="bg-surface-container rounded-lg overflow-hidden border border-surface-variant/30">
              <button
                type="button"
                onClick={() => toggleAccordion("care")}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-headline-sm text-headline-sm text-primary flex items-center gap-3">
                  <span className="font-label-sm text-secondary uppercase tracking-widest font-mono">
                    03.
                  </span>
                  Laundering &amp; Care Rituals
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300">
                  {openAccordions.care ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openAccordions.care && (
                <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md text-sm space-y-2">
                  <p>
                    Machine wash gentle in warm or cold water with mild liquid detergent. Tumble dry on
                    low heat with wool dryer balls, or hang line dry in the morning air. Do not
                    bleach or dry clean. Embracing natural wrinkles is encouraged.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Anchor Section */}
      <section className="mt-20 pt-12 border-t border-surface-variant/40" id="reviews-section">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                VERIFIED COLLECTOR VOICES
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mt-1">Customer Reviews</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-headline-sm text-lg text-primary font-medium">
                {product.rating || 5.0} / 5.0
              </span>
              <span className="text-on-surface-variant text-xs">
                ({product.reviewCount || 1} Reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-surface-container-low rounded border border-surface-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-sm text-primary font-semibold">Amina R.</span>
                <span className="font-body-sm text-xs text-on-surface-variant">2 weeks ago</span>
              </div>
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                The linen is weightless and airy. It has that distinctive crushed texture right out of
                the packaging with none of the scratchiness of cheap linen. Worth every rupee.
              </p>
            </div>

            <div className="p-6 bg-surface-container-low rounded border border-surface-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-sm text-primary font-semibold">
                  Julian Thorne
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant">1 month ago</span>
              </div>
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                The fitted sheet pocket is genuinely deep—it wraps entirely beneath our deep mattress
                without slipping or popping up at the corners. Pure craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-primary/45 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-surface-container-lowest p-6 rounded-xl shadow-2xl z-10 space-y-4 border border-surface-variant/40">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3">
              <h3 className="font-headline-sm text-lg text-primary">Bedding Size &amp; Fit Guide</h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 rounded text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-on-surface-variant font-body-sm text-xs space-y-3">
              <p>
                All LOOMSDAY fitted sheets feature our signature 16&quot; deep pocket with 360° elastic
                hem.
              </p>
              <div className="border border-surface-variant rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container font-label-sm text-[11px] text-primary">
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Fitted Sheet</th>
                      <th className="p-2.5">Flat Sheet</th>
                      <th className="p-2.5">Pillowcases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    <tr>
                      <td className="p-2.5 font-medium text-primary">Full</td>
                      <td className="p-2.5">54&quot; × 75&quot;</td>
                      <td className="p-2.5">84&quot; × 96&quot;</td>
                      <td className="p-2.5">Standard (2)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-primary">Queen</td>
                      <td className="p-2.5">60&quot; × 80&quot;</td>
                      <td className="p-2.5">96&quot; × 108&quot;</td>
                      <td className="p-2.5">Standard (2)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-primary">King</td>
                      <td className="p-2.5">76&quot; × 80&quot;</td>
                      <td className="p-2.5">110&quot; × 108&quot;</td>
                      <td className="p-2.5">King (2)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-primary">Cal King</td>
                      <td className="p-2.5">72&quot; × 84&quot;</td>
                      <td className="p-2.5">108&quot; × 114&quot;</td>
                      <td className="p-2.5">King (2)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
