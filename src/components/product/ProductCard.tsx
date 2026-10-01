"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast } = useToast();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = product.availableColors[selectedColorIndex] || product.availableColors[0];
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const primaryVariant = product.variants[0] || {
      id: `var-${product.id}`,
      size: product.availableSizes[0] || "Queen",
      price: product.basePrice,
    };

    addItem({
      id: `${product.id}-${primaryVariant.id}`,
      productId: product.id,
      variantId: primaryVariant.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.images[0]?.url || "",
      price: primaryVariant.price || product.basePrice,
      size: primaryVariant.size,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      inStock: true,
    });

    showToast(`Added ${product.name} (${selectedColor.name}) to your bag`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist(product, selectedColor.name);
    if (added) {
      showToast(`Reserved ${product.name} in your Saved Sanctuary`);
    } else {
      showToast(`Removed from your Saved Sanctuary`, "info");
    }
  };

  return (
    <div className="product-card group flex flex-col bg-surface rounded-none overflow-hidden transition-all duration-300 hover:shadow-lg border border-surface-variant/30">
      {/* Visual Image Stage */}
      <div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]?.url || ""}
            alt={product.images[0]?.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Wishlist Heart Action */}
        <button
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-sm ${
            isSaved
              ? "bg-surface text-error"
              : "bg-surface/85 text-on-surface hover:bg-surface hover:text-error"
          }`}
        >
          <span
            className="material-symbols-outlined text-[19px]"
            style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>Quick Add • {formatCurrency(product.basePrice)}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-secondary">
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                {product.rating}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant">
                ({product.reviewCount})
              </span>
            </div>
            <span className="font-label-eyebrow text-[10px] text-on-surface-variant uppercase tracking-wider">
              {product.threadCountOrGsm || product.material.split(" ")[0]}
            </span>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-headline-sm text-[18px] leading-snug text-primary mt-1 group-hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {selectedColor.name}
          </p>
        </div>

        {/* Swatches & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-variant/30">
          <div className="flex items-center gap-1.5">
            {product.availableColors.slice(0, 4).map((color, idx) => (
              <button
                key={color.name}
                type="button"
                aria-label={`Select ${color.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  selectedColorIndex === idx
                    ? "ring-2 ring-primary ring-offset-1 scale-110"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.availableColors.length > 4 && (
              <span className="font-body-sm text-[10px] text-on-surface-variant">
                +{product.availableColors.length - 4}
              </span>
            )}
          </div>
          <span className="font-headline-sm text-[17px] text-primary font-medium">
            {formatCurrency(product.basePrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
