"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Product, StorefrontCms } from "@/types";
import { PRODUCTS } from "@/lib/products-data";
import { useAdminStore, DEFAULT_BEDSHEET_HERO } from "@/store/useAdminStore";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, FilterState } from "@/components/product/ProductFilters";
import { idbGet } from "@/lib/robust-storage";

const CATEGORY_META: Record<string, { title: string; subtitle: string; description: string }> = {
  bedsheets: {
    title: "PAK Linen & Percale Bedsheets",
    subtitle: "LAYER 01 : FOUNDATIONAL SOFTNESS",
    description: "Deep pocket fitted sheets and generously turned flat sheets woven from slow-harvested Normandy flax and crisp Aegean percale cotton.",
  },
  pillows: {
    title: "Sanctuary Pillows & Linen Shams",
    subtitle: "LAYER 02 : CERVICAL ELEVATION",
    description: "Cloud-loft Bavarian goose down, natural Talalay latex contour cores, and enzyme-washed French linen envelope pillowcases.",
  },
  duvets: {
    title: "All-Season Duvets & Stone-Washed Covers",
    subtitle: "LAYER 03 : RESTFUL EMBRACE",
    description: "750 fill-power European white goose down inserts with true 3D baffle-box construction paired with horn-buttoned linen duvet covers.",
  },
};

export const normalizeCategory = (cat?: string): string => {
  if (!cat) return "";
  const c = cat.toLowerCase().trim();
  if (c.includes("bed") || c.includes("sheet")) return "bedsheets";
  if (c.includes("pillow") || c.includes("sham")) return "pillows";
  if (c.includes("duvet") || c.includes("insert") || c.includes("cover")) return "duvets";
  return c;
};

interface CategoryClientViewProps {
  category: string;
}

export function CategoryClientView({ category }: CategoryClientViewProps) {
  // Determine normalized active category from browser URL or prop
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/shop/");
      if (parts[1]) {
        const clean = parts[1].split("/")[0].split("?")[0].split("#")[0];
        if (clean && clean.trim().length > 0) {
          return normalizeCategory(decodeURIComponent(clean).trim());
        }
      }
    }
    return normalizeCategory(category || "bedsheets");
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/shop/");
      if (parts[1]) {
        const clean = parts[1].split("/")[0].split("?")[0].split("#")[0];
        if (clean && clean.trim().length > 0) {
          setActiveSlug(normalizeCategory(decodeURIComponent(clean).trim()));
        }
      }
    }
  }, [category]);

  const { products, cms } = useAdminStore();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localCms, setLocalCms] = useState<StorefrontCms | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isCancelled = false;

    const syncProducts = async () => {
      // 1. Fast sync from localStorage
      try {
        const raw = localStorage.getItem("loomsday-admin-storage-v5");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed?.state?.products) && !isCancelled) {
            setLocalProducts(parsed.state.products);
          }
          if (parsed?.state?.cms && !isCancelled) {
            setLocalCms(parsed.state.cms);
          }
        }
      } catch {}

      // 2. Authoritative sync from IndexedDB
      try {
        const idbRaw = await idbGet("loomsday-admin-storage-v5");
        if (idbRaw) {
          const parsed = JSON.parse(idbRaw);
          if (Array.isArray(parsed?.state?.products) && !isCancelled) {
            setLocalProducts(parsed.state.products);
          }
          if (parsed?.state?.cms && !isCancelled) {
            setLocalCms(parsed.state.cms);
          }
        }
      } catch {}
    };

    syncProducts();
    window.addEventListener("storage", syncProducts);
    window.addEventListener("loomsday-products-updated", syncProducts);
    return () => {
      isCancelled = true;
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener("loomsday-products-updated", syncProducts);
    };
  }, []);

  const allProducts = useMemo(() => {
    if (products && products.length > 0) return products;
    if (localProducts.length > 0) return localProducts;
    return PRODUCTS.length > 0 ? PRODUCTS : [];
  }, [products, localProducts]);

  const activeCms = cms?.bedsheetHero ? cms : (localCms || cms);
  const rawBedsheetHero = activeCms?.bedsheetHero || DEFAULT_BEDSHEET_HERO;
  const bedsheetBanner = {
    ...rawBedsheetHero,
    headline:
      !rawBedsheetHero.headline || rawBedsheetHero.headline === "French Linen & Percale Bedsheets"
        ? "PAK Linen & Percale Bedsheets"
        : rawBedsheetHero.headline,
  };

  const meta = CATEGORY_META[activeSlug] || {
    title: `${activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1)} Collection`,
    subtitle: "ATELIER ARCHIVE",
    description: "Handcrafted luxury linens and bedding pieces tailored for quiet sanctuary.",
  };

  const [filters, setFilters] = useState<FilterState>({
    category: activeSlug,
    size: "",
    color: "",
    material: "",
    maxPrice: 100000,
  });

  // Sync filter when activeSlug changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: activeSlug }));
  }, [activeSlug]);

  const [sortOption, setSortOption] = useState<
    "featured" | "best_selling" | "price_asc" | "price_desc" | "rating"
  >("featured");

  const [colDensity, setColDensity] = useState<3 | 4>(3);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Products belonging strictly to this dedicated category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const pCat = normalizeCategory(product.category);
      return pCat === activeSlug;
    });
  }, [allProducts, activeSlug]);

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        // Size filter
        if (
          filters.size &&
          !product.availableSizes.some((s) => s.toLowerCase().includes(filters.size.toLowerCase()))
        ) {
          return false;
        }
        // Color filter
        if (
          filters.color &&
          !product.availableColors.some((c) => c.name.toLowerCase() === filters.color.toLowerCase())
        ) {
          return false;
        }
        // Material filter
        if (
          filters.material &&
          !product.material.toLowerCase().includes(filters.material.toLowerCase().split(" ")[0])
        ) {
          return false;
        }
        // Price filter
        if (product.basePrice > filters.maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price_asc") return a.basePrice - b.basePrice;
        if (sortOption === "price_desc") return b.basePrice - a.basePrice;
        if (sortOption === "rating") return b.rating - a.rating;
        if (sortOption === "best_selling") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0;
      });
  }, [categoryProducts, filters, sortOption]);

  const clearAllFilters = () => {
    setFilters({
      category: activeSlug,
      size: "",
      color: "",
      material: "",
      maxPrice: 100000,
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Hero Section: Bespoke Hero Banner for Bedsheets, Standard Typographic for other archives */}
      {activeSlug === "bedsheets" && bedsheetBanner.enabled !== false ? (
        <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden mb-8 shadow-xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border border-outline-variant/30 bg-surface-container-high">
          {/* Background Editorial Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bedsheetBanner.imageUrl || "/images/hero-bedding.jpg"}
            alt={bedsheetBanner.headline}
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            // @ts-expect-error fetchpriority is standard in modern browsers
            fetchpriority="high"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith("/images/hero-bedding.jpg")) {
                target.src = "/images/hero-bedding.jpg";
              }
            }}
          />

          {/* Sophisticated Dark Cinematic Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Top Header Row with Glassy Breadcrumbs & Provenance Badge */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-2 font-label-eyebrow text-[11px] tracking-widest uppercase text-white/80 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <Link href="/" className="hover:text-secondary transition-colors">
                Home
              </Link>
              <span className="text-[10px] text-white/40">/</span>
              <Link href="/shop" className="hover:text-secondary transition-colors">
                Bedding
              </Link>
              <span className="text-[10px] text-white/40">/</span>
              <span className="text-secondary font-medium">Bedsheet Sets</span>
            </nav>

            {bedsheetBanner.badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary/90 text-primary font-label-eyebrow text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm border border-secondary/30">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{bedsheetBanner.badge}</span>
              </span>
            )}
          </div>

          {/* Hero Narrative & CTA Controls */}
          <div className="relative z-10 space-y-4 max-w-3xl pt-16 sm:pt-20">
            <div className="flex items-center gap-3">
              <span className="font-label-eyebrow text-xs uppercase tracking-[0.25em] text-secondary font-medium drop-shadow-sm">
                {bedsheetBanner.eyebrow}
              </span>
            </div>

            <h1 className="font-display-hero text-headline-lg sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.12] drop-shadow-md">
              {bedsheetBanner.headline}
            </h1>

            <p className="font-body-lg text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
              {bedsheetBanner.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={bedsheetBanner.ctaLink || "#products-grid"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface text-primary font-label-md text-xs uppercase tracking-widest font-semibold hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
              >
                <span>{bedsheetBanner.ctaText || "Explore Bedsheet Sets"}</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </a>
              <span className="inline-flex items-center px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/15 text-white text-xs font-label-sm tracking-wide">
                {categoryProducts.length} {categoryProducts.length === 1 ? "Piece" : "Pieces"} in Archive
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-10">
          <nav className="flex items-center gap-2 mb-6 font-label-eyebrow text-label-eyebrow tracking-widest uppercase text-on-surface-variant/80">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-[10px] text-outline-variant">/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">
              Bedding
            </Link>
            <span className="text-[10px] text-outline-variant">/</span>
            <span className="text-primary font-medium capitalize">{activeSlug}</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                {meta.subtitle}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
                {categoryProducts.length} {categoryProducts.length === 1 ? "Piece" : "Pieces"}
              </span>
            </div>
            <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight">
              {meta.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {meta.description}
            </p>
          </div>
        </section>
      )}

      {/* Navigation Tabs & Refinement Controls Strip */}
      <section className="mb-8">
        <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
          <Link
            href="/shop"
            className="px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider bg-surface-container hover:bg-surface-variant text-on-surface transition-colors shrink-0"
          >
            All Pieces
          </Link>
          <Link
            href="/shop/bedsheets"
            className={`px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider transition-colors shrink-0 ${
              activeSlug === "bedsheets"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container hover:bg-surface-variant text-on-surface"
            }`}
          >
            Bedsheet Sets
          </Link>
          <Link
            href="/shop/pillows"
            className={`px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider transition-colors shrink-0 ${
              activeSlug === "pillows"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container hover:bg-surface-variant text-on-surface"
            }`}
          >
            Pillows &amp; Covers
          </Link>
          <Link
            href="/shop/duvets"
            className={`px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider transition-colors shrink-0 ${
              activeSlug === "duvets"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container hover:bg-surface-variant text-on-surface"
            }`}
          >
            Duvets &amp; Inserts
          </Link>
        </div>

        {/* Controls Strip */}
        <div className="mt-6 pt-5 pb-4 bg-surface-container-low/60 rounded-xl px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-variant/30">
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
              Showing {filteredProducts.length} of {categoryProducts.length} pieces
            </span>
            {(filters.size || filters.color || filters.material || filters.maxPrice < 100000) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-label-sm text-xs text-secondary hover:text-primary underline uppercase tracking-wider"
              >
                Clear Refinements
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-primary font-label-sm text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Refine</span>
            </button>

            <div className="flex items-center gap-2">
              <label
                htmlFor="catSortDropdown"
                className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider hidden sm:inline"
              >
                Sort:
              </label>
              <div className="relative">
                <select
                  id="catSortDropdown"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="appearance-none bg-surface border border-surface-variant/50 text-on-surface font-body-sm text-xs pl-3 pr-8 py-2 rounded cursor-pointer focus:outline-none focus:border-secondary"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="best_selling">Best Selling</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="hidden xl:flex items-center bg-surface border border-surface-variant/50 p-0.5 rounded">
              <button
                type="button"
                onClick={() => setColDensity(3)}
                aria-label="3 columns"
                className={`p-1.5 rounded transition-all ${
                  colDensity === 3 ? "bg-primary text-on-primary" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block">view_module</span>
              </button>
              <button
                type="button"
                onClick={() => setColDensity(4)}
                aria-label="4 columns"
                className={`p-1.5 rounded transition-all ${
                  colDensity === 4 ? "bg-primary text-on-primary" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block">grid_view</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div id="products-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearAllFilters}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />
        </div>

        <div className="lg:col-span-9">
          {!mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-surface-container rounded-lg" />
              ))}
            </div>
          ) : categoryProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-surface-container-low rounded-2xl p-10 border border-surface-variant/30 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-5xl text-secondary">inventory_2</span>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Curating {meta.title}</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                No sanctuary pieces are currently listed under this category. Visit the Admin Atelier to list new items or load demo pieces.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded shadow-sm hover:bg-neutral-800 transition-colors"
                >
                  <span>Open Admin Atelier</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-surface-container text-primary font-label-md text-xs uppercase tracking-wider rounded hover:bg-surface-variant transition-colors"
                >
                  <span>Browse All Pieces</span>
                </Link>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-surface-container-low rounded-xl p-8 border border-surface-variant/30">
              <h3 className="font-headline-sm text-xl text-primary">No Matching Rest Pieces</h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Try widening your size, color, or price refinements.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                colDensity === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
              } gap-6`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
