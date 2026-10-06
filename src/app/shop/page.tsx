"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/products-data";
import { useAdminStore } from "@/store/useAdminStore";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, FilterState } from "@/components/product/ProductFilters";
import { formatCurrency } from "@/lib/utils";
import { idbGet } from "@/lib/robust-storage";
import { fetchSupabaseProducts } from "@/lib/catalog-service";

const normalizeCategory = (cat?: string): string => {
  if (!cat) return "";
  const c = cat.toLowerCase().trim();
  if (c.includes("bed") || c.includes("sheet")) return "bedsheets";
  if (c.includes("pillow") || c.includes("sham")) return "pillows";
  if (c.includes("duvet") || c.includes("insert") || c.includes("cover")) return "duvets";
  return c;
};

export default function ShopPage() {
  const { products } = useAdminStore();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
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
        }
      } catch {}

      // 3. Live cloud sync from Supabase
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          setLocalProducts(cloudProds);
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
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
    if (Array.isArray(localProducts) && localProducts.length > 0) {
      return localProducts;
    }
    return PRODUCTS.length > 0 ? PRODUCTS : [];
  }, [products, localProducts]);

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    size: "",
    color: "",
    material: "",
    maxPrice: 100000,
  });

  const [sortOption, setSortOption] = useState<
    "featured" | "best_selling" | "price_asc" | "price_desc" | "rating"
  >("featured");

  const [colDensity, setColDensity] = useState<3 | 4>(3);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (filters.category !== "all") {
        const pCat = normalizeCategory(product.category);
        const fCat = normalizeCategory(filters.category);
        if (pCat !== fCat) return false;
      }
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
    }).sort((a, b) => {
      if (sortOption === "price_asc") return a.basePrice - b.basePrice;
      if (sortOption === "price_desc") return b.basePrice - a.basePrice;
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "best_selling") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // featured default
    });
  }, [allProducts, filters, sortOption]);

  const activeChips = [];
  if (filters.category !== "all") activeChips.push({ label: filters.category, key: "category" });
  if (filters.size) activeChips.push({ label: `Size: ${filters.size}`, key: "size" });
  if (filters.color) activeChips.push({ label: `Color: ${filters.color}`, key: "color" });
  if (filters.material) activeChips.push({ label: filters.material, key: "material" });
  if (filters.maxPrice < 100000) activeChips.push({ label: `Under ${formatCurrency(filters.maxPrice)}`, key: "price" });

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      size: "",
      color: "",
      material: "",
      maxPrice: 100000,
    });
  };

  const removeChip = (key: string) => {
    if (key === "category") setFilters((f) => ({ ...f, category: "all" }));
    if (key === "size") setFilters((f) => ({ ...f, size: "" }));
    if (key === "color") setFilters((f) => ({ ...f, color: "" }));
    if (key === "material") setFilters((f) => ({ ...f, material: "" }));
    if (key === "price") setFilters((f) => ({ ...f, maxPrice: 100000 }));
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Editorial Header & Breadcrumbs */}
      <section className="mb-10">
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 mb-6 font-label-eyebrow text-label-eyebrow tracking-widest uppercase text-on-surface-variant/80">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-[10px] text-outline-variant">/</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Bedding</span>
          <span className="text-[10px] text-outline-variant">/</span>
          <span className="text-primary font-medium">All Collections</span>
        </nav>

        {/* Editorial Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                Slow-Crafted Linens
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
                {allProducts.length} Sanctuary Pieces
              </span>
            </div>
            <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight">
              The Bedding Collection
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Spun from slow-harvested French flax and organic Aegean cotton. Naturally thermoregulating, hypoallergenic, and consciously tailored to soften gracefully over decades.
            </p>
          </div>

          {/* Quick Trust Indicators */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end lg:items-end">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded bg-surface-container-low text-on-surface text-body-sm text-xs shadow-sm border border-surface-variant/30">
              <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
              <span>OEKO-TEX® Standard 100 Guaranteed</span>
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded bg-surface-container-low text-on-surface text-body-sm text-xs shadow-sm border border-surface-variant/30">
              <span className="material-symbols-outlined text-secondary text-[20px]">hotel</span>
              <span>30-Night Restful Slumber Trial</span>
            </div>
          </div>
        </div>

        {/* Active Filters & Controls Strip */}
        <div className="mt-8 pt-5 pb-4 bg-surface-container-low/60 rounded-xl px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-variant/30">
          {/* Left: Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant mr-1">
              Refined by:
            </span>
            {activeChips.length === 0 ? (
              <span className="font-body-sm text-xs text-on-surface-variant/60">
                All sanctuary items displayed
              </span>
            ) : (
              activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => removeChip(chip.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-xs hover:bg-surface-variant transition-colors group"
                >
                  <span className="capitalize">{chip.label}</span>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary">
                    close
                  </span>
                </button>
              ))
            )}

            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-label-sm text-xs text-secondary hover:text-primary underline ml-2 transition-colors uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Right: Sort & View Density Toggles */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-primary font-label-sm text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Refine</span>
            </button>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sortDropdown"
                className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider hidden sm:inline"
              >
                Sort:
              </label>
              <div className="relative">
                <select
                  id="sortDropdown"
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

            {/* View Density Toggle (3-Col vs 4-Col) */}
            <div className="hidden xl:flex items-center bg-surface border border-surface-variant/50 p-0.5 rounded">
              <button
                type="button"
                onClick={() => setColDensity(3)}
                title="3-Column View"
                className={`p-1.5 rounded transition-all ${
                  colDensity === 3 ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block">view_module</span>
              </button>
              <button
                type="button"
                onClick={() => setColDensity(4)}
                title="4-Column View"
                className={`p-1.5 rounded transition-all ${
                  colDensity === 4 ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block">grid_view</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid (Sidebar 3 Cols | Products 9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearAllFilters}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-9">
          {allProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-surface-container-low rounded-2xl p-10 border border-surface-variant/30 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-5xl text-secondary">inventory_2</span>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Curating New Sanctuary Pieces</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Our master weavers are currently tailoring and preparing the next suite of heirloom French flax bedding.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded shadow-sm hover:bg-neutral-800 transition-colors"
                >
                  <span>Open Admin Atelier</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-surface-container-low rounded-xl p-8 border border-surface-variant/30">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/50">search_off</span>
              <h3 className="font-headline-sm text-xl text-primary">No Matching Rest Pieces</h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
                No items match your selected refinements. Try adjusting your color, size, or material criteria.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
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
