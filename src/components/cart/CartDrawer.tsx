"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency, FREE_SHIPPING_THRESHOLD, MONOGRAM_THRESHOLD } from "@/lib/utils";
import { CROSS_SELL_ITEMS } from "@/lib/products-data";
import { trackInitiateCheckout } from "@/lib/meta-pixel";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    addItem,
    subtotal,
    totalItemsCount,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const currentSubtotal = subtotal();
  const count = totalItemsCount();

  // Monogram progress threshold
  const monogramProgress = Math.min(100, Math.round((currentSubtotal / MONOGRAM_THRESHOLD) * 100));
  const isFreeShipping = currentSubtotal >= FREE_SHIPPING_THRESHOLD;
  const awayFromFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300">
      {/* Dim Backdrop with Warm Charcoal Tint */}
      <div
        className="absolute inset-0 bg-[#1c1c19]/45 backdrop-blur-[2px] transition-opacity"
        onClick={closeDrawer}
      />

      {/* Right Drawer Sheet (480px max width on desktop) */}
      <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[480px] bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 ease-out z-10">
        {/* Drawer Top Bar */}
        <div className="p-6 bg-surface-container-low flex flex-col gap-4 shadow-sm border-b border-surface-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-headline-sm text-headline-sm text-primary">Your Bag</span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              type="button"
              aria-label="Close drawer"
              onClick={closeDrawer}
              className="w-9 h-9 rounded-full bg-surface hover:bg-surface-variant flex items-center justify-center text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Free Shipping / Monogram Privilege Tracker */}
          <div className="p-3.5 rounded bg-surface-container space-y-2">
            <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span className="font-medium">
                  {isFreeShipping
                    ? "Free Shipping Unlocked!"
                    : `Add ${formatCurrency(awayFromFreeShipping)} for Complimentary Shipping`}
                </span>
              </div>
              <span className="text-secondary uppercase font-label-eyebrow text-[10px]">
                {monogramProgress >= 100 ? "Monogram Ready" : `${monogramProgress}%`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(100, (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">shopping_bag</span>
              <h4 className="font-headline-sm text-xl text-primary">Your shopping bag is quiet</h4>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xs mx-auto">
                Explore our slow-crafted bedding collections and elevate your sleep tonight.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="inline-block px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded"
              >
                Discover Bedding
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-surface-variant/30">
                  <div className="w-20 h-24 rounded bg-surface-container overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.productSlug}`}
                        onClick={closeDrawer}
                        className="font-headline-sm text-base text-primary hover:text-secondary transition-colors truncate"
                      >
                        {item.productName}
                      </Link>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-0.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    <p className="font-body-sm text-xs text-on-surface-variant">
                      {item.colorName} • Size: {item.size}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      {/* Compact Stepper */}
                      <div className="flex items-center rounded bg-surface-container px-2 py-0.5 gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-on-surface hover:text-primary active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="font-label-sm text-label-sm text-primary min-w-[14px] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-on-surface hover:text-primary active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>

                      <span className="font-headline-sm text-sm text-primary font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mini Cart In-Drawer Frequently Paired Cross-Sell */}
          {items.length > 0 && (
            <div className="p-4 rounded-lg bg-surface-container-low space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                  Frequently Paired
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">Quick Add</span>
              </div>

              {CROSS_SELL_ITEMS.map((cs) => (
                <div
                  key={cs.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded bg-surface-container-lowest"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-surface-container overflow-hidden flex-shrink-0 relative">
                      <Image src={cs.imageUrl} alt={cs.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-headline-sm text-[13px] text-primary truncate max-w-[180px]">{cs.name}</p>
                      <p className="font-body-sm text-[12px] text-secondary font-medium">
                        {formatCurrency(cs.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: `cs-${cs.id}`,
                        productId: cs.id,
                        variantId: `var-${cs.id}`,
                        productName: cs.name,
                        productSlug: cs.slug,
                        imageUrl: cs.imageUrl,
                        price: cs.price,
                        size: cs.size || "Standard",
                        colorName: cs.colorName || "Natural",
                        colorHex: cs.colorHex || "#ECEBE4",
                        inStock: true,
                      });
                    }}
                    className="px-3 py-1.5 rounded-sm bg-surface-variant hover:bg-primary hover:text-on-primary text-on-surface font-label-sm text-[11px] uppercase tracking-wider transition-colors"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Bottom Bar */}
        {items.length > 0 && (
          <div className="p-6 bg-surface-container-low border-t border-surface-variant/40 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Subtotal</span>
              <span className="font-headline-md text-headline-sm text-primary font-medium">
                {formatCurrency(currentSubtotal)}
              </span>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant">
              Taxes and final shipping calculated at checkout.
            </p>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={() => {
                  trackInitiateCheckout(items, currentSubtotal);
                  closeDrawer();
                }}
                className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>

              <Link
                href="/cart"
                onClick={closeDrawer}
                className="w-full py-2 text-center font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors block"
              >
                View Full Bag &amp; Add Promo Code
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
