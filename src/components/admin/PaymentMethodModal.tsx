"use client";

import React, { useState, useEffect } from "react";
import { PaymentMethodConfig } from "@/types";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodToEdit: PaymentMethodConfig | null;
  onSave: (method: PaymentMethodConfig) => void;
}

const AVAILABLE_ICONS = [
  { id: "payments", label: "Cash / Notes" },
  { id: "account_balance", label: "Bank Vault" },
  { id: "phone_iphone", label: "Mobile Wallet" },
  { id: "account_balance_wallet", label: "Wallet" },
  { id: "credit_card", label: "Card" },
  { id: "qr_code_2", label: "Raast / QR" },
];

export function PaymentMethodModal({
  isOpen,
  onClose,
  methodToEdit,
  onSave,
}: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<PaymentMethodConfig>({
    id: "",
    name: "",
    accountTitle: "",
    accountNumber: "",
    bankName: "",
    iban: "",
    raastId: "",
    badge: "Active",
    icon: "payments",
    instructions: "",
    isEnabled: true,
    requiresProofReference: false,
    isCustom: false,
  });

  useEffect(() => {
    if (methodToEdit) {
      setFormData(methodToEdit);
    } else {
      const generatedId = `custom_pay_${Date.now()}`;
      setFormData({
        id: generatedId,
        name: "",
        accountTitle: "",
        accountNumber: "",
        bankName: "",
        iban: "",
        raastId: "",
        badge: "Domestic",
        icon: "account_balance",
        instructions: "",
        isEnabled: true,
        requiresProofReference: true,
        isCustom: true,
      });
    }
  }, [methodToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      name: formData.name.trim(),
      accountTitle: formData.accountTitle.trim(),
      accountNumber: formData.accountNumber.trim(),
      bankName: formData.bankName?.trim() || undefined,
      iban: formData.iban?.trim() || undefined,
      raastId: formData.raastId?.trim() || undefined,
      badge: formData.badge.trim() || "Domestic",
      instructions: formData.instructions.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-variant/40 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant/40 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-xl">{formData.icon}</span>
            </div>
            <div>
              <span className="font-label-eyebrow text-[10px] text-secondary uppercase tracking-widest block">
                Atelier Financial Gateway
              </span>
              <h3 className="font-headline-sm text-xl text-primary font-serif">
                {methodToEdit ? `Configure: ${methodToEdit.name}` : "Add Payment Gateway"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Active / Inactive Status Switcher Banner */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    formData.isEnabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                  }`}
                />
                <span className="font-label-md text-xs font-semibold text-primary uppercase tracking-wider">
                  Payment Gateway Status: {formData.isEnabled ? "Switched ON (Visible in Cart)" : "Switched OFF (Hidden from Cart)"}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                When switched on, customers can select this method at checkout. When switched off, it is completely hidden.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isEnabled: !formData.isEnabled })}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                formData.isEnabled ? "bg-emerald-600" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Primary Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Payment Method Title <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Meezan Bank Wire / Cash on Delivery"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
              <p className="text-[10px] text-on-surface-variant mt-1">Displayed on the checkout selector button.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Account Title / Beneficiary Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.accountTitle}
                onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                placeholder="e.g. LOOMSDAY LUXURY BEDDING"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-medium"
              />
              <p className="text-[10px] text-on-surface-variant mt-1">Beneficiary name the customer will see.</p>
            </div>
          </div>

          {/* Account Number & Bank Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Account Number / Wallet Phone Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 0102-0105893201 or 0300-8491928"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
              />
              <p className="text-[10px] text-on-surface-variant mt-1">Account or phone number to receive funds.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Bank / Provider Name
              </label>
              <input
                type="text"
                value={formData.bankName || ""}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. Meezan Bank Ltd, JazzCash, HBL"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* IBAN & Raast ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                IBAN (24 Characters)
              </label>
              <input
                type="text"
                value={formData.iban || ""}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                placeholder="e.g. PK36MEZN0001020105893201"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Raast ID (Optional)
              </label>
              <input
                type="text"
                value={formData.raastId || ""}
                onChange={(e) => setFormData({ ...formData, raastId: e.target.value })}
                placeholder="e.g. 03008491928"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
              />
            </div>
          </div>

          {/* Badge & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Badge / Tag (Card Ribbon)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Nationwide, Meezan / HBL, Instant"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Gateway Icon
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    title={ic.label}
                    onClick={() => setFormData({ ...formData, icon: ic.id })}
                    className={`w-9 h-9 rounded flex items-center justify-center border transition-all ${
                      formData.icon === ic.id
                        ? "border-secondary bg-secondary/15 text-secondary shadow-sm"
                        : "border-surface-variant text-on-surface-variant hover:border-secondary/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{ic.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Instructions */}
          <div>
            <label className="block text-xs font-medium text-primary mb-1">
              Instructions & Guidance for Customer
            </label>
            <textarea
              rows={3}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g. Transfer the exact amount to the account above. Take a screenshot or enter your transaction reference below..."
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary leading-relaxed"
            />
          </div>

          {/* Requires Proof Reference Checkbox */}
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="proofRef"
              checked={formData.requiresProofReference || false}
              onChange={(e) => setFormData({ ...formData, requiresProofReference: e.target.checked })}
              className="w-4 h-4 rounded border-surface-variant text-secondary focus:ring-secondary/40"
            />
            <label htmlFor="proofRef" className="text-xs text-primary cursor-pointer select-none">
              Require customer to provide Sender Name / Mobile Number / Transaction ID at checkout
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-surface-container-high/60 border border-surface-variant/40 space-y-2">
            <span className="font-label-eyebrow text-[10px] text-secondary uppercase tracking-widest block">
              Customer Checkout Preview
            </span>
            <div className="p-3 rounded-lg border border-secondary/40 bg-surface shadow-sm text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">{formData.icon}</span>
                  <span className="font-semibold text-primary">{formData.name || "Payment Method Name"}</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                  {formData.badge || "Badge"}
                </span>
              </div>
              <div className="text-[11px] text-on-surface-variant space-y-0.5 border-t border-surface-variant/30 pt-1.5">
                <p>
                  <strong className="text-primary">Account Title:</strong> {formData.accountTitle || "—"}
                </p>
                {formData.accountNumber && (
                  <p>
                    <strong className="text-primary">Account / Phone:</strong> <span className="font-mono">{formData.accountNumber}</span>
                  </p>
                )}
                {formData.bankName && (
                  <p>
                    <strong className="text-primary">Bank:</strong> {formData.bankName}
                  </p>
                )}
                {formData.iban && (
                  <p>
                    <strong className="text-primary">IBAN:</strong> <span className="font-mono text-[10px]">{formData.iban}</span>
                  </p>
                )}
                {formData.raastId && (
                  <p>
                    <strong className="text-primary">Raast ID:</strong> <span className="font-mono">{formData.raastId}</span>
                  </p>
                )}
                {formData.instructions && (
                  <p className="pt-1 text-[10px] italic text-on-surface-variant leading-relaxed">
                    "{formData.instructions}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md"
            >
              Save Gateway Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
