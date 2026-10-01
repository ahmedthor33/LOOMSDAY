"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface AddressDetails {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: AddressDetails) => void;
  totalAmount: number;
  paymentMethodLabel: string;
  initialData?: {
    name?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  isSubmitting?: boolean;
}

const MAJOR_PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Sialkot",
  "Gujranwala",
  "Quetta",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Other City",
];

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Kashmir",
  "Gilgit-Baltistan",
];

export function AddressConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  paymentMethodLabel,
  initialData,
  isSubmitting = false,
}: AddressConfirmationModalProps) {
  const [name, setName] = useState(initialData?.name || "Syed Ahmed");
  const [phone, setPhone] = useState(initialData?.phone || "0300-1234567");
  const [street, setStreet] = useState(initialData?.street || "House 14, Street 7, Phase 5, DHA");
  const [city, setCity] = useState(initialData?.city || "Lahore");
  const [customCity, setCustomCity] = useState("");
  const [state, setState] = useState(initialData?.state || "Punjab");
  const [zipCode, setZipCode] = useState(initialData?.zipCode || "54000");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.phone) setPhone(initialData.phone);
      if (initialData.street) setStreet(initialData.street);
      if (initialData.city) setCity(initialData.city);
      if (initialData.state) setState(initialData.state);
      if (initialData.zipCode) setZipCode(initialData.zipCode);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim()) return;

    const finalCity = city === "Other City" ? customCity.trim() || "Pakistan" : city;

    onConfirm({
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: finalCity,
      state,
      zipCode: zipCode.trim() || "00000",
      country: "Pakistan",
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-container-lowest border border-surface-variant/80 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Top Heading */}
        <div className="flex items-start justify-between border-b border-surface-variant/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
              <span className="font-label-eyebrow text-[10px] text-secondary tracking-widest uppercase font-semibold">
                DISPATCH COORDINATES
              </span>
            </div>
            <h2 className="font-headline-md text-xl text-primary font-medium">
              Confirm Delivery Destination
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Please verify your courier delivery address and phone number for delivery across Pakistan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Order Summary Snapshot */}
        <div className="p-3.5 rounded-xl bg-surface-container border border-surface-variant/50 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-label-eyebrow text-on-surface-variant tracking-wider">
              Settlement
            </span>
            <p className="font-medium text-primary font-serif">{paymentMethodLabel}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-label-eyebrow text-on-surface-variant tracking-wider">
              Total Payable
            </span>
            <p className="font-headline-sm text-base text-secondary font-semibold">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Syed Ahmed"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary mb-1">
              Complete Street Address / House / Sector *
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. House #14, Street 7, Sector F-7/2 or DHA Phase 5"
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                {MAJOR_PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">Province *</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {city === "Other City" && (
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Enter Your Specific City / District Name *
              </label>
              <input
                type="text"
                required
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="e.g. Mirpur, Jhelum, Sukkur, Mardan..."
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Postal Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g. 54000 (optional)"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-primary mb-1">Country</label>
              <input
                type="text"
                disabled
                value="Pakistan (Nationwide Courier)"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface-container text-on-surface-variant cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary mb-1">
              Rider Delivery Notes / Gate Code (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call before arrival, leave with security guard..."
              className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{isSubmitting ? "Finalizing Order..." : "Confirm & Place Order"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
