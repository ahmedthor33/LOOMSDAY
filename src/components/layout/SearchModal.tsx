"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products-data";
import { useAdminStore } from "@/store/useAdminStore";
import { formatCurrency } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { products: storeProducts } = useAdminStore();
  const allProducts = storeProducts && storeProducts.length > 0 ? storeProducts : PRODUCTS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.material.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.tagline ? p.tagline.toLowerCase().includes(query.toLowerCase()) : false)
      )
    : allProducts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden z-10 border border-surface-variant/40 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-surface-variant/40 flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bedsheets, linen sets, down duvets, pillows..."
            className="w-full bg-transparent font-body-md text-body-md text-primary placeholder:text-on-surface-variant/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant tracking-widest px-2 mb-2">
            {query.trim() ? `Search Results (${filtered.length})` : "Curated Suggestions"}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant font-body-md">
              No sanctuary items found matching &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container transition-colors group"
              >
                <div className="w-16 h-20 bg-surface-container rounded overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.images[0]?.url || ""}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-label-eyebrow text-[10px] text-secondary uppercase tracking-widest block truncate">
                    {item.material}
                  </span>
                  <h4 className="font-headline-sm text-base text-primary group-hover:text-secondary transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant truncate mt-0.5">
                    {item.origin ? `${item.origin} • ` : ""}{item.rating} ★ ({item.reviewCount})
                  </p>
                </div>
                <div className="text-right">
                  {item.retailPrice && item.retailPrice > item.basePrice && (
                    <span className="font-body-sm text-xs text-on-surface-variant line-through block opacity-70">
                      {formatCurrency(item.retailPrice)}
                    </span>
                  )}
                  <span className="font-headline-sm text-sm text-primary font-medium">
                    {formatCurrency(item.basePrice)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
