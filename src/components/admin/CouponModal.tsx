"use client";

import React, { useState, useEffect } from "react";
import { AdminCoupon } from "@/types";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit?: AdminCoupon | null;
  onSave: (coupon: AdminCoupon) => void;
}

export function CouponModal({ isOpen, onClose, couponToEdit, onSave }: CouponModalProps) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(15);
  const [minSpend, setMinSpend] = useState(100);
  const [maxUsage, setMaxUsage] = useState(500);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (couponToEdit) {
      setCode(couponToEdit.code);
      setDiscountType(couponToEdit.discountType);
      setDiscountValue(couponToEdit.discountValue);
      setMinSpend(couponToEdit.minSpend);
      setMaxUsage(couponToEdit.maxUsage || 500);
      setIsActive(couponToEdit.isActive);
    } else {
      setCode("");
      setDiscountType("percentage");
      setDiscountValue(15);
      setMinSpend(100);
      setMaxUsage(500);
      setIsActive(true);
    }
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      id: couponToEdit?.id || `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      maxUsage: Number(maxUsage),
      isActive,
      usageCount: couponToEdit?.usageCount || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-surface-variant/70 rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3">
          <h2 className="font-headline-sm text-lg text-primary font-medium">
            {couponToEdit ? "Edit Privilege Cipher" : "Issue New Sanctuary Cipher"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-primary mb-1">Coupon Cipher Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SANCTUARY20"
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono uppercase tracking-wider focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs. PKR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Value ({discountType === "percentage" ? "%" : "Rs."})
              </label>
              <input
                type="number"
                min="1"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Min Spend (Rs.)</label>
              <input
                type="number"
                min="0"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Max Usages</label>
              <input
                type="number"
                min="1"
                value={maxUsage}
                onChange={(e) => setMaxUsage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-primary pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded accent-secondary"
            />
            <span>Active for customer redemption</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              Save Cipher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
