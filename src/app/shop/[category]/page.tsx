"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, FilterState } from "@/components/product/ProductFilters";

const CATEGORY_META: Record<string, { title: string; subtitle: string; description: string }> = {
  bedsheets: {
    title: "French Linen & Percale Bedsheets",
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

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category.toLowerCase();
  const { products } = useAdminStore();
  const allProducts = products || [];

  if (!["bedsheets", "pillows", "duvets"].includes(categorySlug)) {
    notFound();
  }

  const meta = CATEGORY_META[categorySlug];

  const [filters, setFilters] = useState<FilterState>({
    category: categorySlug,
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
      // Must match active route category
      if (product.category !== categorySlug) return false;

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
      return 0;
    });
  }, [categorySlug, filters, sortOption]);

  const clearAllFilters = () => {
    setFilters({
      category: categorySlug,
      size: "",
      color: "",
      material: "",
      maxPrice: 100000,
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Editorial Header */}
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
          <span className="text-primary font-medium capitalize">{categorySlug}</span>
        </nav>

        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
              {meta.subtitle}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
              {filteredProducts.length} Items
            </span>
          </div>
          <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight">
            {meta.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Controls Strip */}
        <div className="mt-8 pt-5 pb-4 bg-surface-container-low/60 rounded-xl px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-variant/30">
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
              Showing {filteredProducts.length} of {allProducts.filter((p) => p.category === categorySlug).length} pieces
            </span>
            {(filters.size || filters.color || filters.material || filters.maxPrice < 400) && (
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
              <label htmlFor="catSortDropdown" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider hidden sm:inline">
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
                className={`p-1.5 rounded transition-all ${
                  colDensity === 3 ? "bg-primary text-on-primary" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block">view_module</span>
              </button>
              <button
                type="button"
                onClick={() => setColDensity(4)}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
          {allProducts.filter((p) => p.category === categorySlug).length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-surface-container-low rounded-2xl p-10 border border-surface-variant/30 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-5xl text-secondary">inventory_2</span>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Curating {meta.title}</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                No sanctuary pieces are currently listed under this category. Visit the Admin Atelier to add products.
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
