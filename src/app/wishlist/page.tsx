"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { showToast } = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulatedEmpty, setIsSimulatedEmpty] = useState(false);

  const displayedItems = isSimulatedEmpty ? [] : items;

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      id: `${item.productId}-${item.size || "Queen"}-${item.colorName || "Natural"}`,
      productId: item.productId,
      variantId: `var-${item.productId}`,
      productName: item.productName,
      productSlug: item.productSlug,
      imageUrl: item.imageUrl,
      price: item.price,
      size: item.size || "Queen",
      colorName: item.colorName || "Warm Ivory",
      colorHex: "#FAF7F2",
      inStock: true,
    });
    removeItem(item.productId);
    showToast(`Transferred ${item.productName} to your cart.`);
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((item) => {
      addItem({
        id: `${item.productId}-${item.size || "Queen"}-${item.colorName || "Natural"}`,
        productId: item.productId,
        variantId: `var-${item.productId}`,
        productName: item.productName,
        productSlug: item.productSlug,
        imageUrl: item.imageUrl,
        price: item.price,
        size: item.size || "Queen",
        colorName: item.colorName || "Warm Ivory",
        colorHex: "#FAF7F2",
        inStock: true,
      });
    });
    clearWishlist();
    openDrawer();
    showToast(`All sanctuary items moved to your shopping bag.`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://loomsday.store/curation/a749-restful-dawn");
    setIsCopied(true);
    showToast("Sanctuary link copied to clipboard.");
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Banner & Header */}
      <section className="w-full pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-surface-variant/40">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
                PERSONAL CURATION ARCHIVE
              </span>
              <span className="h-1 w-1 rounded-full bg-secondary" />
              <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                {displayedItems.length} Reserved {displayedItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight">
              Your Saved Sanctuary
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Pieces you&apos;ve curated for your dream bedroom. Saved items remain reserved for 14 days under your boutique concierge profile.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share Wishlist</span>
            </button>
            <button
              type="button"
              onClick={handleMoveAllToCart}
              disabled={displayedItems.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded bg-primary text-on-primary hover:bg-neutral-800 disabled:opacity-50 font-label-md text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Move All to Cart</span>
            </button>
          </div>
        </div>

        {/* Sanctuary Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 mt-6 rounded bg-surface-container-low text-on-surface-variant border border-surface-variant/30">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">lock_clock</span>
            <span className="font-body-sm text-xs">Complimentary 14-Day Reserve</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
            <span className="font-body-sm text-xs">White Glove Delivery Eligible</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">eco</span>
            <span className="font-body-sm text-xs">OEKO-TEX® &amp; Flax Certified</span>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <button
              type="button"
              onClick={() => setIsSimulatedEmpty(!isSimulatedEmpty)}
              className="font-label-sm text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-4"
            >
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>{isSimulatedEmpty ? "Show Saved Items" : "Simulate Quiet State"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Wishlist Grid */}
      <section className="w-full">
        {displayedItems.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-surface-container-low rounded-xl p-8 border border-surface-variant/30">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">favorite_border</span>
            <h3 className="font-headline-sm text-xl text-primary">Your Sanctuary Archive is Peaceful</h3>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
              You haven&apos;t reserved any bedding pieces yet. Explore our curated collections to build your restful bedroom suite.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-2 px-8 py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded shadow-sm"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedItems.map((item) => (
              <article
                key={item.productId}
                className="group relative flex flex-col bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-variant/30 overflow-hidden"
              >
                {/* Visual Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded font-label-eyebrow text-label-eyebrow tracking-widest text-primary uppercase shadow-sm">
                      {item.material.split(" ")[0]} Linen
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2.5 py-1 bg-secondary text-on-secondary rounded font-label-sm text-[10px] tracking-widest uppercase flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Only 4 Left
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface hover:text-error transition-colors flex items-center justify-center shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Meta & Configuration */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <Link href={`/product/${item.productSlug}`} className="block">
                        <h3 className="font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors">
                          {item.productName}
                        </h3>
                      </Link>
                      <span className="font-headline-sm text-base text-primary font-medium">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-on-surface-variant font-body-sm text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-[#FAF7F2] ring-1 ring-surface-variant inline-block" />
                        {item.colorName || "Warm Ivory"}
                      </span>
                      <span>•</span>
                      <span>Size: {item.size || "Queen"}</span>
                      <span>•</span>
                      <span className="text-secondary font-medium">In Stock</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 py-3 px-4 rounded bg-primary text-on-primary hover:bg-neutral-800 font-label-md text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                      <span>Move to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      title="Remove item"
                      className="h-11 w-11 rounded bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Share Wishlist Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-primary/45 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)} />
          <div className="relative bg-surface-container-lowest max-w-lg w-full p-8 rounded-xl shadow-2xl z-10 space-y-4 border border-surface-variant/40">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="space-y-1.5">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">
                LOOMSDAY PRIVATE CURATION
              </span>
              <h3 className="font-headline-sm text-lg text-primary">Share Your Bedroom Sanctuary</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Send your handpicked selection to an interior designer, partner, or save it to your registry archive.
              </p>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex items-center justify-between gap-3 mt-4 border border-surface-variant/30">
              <span className="font-body-sm text-xs text-on-surface truncate select-all">
                https://loomsday.store/curation/a749-restful-dawn
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-sm text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                {isCopied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
