"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useAdminStore } from "@/store/useAdminStore";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function AccountPage() {
  const { user, profile, signOut, demoLogin, updateProfile } = useAuth();
  const { orders } = useAdminStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "benefits">("orders");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [street, setStreet] = useState(profile?.shippingAddress?.street || "");
  const [city, setCity] = useState(profile?.shippingAddress?.city || "");
  const [state, setState] = useState(profile?.shippingAddress?.state || "");
  const [zipCode, setZipCode] = useState(profile?.shippingAddress?.zipCode || "");

  React.useEffect(() => {
    if (profile?.shippingAddress) {
      if (profile.shippingAddress.street) setStreet(profile.shippingAddress.street);
      if (profile.shippingAddress.city) setCity(profile.shippingAddress.city);
      if (profile.shippingAddress.state) setState(profile.shippingAddress.state);
      if (profile.shippingAddress.zipCode) setZipCode(profile.shippingAddress.zipCode);
    }
  }, [profile]);

  // Real user orders from store matching logged-in email
  const userOrders = orders.filter((o) => {
    if (!user?.email) return false;
    return o.customerEmail?.toLowerCase() === user.email.toLowerCase();
  });

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingAddress(false);
    await updateProfile({
      shippingAddress: {
        street,
        city,
        state,
        zipCode,
        country: "Pakistan",
      },
    });
    showToast("Shipping destination updated and saved.");
  };

  // If visitor is guest, show friendly VIP sign-in prompt
  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <span className="material-symbols-outlined text-6xl text-secondary">lock</span>
        <div className="space-y-2">
          <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
            AUTHENTICATED CONCIERGE ACCESS
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Private Vault Ledger</h1>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Sign in to view your bespoke orders, personalized sleep preferences, and member-only linen reservations.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              demoLogin();
              showToast("Signed in to personal patron vault.");
            }}
            className="w-full py-3.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md"
          >
            1-Click Instant Patron Access
          </button>
          <Link
            href="/sign-in"
            className="w-full py-3 rounded bg-surface-container hover:bg-surface-variant text-primary font-label-md text-xs uppercase tracking-wider transition-colors border border-surface-variant/40"
          >
            Standard Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Header Profile Banner */}
      <section className="p-8 rounded-xl bg-surface-container-low border border-surface-variant/40 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-headline-sm text-2xl border border-surface-variant">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "P")}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                SANCTUARY MEMBER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-sm text-xs text-on-surface-variant">Privilege Tier 01</span>
            </div>
            <h1 className="font-headline-md text-2xl text-primary font-medium">
              {profile?.fullName || user.email?.split("@")[0] || "Valued Patron"}
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2 rounded bg-surface border border-surface-variant hover:bg-surface-container text-on-surface font-label-sm text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-surface-variant/40 mb-8 font-label-md text-xs uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders"
              ? "text-primary font-semibold border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Curated Orders ({userOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 transition-colors ${
            activeTab === "profile"
              ? "text-primary font-semibold border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Delivery &amp; Addresses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("benefits")}
          className={`pb-3 transition-colors ${
            activeTab === "benefits"
              ? "text-primary font-semibold border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Concierge Privileges
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-surface-container-low border border-surface-variant/40 space-y-4">
              <span className="material-symbols-outlined text-4xl text-neutral-400">receipt_long</span>
              <div className="space-y-1">
                <h3 className="font-headline-sm text-lg text-primary">No Past Confections Yet</h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-md mx-auto">
                  Your bespoke orders, tracking manifests, and digital invoices will appear here once you acquire linens from the boutique.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Explore Boutique Catalog
              </Link>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-xl bg-surface-container-low border border-surface-variant/40 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-variant/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-headline-sm text-base text-primary font-medium">{order.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-[11px] uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">Placed on {order.createdAt}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-headline-sm text-base text-primary font-medium block">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      {order.trackingNumber ? `Tracking: ${order.trackingNumber}` : "Dispatch in progress"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-surface-variant/30">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 rounded bg-surface-container overflow-hidden flex-shrink-0 relative">
                          <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-sm text-primary">{item.productName}</h4>
                          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                            {item.size} • {item.colorName}
                          </p>
                          <p className="font-body-sm text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-headline-sm text-sm text-primary font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Profile & Shipping Address */}
      {activeTab === "profile" && (
        <div className="max-w-xl p-8 rounded-xl bg-surface-container-low border border-surface-variant/40 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-lg text-primary">Primary Shipping Sanctuary</h3>
            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="font-label-sm text-xs text-secondary hover:text-primary uppercase tracking-wider underline"
            >
              {isEditingAddress ? "Cancel" : "Edit Address"}
            </button>
          </div>

          {isEditingAddress ? (
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block font-label-sm text-xs uppercase text-on-surface-variant mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded border border-surface-variant text-sm font-body-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-xs uppercase text-on-surface-variant mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded border border-surface-variant text-sm font-body-md"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-xs uppercase text-on-surface-variant mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded border border-surface-variant text-sm font-body-md"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-xs uppercase text-on-surface-variant mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded border border-surface-variant text-sm font-body-md"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded"
              >
                Save Address
              </button>
            </form>
          ) : (
            <div className="p-4 rounded bg-surface border border-surface-variant/40 space-y-1 font-body-md text-sm text-on-surface">
              <p className="font-semibold text-primary">{profile?.fullName || "Valued Patron"}</p>
              {street ? (
                <>
                  <p className="text-on-surface-variant">{street}</p>
                  <p className="text-on-surface-variant">{city}, {state} {zipCode}</p>
                  <p className="text-on-surface-variant">Pakistan</p>
                </>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No shipping destination saved yet. Click &ldquo;Edit Address&rdquo; to add your address.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Benefits */}
      {activeTab === "benefits" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-variant/40 space-y-3">
            <span className="material-symbols-outlined text-3xl text-secondary">hotel</span>
            <h4 className="font-headline-sm text-base text-primary">30-Night Slumber Trial</h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Every piece in your order is protected by our generous 30-night rest trial. Wash it, sleep on it, and experience genuine restoration.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-variant/40 space-y-3">
            <span className="material-symbols-outlined text-3xl text-secondary">draw</span>
            <h4 className="font-headline-sm text-base text-primary">Bespoke Monogramming</h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              VIP members receive complimentary white-glove monogramming on all linen sheet sets and duvet covers.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-variant/40 space-y-3">
            <span className="material-symbols-outlined text-3xl text-secondary">support_agent</span>
            <h4 className="font-headline-sm text-base text-primary">Dedicated Atelier Concierge</h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Direct access to our Normandy textile specialists for custom sizing inquiries and laundry care consultations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
