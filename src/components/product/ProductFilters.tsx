"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";

export interface FilterState {
  category: string;
  size: string;
  color: string;
  material: string;
  maxPrice: number;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onClearFilters,
  isOpenMobile,
  onCloseMobile,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    color: true,
    material: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    { label: "All Bedding", value: "all", count: 12 },
    { label: "Bedsheet Sets", value: "bedsheets", count: 5 },
    { label: "Pillows & Covers", value: "pillows", count: 4 },
    { label: "Duvets & Inserts", value: "duvets", count: 3 },
  ];

  const sizes = ["Twin", "Full", "Queen", "King", "Cal King"];

  const colors = [
    { name: "Warm Ivory", hex: "#FAF7F2" },
    { name: "Soft Sand", hex: "#E8DFD0" },
    { name: "Muted Sage", hex: "#C2C9BC" },
    { name: "Dune Mist", hex: "#D6CEBF" },
    { name: "French Charcoal", hex: "#3B3A36" },
  ];

  const materials = [
    "French Flax Linen",
    "Organic Percale Cotton",
    "Egyptian Sateen",
    "Goose Down",
  ];

  const filterContent = (
    <div className="space-y-5">
      {/* Categories */}
      <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-variant/30">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">
            Category
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-transform">
            {openSections.category ? "remove" : "add"}
          </span>
        </button>
        {openSections.category && (
          <div className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <label
                key={c.value}
                className="flex items-center justify-between cursor-pointer group select-none"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === c.value}
                    onChange={() => onFilterChange({ ...filters, category: c.value })}
                    className="w-4 h-4 text-primary accent-primary cursor-pointer"
                  />
                  <span
                    className={`font-body-sm text-sm transition-colors ${
                      filters.category === c.value
                        ? "text-primary font-semibold"
                        : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
                <span className="font-label-sm text-xs text-on-surface-variant/70">
                  {c.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Bed Sizes */}
      <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-variant/30">
        <button
          type="button"
          onClick={() => toggleSection("size")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">
            Bed Size
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-transform">
            {openSections.size ? "remove" : "add"}
          </span>
        </button>
        {openSections.size && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    size: filters.size === sz ? "" : sz,
                  })
                }
                className={`py-2 px-3 rounded text-center font-label-sm text-xs uppercase tracking-wider transition-colors ${
                  filters.size === sz
                    ? "bg-primary text-on-primary font-medium shadow-sm"
                    : "bg-surface text-on-surface hover:bg-surface-container-high border border-surface-variant/40"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Palette */}
      <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-variant/30">
        <button
          type="button"
          onClick={() => toggleSection("color")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">
            Color Palette
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-transform">
            {openSections.color ? "remove" : "add"}
          </span>
        </button>
        {openSections.color && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    color: filters.color === c.name ? "" : c.name,
                  })
                }
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <span
                  className={`w-7 h-7 rounded-full shadow-inner transition-transform group-hover:scale-110 ${
                    filters.color === c.name
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                      : "ring-1 ring-surface-variant"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-body-sm text-[11px] text-center text-on-surface-variant truncate w-full">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-variant/30">
        <button
          type="button"
          onClick={() => toggleSection("material")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">
            Weave &amp; Material
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-transform">
            {openSections.material ? "remove" : "add"}
          </span>
        </button>
        {openSections.material && (
          <div className="mt-4 space-y-2">
            {materials.map((mat) => (
              <label
                key={mat}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={filters.material === mat}
                  onChange={() =>
                    onFilterChange({
                      ...filters,
                      material: filters.material === mat ? "" : mat,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span className="font-body-sm text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                  {mat}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Slider */}
      <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-variant/30">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">
            Max Price: {formatCurrency(filters.maxPrice)}
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-transform">
            {openSections.price ? "remove" : "add"}
          </span>
        </button>
        {openSections.price && (
          <div className="mt-4 space-y-3">
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-on-surface-variant font-label-sm">
              <span>{formatCurrency(2000)}</span>
              <span>{formatCurrency(100000)}</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        className="w-full py-2.5 rounded text-center font-label-sm text-xs uppercase tracking-wider text-secondary hover:text-primary border border-surface-variant hover:bg-surface-container transition-colors"
      >
        Clear All Refinements
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full">{filterContent}</aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-primary/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-surface shadow-2xl p-6 overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-surface-variant/40 mb-6">
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Refine Curations
              </h3>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
