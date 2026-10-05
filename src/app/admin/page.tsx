"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ProductModal } from "@/components/admin/ProductModal";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { CouponModal } from "@/components/admin/CouponModal";
import { DragDropImageUpload } from "@/components/admin/DragDropImageUpload";
import { PaymentMethodModal } from "@/components/admin/PaymentMethodModal";
import { useAdminStore, SUPER_ADMIN_EMAIL } from "@/store/useAdminStore";
import { Product, Order, AdminCoupon, PaymentMethodConfig } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type AdminTab =
  | "overview"
  | "products"
  | "inventory"
  | "orders"
  | "coupons"
  | "shipping"
  | "cms"
  | "payments";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    restockProduct,
    clearAllTestData,
    loadDemoCatalog,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon,
    shippingSettings,
    updateShippingSettings,
    cms,
    updateHero,
    updateAnnouncement,
    updateProvenance,
    paymentMethods,
    togglePaymentMethod,
    updatePaymentMethod,
    addPaymentMethod,
    deletePaymentMethod,
    resetPaymentMethods,
    transactions,
    refundTransaction,
    resetToFactoryDefaults,
  } = useAdminStore();

  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<AdminCoupon | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<PaymentMethodConfig | null>(null);

  // CMS form local state
  const [announcementText, setAnnouncementText] = useState(cms.announcement.text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(cms.announcement.enabled);
  const [heroEyebrow, setHeroEyebrow] = useState(cms.hero.eyebrow);
  const [heroHeadline, setHeroHeadline] = useState(cms.hero.headline);
  const [heroSubheadline, setHeroSubheadline] = useState(cms.hero.subheadline);
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState(cms.hero.primaryCtaText);
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState(cms.hero.primaryCtaLink);
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(cms.hero.secondaryCtaText);
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(cms.hero.secondaryCtaLink);
  const [heroImageUrl, setHeroImageUrl] = useState(cms.hero.imageUrl);

  // Shipping form local state
  const [freeShipThreshold, setFreeShipThreshold] = useState(shippingSettings.freeShippingThreshold);
  const [stdShipFee, setStdShipFee] = useState(shippingSettings.standardShippingFee);
  const [expShipFee, setExpShipFee] = useState(shippingSettings.expressShippingFee);
  const [monogramThreshold, setMonogramThreshold] = useState(shippingSettings.monogramThreshold);
  const [estDelivery, setEstDelivery] = useState(shippingSettings.estimatedDeliveryDays);

  // Computed Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Processing").length;
  const inTransitCount = orders.filter((o) => o.status === "In Transit").length;
  const lowStockVariantsCount = products.reduce((count, p) => {
    return count + p.variants.filter((v) => v.stock < 15).length;
  }, 0);
  const totalUnitsInStock = products.reduce((sum, p) => {
    return sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0);
  }, 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.origin ? p.origin.toLowerCase().includes(productSearch.toLowerCase()) : false);
    const matchesCategory =
      productCategoryFilter === "all" || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === "all") return true;
    return o.status === orderStatusFilter;
  });

  // CMS Save
  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      text: announcementText,
      enabled: announcementEnabled,
    });
    updateHero({
      eyebrow: heroEyebrow,
      headline: heroHeadline,
      subheadline: heroSubheadline,
      primaryCtaText: heroPrimaryCtaText,
      primaryCtaLink: heroPrimaryCtaLink,
      secondaryCtaText: heroSecondaryCtaText,
      secondaryCtaLink: heroSecondaryCtaLink,
      imageUrl: heroImageUrl,
    });
    showToast("Storefront hero section and announcement bar published live.");
  };

  // Shipping Save
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingSettings({
      freeShippingThreshold: Number(freeShipThreshold),
      standardShippingFee: Number(stdShipFee),
      expressShippingFee: Number(expShipFee),
      monogramThreshold: Number(monogramThreshold),
      estimatedDeliveryDays: estDelivery,
    });
    showToast("Logistics & shipping thresholds saved.");
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-primary pb-24">
      {/* Top Sovereign Bar */}
      <header className="sticky top-0 z-30 bg-primary text-on-primary border-b border-surface-variant/20 shadow-md">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-headline-sm text-lg tracking-[0.2em] font-medium text-surface uppercase">
                LOOMSDAY
              </span>
              <span className="text-[10px] uppercase tracking-widest font-label-eyebrow bg-secondary text-primary px-2 py-0.5 rounded font-semibold">
                ATELIER OS
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-surface/20 text-xs text-surface/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Owner Terminal:</span>
              <span className="font-mono text-secondary font-medium">{SUPER_ADMIN_EMAIL}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (confirm("Purge all testing orders, products, inventory, and demo records? This leaves a clean store ready for live operations.")) {
                  clearAllTestData();
                  showToast("All test orders, products, customers, and inventory have been completely purged.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-error/15 hover:bg-error/25 border border-error/30 text-[11px] text-red-200 hover:text-white transition-colors"
              title="Remove all testing orders, products, and inventory"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              <span>Purge Test Data</span>
            </button>
            {products.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  loadDemoCatalog();
                  showToast("Demo catalog re-seeded successfully.");
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-secondary/40 text-secondary hover:bg-secondary/10 text-[11px] transition-colors"
                title="Populate demo linens for testing"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Load Demo Pieces</span>
              </button>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-surface-container-highest/20 hover:bg-surface-container-highest/30 text-surface text-xs font-medium border border-surface/20 transition-colors"
            >
              <span>View Boutique</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-surface/10 py-1">
          {[
            { id: "overview", label: "Executive Dashboard", icon: "dashboard" },
            { id: "products", label: "Product Listing", icon: "inventory_2", count: products.length },
            { id: "inventory", label: "Stock & Inventory", icon: "warehouse", alert: lowStockVariantsCount > 0 },
            { id: "orders", label: "Orders & Shipping", icon: "local_shipping", count: pendingOrdersCount },
            { id: "coupons", label: "Privilege Ciphers", icon: "confirmation_number", count: coupons.filter((c) => c.isActive).length },
            { id: "cms", label: "Storefront & Hero CMS", icon: "auto_awesome" },
            { id: "shipping", label: "Shipping Rates", icon: "tune" },
            { id: "payments", label: "Financials & Ledger", icon: "payments" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-label-md uppercase tracking-wider whitespace-nowrap transition-all ${
                currentTab === tab.id
                  ? "bg-surface text-primary shadow font-semibold"
                  : "text-surface/80 hover:text-surface hover:bg-surface/10"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    currentTab === tab.id
                      ? "bg-primary text-on-primary"
                      : "bg-surface/20 text-surface"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.alert && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* ==================================================================== */}
        {/* 1. OVERVIEW DASHBOARD */}
        {/* ==================================================================== */}
        {currentTab === "overview" && (
          <div className="space-y-8">
            {/* Executive KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span className="font-label-eyebrow uppercase tracking-widest text-[10px]">
                    GROSS ORDER REVENUE
                  </span>
                  <span className="material-symbols-outlined text-secondary text-lg">trending_up</span>
                </div>
                <p className="font-headline-md text-2xl font-semibold text-primary">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">
                  {orders.length > 0 ? `${orders.length} orders settled` : "Awaiting first client order"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span className="font-label-eyebrow uppercase tracking-widest text-[10px]">
                    ORDERS IN DISPATCH
                  </span>
                  <span className="material-symbols-outlined text-secondary text-lg">package_2</span>
                </div>
                <p className="font-headline-md text-2xl font-semibold text-primary">
                  {pendingOrdersCount} Pending
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {inTransitCount} parcels currently with carriers
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span className="font-label-eyebrow uppercase tracking-widest text-[10px]">
                    INVENTORY HEALTH
                  </span>
                  <span className="material-symbols-outlined text-secondary text-lg">inventory</span>
                </div>
                <p className="font-headline-md text-2xl font-semibold text-primary">
                  {totalUnitsInStock} Units
                </p>
                <p className={`text-[11px] font-medium ${lowStockVariantsCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {lowStockVariantsCount > 0
                    ? `${lowStockVariantsCount} variant SKUs require restock`
                    : "Optimal inventory across all collections"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span className="font-label-eyebrow uppercase tracking-widest text-[10px]">
                    ACTIVE CIPHER USAGE
                  </span>
                  <span className="material-symbols-outlined text-secondary text-lg">local_activity</span>
                </div>
                <p className="font-headline-md text-2xl font-semibold text-primary">
                  {coupons.reduce((sum, c) => sum + c.usageCount, 0)} Redemptions
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Top performer: <span className="font-mono text-primary font-medium">SANCTUARY15</span>
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 rounded-xl bg-surface-container border border-surface-variant/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </span>
                <div>
                  <h3 className="font-label-md text-xs uppercase tracking-wider text-primary font-medium">
                    Atelier Sovereign Shortcuts
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Instant access to frequent operations.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-3 py-2 rounded bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab("cms")}
                  className="px-3 py-2 rounded bg-surface-container-lowest border border-surface-variant text-primary text-xs font-label-md uppercase tracking-wider hover:border-secondary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">image</span>
                  <span>Edit Hero Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCouponToEdit(null);
                    setIsCouponModalOpen(true);
                  }}
                  className="px-3 py-2 rounded bg-surface-container-lowest border border-surface-variant text-primary text-xs font-label-md uppercase tracking-wider hover:border-secondary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">confirmation_number</span>
                  <span>Create Coupon</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Ledger Preview */}
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-lg text-primary font-medium">
                    Recent Customer Confections
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Latest acquisitions placed through the LOOMSDAY boutique.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab("orders")}
                  className="text-xs text-secondary hover:underline font-medium"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant font-label-eyebrow">
                      <th className="py-3 px-3">Order Ref</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Articles</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-neutral-400">receipt_long</span>
                            <p className="font-medium text-sm text-primary">No customer orders recorded yet</p>
                            <p className="text-xs text-on-surface-variant max-w-sm">
                              New client confections will appear here in real-time as patrons complete checkout.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-primary">{ord.id}</td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-primary">{ord.customerName || "Customer"}</p>
                            <p className="text-[11px] text-on-surface-variant">{ord.customerEmail}</p>
                          </td>
                        <td className="py-3 px-3 text-on-surface-variant">{ord.createdAt}</td>
                        <td className="py-3 px-3 text-on-surface-variant">{ord.items.length} units</td>
                        <td className="py-3 px-3 font-semibold text-primary">{formatCurrency(ord.total)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              ord.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "In Transit"
                                ? "bg-blue-100 text-blue-800"
                                : ord.status === "Processing"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(ord);
                              setIsOrderModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded border border-surface-variant hover:border-primary text-[11px] font-medium text-primary transition-colors"
                          >
                            Fulfill / Inspect
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. PRODUCT LISTING & CATALOG */}
        {/* ==================================================================== */}
        {currentTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-2xl text-primary font-medium">Product Listing</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Manage bedsheets, pillows, down duvet inserts, and fabric origins.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Craft New Linen</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/40 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search linens by title, material, origin..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                {["all", "bedsheets", "pillows", "duvets"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded text-xs font-label-md uppercase tracking-wider transition-colors ${
                      productCategoryFilter === cat
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {cat === "all" ? "All Collections" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-variant/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant font-label-eyebrow bg-surface-container-low">
                      <th className="py-3 px-4">Item & Silhouette</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Material</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Total Stock</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-neutral-300">inventory_2</span>
                            <h4 className="font-headline-sm text-base text-primary font-medium">Boutique Catalog is Clean</h4>
                            <p className="text-xs text-on-surface-variant max-w-md">
                              All testing products and variants have been cleared. Click &ldquo;Craft New Linen&rdquo; above to list your real collections, or load demo pieces anytime.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProductToEdit(null);
                                  setIsProductModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 rounded bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                              >
                                + Craft New Linen
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  loadDemoCatalog();
                                  showToast("Demo catalog re-seeded successfully.");
                                }}
                                className="px-3.5 py-1.5 rounded border border-surface-variant hover:border-primary text-xs font-label-md uppercase tracking-wider text-primary transition-colors"
                              >
                                Load Demo Catalog
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                      const totalStock = prod.variants.reduce((s, v) => s + v.stock, 0);
                      return (
                        <tr key={prod.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded overflow-hidden bg-surface-container-highest shrink-0 border border-surface-variant">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={prod.images[0]?.url || "/images/hero-bedding.jpg"}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  href={`/product/${prod.slug}`}
                                  target="_blank"
                                  className="font-medium text-primary hover:text-secondary hover:underline transition-colors block"
                                >
                                  {prod.name}
                                </Link>
                                <span className="text-[11px] text-on-surface-variant font-mono">
                                  /{prod.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize text-on-surface-variant">
                            {prod.categoryLabel || prod.category}
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-primary font-medium">{prod.material}</p>
                            {prod.origin && <p className="text-[11px] text-on-surface-variant">{prod.origin}</p>}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-primary">
                              {formatCurrency(prod.basePrice)}
                            </div>
                            {prod.retailPrice && prod.retailPrice > prod.basePrice && (
                              <div className="text-[10px] text-on-surface-variant line-through opacity-75">
                                Retail: {formatCurrency(prod.retailPrice)}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono text-xs font-semibold ${
                                totalStock < 20 ? "text-amber-600" : "text-emerald-700"
                              }`}
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {prod.isBestSeller && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/15 text-secondary uppercase tracking-wider mr-1">
                                Bestseller
                              </span>
                            )}
                            {prod.isNewArrival && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                                New
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setProductToEdit(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                                title="Edit Product"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove "${prod.name}" from catalog?`)) {
                                    deleteProduct(prod.id);
                                    showToast(`Deleted ${prod.name}`);
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors"
                                title="Delete Product"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. INVENTORY MANAGEMENT */}
        {/* ==================================================================== */}
        {currentTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-2xl text-primary font-medium">
                  Inventory & Variant Matrix
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Adjust individual SKU stock levels, inspect low-stock warnings, and execute batch restocks.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {products.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-surface-variant/40">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-neutral-300">warehouse</span>
                    <h3 className="font-headline-sm text-base text-primary font-medium">Inventory Matrix is Clear</h3>
                    <p className="text-xs text-on-surface-variant max-w-md">
                      There are currently no products or variant SKUs in the inventory ledger. All testing stock has been removed. Once you add products, their SKU variants, stock increments, and restock triggers will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setProductToEdit(null);
                        setIsProductModalOpen(true);
                      }}
                      className="mt-2 px-4 py-2 rounded bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      + Add First Product
                    </button>
                  </div>
                </div>
              ) : (
                products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-variant/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-surface-container-highest shrink-0 border border-surface-variant">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.images[0]?.url || "/images/hero-bedding.jpg"}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-primary">{prod.name}</h3>
                        <p className="text-[11px] text-on-surface-variant">
                          {prod.material} • Selling: {formatCurrency(prod.basePrice)}
                          {prod.retailPrice && prod.retailPrice > prod.basePrice
                            ? ` (Retail: ${formatCurrency(prod.retailPrice)})`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        restockProduct(prod.id, 25);
                        showToast(`+25 units added to all variants of ${prod.name}`);
                      }}
                      className="px-3 py-1.5 rounded border border-surface-variant hover:border-secondary text-[11px] font-medium text-secondary transition-colors"
                    >
                      + Batch Restock (+25 to all sizes)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {prod.variants.map((v) => (
                      <div
                        key={v.id}
                        className={`p-3 rounded-lg border text-xs space-y-2 ${
                          v.stock < 15
                            ? "border-amber-400 bg-amber-50/40"
                            : "border-surface-variant/50 bg-surface-container-low"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">{v.size}</span>
                          <span className="text-[10px] font-mono text-on-surface-variant">{v.sku}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-surface-variant"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span>{v.colorName}</span>
                          <span>•</span>
                          <span className="font-semibold text-primary">{formatCurrency(v.price)}</span>
                        </div>

                        {/* Inline Stock Counter */}
                        <div className="pt-2 flex items-center justify-between border-t border-surface-variant/30">
                          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Stock</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateVariantStock(prod.id, v.id, v.stock - 1)}
                              className="w-6 h-6 rounded border border-surface-variant flex items-center justify-center hover:bg-surface-variant text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-semibold text-primary">
                              {v.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateVariantStock(prod.id, v.id, v.stock + 5)}
                              className="w-6 h-6 rounded border border-surface-variant flex items-center justify-center hover:bg-surface-variant text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 4. ORDERS & DISPATCH */}
        {/* ==================================================================== */}
        {currentTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-2xl text-primary font-medium">
                  Customer Orders & Dispatch
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Assign carrier manifests, update fulfillment stages, and inspect client invoices.
                </p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["all", "Processing", "In Transit", "Delivered", "Cancelled"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded text-xs font-label-md uppercase tracking-wider transition-colors ${
                    orderStatusFilter === st
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {st === "all" ? "All Orders" : st}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-surface-container-lowest border border-surface-variant/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant font-label-eyebrow bg-surface-container-low">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Carrier & Tracking</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/20">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-neutral-300">receipt_long</span>
                            <h4 className="font-headline-sm text-base text-primary font-medium">No Customer Orders</h4>
                            <p className="text-xs text-on-surface-variant max-w-md">
                              All test orders and records have been cleared. As real customers make purchases on the boutique storefront, their orders, dispatch statuses, carrier tracking numbers, and invoices will appear here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-primary">{ord.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-primary">{ord.customerName || "Customer"}</p>
                            <p className="text-[11px] text-on-surface-variant">{ord.customerEmail}</p>
                          </td>
                          <td className="py-3.5 px-4 text-on-surface-variant">{ord.createdAt}</td>
                          <td className="py-3.5 px-4">
                            {ord.trackingNumber ? (
                              <div>
                                <p className="text-primary font-medium text-[11px]">{ord.carrier || "TCS Express"}</p>
                                <p className="font-mono text-[10px] text-secondary">{ord.trackingNumber}</p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-on-surface-variant italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-primary">{formatCurrency(ord.total)}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                ord.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ord.status === "In Transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : ord.status === "Processing"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-neutral-100 text-neutral-800"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setIsOrderModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                            >
                              Inspect & Dispatch
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 5. PRIVILEGE CIPHERS (COUPONS) */}
        {/* ==================================================================== */}
        {currentTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-2xl text-primary font-medium">
                  Privilege Ciphers & Promotional Discounts
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Issue bespoke discount codes for VIP sanctuaries and marketing campaigns.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCouponToEdit(null);
                  setIsCouponModalOpen(true);
                }}
                className="px-4 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Issue New Cipher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold tracking-wider text-primary bg-surface-container px-2.5 py-1 rounded border border-surface-variant/40">
                      {c.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCoupon(c.id)}
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${
                        c.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-secondary font-headline-sm text-lg font-semibold">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                    </p>
                    <p className="text-on-surface-variant">
                      Min Spend: {c.minSpend > 0 ? formatCurrency(c.minSpend) : "None"} • Max usages: {c.maxUsage || "Unlimited"}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/80">
                      Total Redeemed: <span className="font-mono font-medium text-primary">{c.usageCount} times</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-variant/30">
                    <button
                      type="button"
                      onClick={() => {
                        setCouponToEdit(c);
                        setIsCouponModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs text-primary hover:text-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete cipher "${c.code}"?`)) {
                          deleteCoupon(c.id);
                          showToast(`Cipher ${c.code} deleted`);
                        }
                      }}
                      className="px-2.5 py-1 text-xs text-error hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 6. STOREFRONT CMS & HERO EDITOR */}
        {/* ==================================================================== */}
        {currentTab === "cms" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline-md text-2xl text-primary font-medium">
                Storefront Visual CMS & Banners
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Full master control of the homepage hero section, announcement banner, and drag-and-drop imagery.
              </p>
            </div>

            <form onSubmit={handleSaveCms} className="space-y-8">
              {/* 1. Announcement Bar Control */}
              <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-surface-variant/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">campaign</span>
                    <h3 className="font-headline-sm text-base text-primary font-medium">
                      Top Promotional Announcement Ticker
                    </h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="rounded accent-secondary"
                    />
                    <span className="font-medium text-primary">Enable Banner</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">Banner Ticker Text</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-medium uppercase tracking-wider"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Displays at the very top of all boutique pages.
                  </p>
                </div>
              </div>

              {/* 2. Hero Section Imagery (Drag & Drop) */}
              <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-surface-variant/30 pb-3">
                  <span className="material-symbols-outlined text-secondary text-lg">landscape</span>
                  <h3 className="font-headline-sm text-base text-primary font-medium">
                    Hero Section Editorial Asset
                  </h3>
                </div>

                <DragDropImageUpload
                  currentImageUrl={heroImageUrl}
                  onImageChange={(newUrl) => {
                    setHeroImageUrl(newUrl);
                    showToast("Hero image asset updated. Click 'Publish Live' below to commit.");
                  }}
                  label="Hero Editorial Background Image"
                  recommendedAspect="16:9 Landscape Ultra HD"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-surface-variant/30">
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Hero Eyebrow Tagline</label>
                    <input
                      type="text"
                      value={heroEyebrow}
                      onChange={(e) => setHeroEyebrow(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary uppercase tracking-widest focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Primary Display Headline</label>
                    <input
                      type="text"
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-serif focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">Subline Narrative</label>
                  <textarea
                    rows={2}
                    value={heroSubheadline}
                    onChange={(e) => setHeroSubheadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={heroPrimaryCtaText}
                      onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Primary Button Link</label>
                    <input
                      type="text"
                      value={heroPrimaryCtaLink}
                      onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={heroSecondaryCtaText}
                      onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">Secondary Button Link</label>
                    <input
                      type="text"
                      value={heroSecondaryCtaLink}
                      onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  Publish Storefront CMS Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 7. SHIPPING & LOGISTICS */}
        {/* ==================================================================== */}
        {currentTab === "shipping" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-headline-md text-2xl text-primary font-medium">
                Shipping & Logistics Rules
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Configure complimentary shipping thresholds, courier flat rates, and monogram qualifications.
              </p>
            </div>

            <form onSubmit={handleSaveShipping} className="p-6 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Free Standard Shipping Threshold ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={freeShipThreshold}
                    onChange={(e) => setFreeShipThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">Orders above this receive free delivery.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Standard Courier Shipping Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stdShipFee}
                    onChange={(e) => setStdShipFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">Charged when below complimentary threshold.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Express Overnight Priority Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={expShipFee}
                    onChange={(e) => setExpShipFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Complimentary Monogramming Threshold ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={monogramThreshold}
                    onChange={(e) => setMonogramThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">Unlocks bespoke monogramming on linen.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1">Estimated Delivery Timeline</label>
                <input
                  type="text"
                  value={estDelivery}
                  onChange={(e) => setEstDelivery(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-surface-variant/30">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md"
                >
                  Save Logistics Rules
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 8. PAYMENTS & FINANCIALS */}
        {/* ==================================================================== */}
        {currentTab === "payments" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-2xl text-primary font-medium">
                  Payment Channels & Domestic Accounts (Pakistan)
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Control active checkout payment gateways, switch methods ON/OFF in real-time, and customize beneficiary account titles, bank IBANs, and instructions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset all payment channels, account titles, and account numbers to official defaults?")) {
                      resetPaymentMethods();
                      showToast("Payment channels restored to official defaults.");
                    }
                  }}
                  className="px-3.5 py-2 rounded border border-surface-variant text-xs text-on-surface-variant hover:text-primary hover:border-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethodToEdit(null);
                    setIsPaymentModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Gateway</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
                <p className="text-[10px] font-label-eyebrow uppercase text-on-surface-variant">ACTIVE CHANNELS (PAKISTAN)</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xl font-bold text-primary">
                    {(paymentMethods || []).filter((m) => m.isEnabled).length} of {(paymentMethods || []).length} Active
                  </p>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {(paymentMethods || []).filter((m) => m.isEnabled).map((m) => m.name).join(" • ")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
                <p className="text-[10px] font-label-eyebrow uppercase text-on-surface-variant">TOTAL REVENUE CAPTURED</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.status === "Captured")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">100% Domestic Settlement</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
                <p className="text-[10px] font-label-eyebrow uppercase text-on-surface-variant">DISPUTES & REFUNDS</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">
                  0.0%
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">Zero payment disputes on record</p>
              </div>
            </div>

            {/* Payment Gateways Config Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-lg text-primary font-serif">
                  Configured Payment Gateways
                </h3>
                <span className="font-label-eyebrow text-[11px] text-secondary uppercase tracking-wider">
                  Live Sync with Cart Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(paymentMethods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`p-5 rounded-2xl bg-surface-container-lowest border transition-all flex flex-col justify-between shadow-sm ${
                      method.isEnabled
                        ? "border-secondary/40 ring-1 ring-secondary/20"
                        : "border-surface-variant/40 opacity-75 bg-surface-container-low/40"
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-surface-variant/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            method.isEnabled ? "bg-secondary/15 text-secondary" : "bg-neutral-200 text-neutral-500"
                          }`}>
                            <span className="material-symbols-outlined text-xl">{method.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-label-md text-sm font-semibold text-primary">
                                {method.name}
                              </h4>
                              <span className="text-[9px] uppercase tracking-wider font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                                {method.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-on-surface-variant block mt-0.5">
                              ID: <code className="font-mono text-[10px]">{method.id}</code>
                            </span>
                          </div>
                        </div>

                        {/* On / Off Switch */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-label-eyebrow tracking-wider font-semibold ${
                            method.isEnabled ? "text-emerald-700" : "text-neutral-500"
                          }`}>
                            {method.isEnabled ? "ON" : "OFF"}
                          </span>
                          <button
                            type="button"
                            title={`Switch ${method.isEnabled ? "OFF" : "ON"} ${method.name}`}
                            onClick={() => {
                              togglePaymentMethod(method.id);
                              showToast(
                                `${method.name} is now ${!method.isEnabled ? "switched ON (Active in Checkout)" : "switched OFF (Hidden from Checkout)"}`
                              );
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                              method.isEnabled ? "bg-emerald-600" : "bg-neutral-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                method.isEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Account Details Box */}
                      <div className="mt-3.5 p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/30 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant text-[11px]">Account Title:</span>
                          <span className="font-semibold text-primary">{method.accountTitle || "—"}</span>
                        </div>

                        {method.accountNumber && (
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant text-[11px]">Account Number:</span>
                            <span className="font-mono font-medium text-primary">{method.accountNumber}</span>
                          </div>
                        )}

                        {method.bankName && (
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant text-[11px]">Bank / Provider:</span>
                            <span className="text-on-surface font-medium">{method.bankName}</span>
                          </div>
                        )}

                        {method.iban && (
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant text-[11px]">IBAN:</span>
                            <span className="font-mono text-[10px] text-secondary font-medium">{method.iban}</span>
                          </div>
                        )}

                        {method.raastId && (
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant text-[11px]">Raast ID:</span>
                            <span className="font-mono text-primary font-medium">{method.raastId}</span>
                          </div>
                        )}

                        {method.instructions && (
                          <div className="pt-2 border-t border-surface-variant/30 text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                            <span className="font-medium text-primary">Instructions: </span>
                            "{method.instructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-surface-variant/30 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                        <span className={`w-2 h-2 rounded-full ${method.isEnabled ? "bg-emerald-500" : "bg-neutral-400"}`} />
                        <span>{method.isEnabled ? "Visible in Cart Checkout" : "Hidden from Customer Checkout"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {method.isCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove custom payment gateway ${method.name}?`)) {
                                deletePaymentMethod(method.id);
                                showToast(`Removed ${method.name}`);
                              }
                            }}
                            className="px-2.5 py-1 text-xs text-error hover:bg-error/10 rounded transition-colors"
                          >
                            Remove
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethodToEdit(method);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded border border-surface-variant bg-surface hover:bg-surface-variant text-primary font-label-md text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Customize Title & Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials & Settlement Ledger */}
            <div className="space-y-4 pt-4 border-t border-surface-variant/40">
              <div>
                <h3 className="font-headline-sm text-lg text-primary font-serif">
                  Settlement Ledger & Transactions
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Audit payment gateways, track captured transactions, and issue customer refunds.
                </p>
              </div>

              <div className="rounded-xl bg-surface-container-lowest border border-surface-variant/40 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-surface-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant font-label-eyebrow bg-surface-container-low">
                        <th className="py-3 px-4">Transaction Ref</th>
                        <th className="py-3 px-4">Linked Order</th>
                        <th className="py-3 px-4">Payer</th>
                        <th className="py-3 px-4">Gateway</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">State</th>
                        <th className="py-3 px-4 text-right">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant/20">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <span className="material-symbols-outlined text-4xl text-neutral-300">receipt_long</span>
                              <h4 className="font-headline-sm text-base text-primary font-medium">Financial Ledger is Clear</h4>
                              <p className="text-xs text-on-surface-variant max-w-md">
                                All testing transactions have been purged. Live settlements and payment records will log automatically as patrons finalize checkout.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        transactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-3 px-4 font-mono font-medium text-primary">{txn.id}</td>
                            <td className="py-3 px-4 font-mono text-secondary">{txn.orderId}</td>
                            <td className="py-3 px-4 text-on-surface-variant">{txn.customerEmail}</td>
                            <td className="py-3 px-4 font-medium text-primary">{txn.gateway}</td>
                            <td className="py-3 px-4 text-on-surface-variant">{txn.date}</td>
                            <td className="py-3 px-4 font-semibold text-primary">{formatCurrency(txn.amount)}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  txn.status === "Captured"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-neutral-200 text-neutral-700"
                                }`}
                              >
                                {txn.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {txn.status === "Captured" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Issue refund of ${formatCurrency(txn.amount)} to ${txn.customerEmail}?`)) {
                                      refundTransaction(txn.id);
                                      showToast(`Refund processed for ${txn.id}`);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded border border-surface-variant text-[11px] text-on-surface-variant hover:text-error hover:border-error transition-colors"
                                >
                                  Issue Refund
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={(data) => {
          if (productToEdit) {
            updateProduct(data.id, data);
            showToast(`Updated ${data.name}`);
          } else {
            addProduct(data);
            showToast(`Created new product: ${data.name}`);
          }
        }}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={(ordId, status) => {
          updateOrderStatus(ordId, status);
          showToast(`Order status updated to ${status}`);
        }}
        onUpdateTracking={(ordId, carrier, trackNum) => {
          updateOrderTracking(ordId, carrier, trackNum);
          showToast(`Tracking number assigned (${carrier}: ${trackNum})`);
        }}
      />

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => {
          setIsCouponModalOpen(false);
          setCouponToEdit(null);
        }}
        couponToEdit={couponToEdit}
        onSave={(data) => {
          if (couponToEdit) {
            updateCoupon(data.id, data);
            showToast(`Cipher ${data.code} updated`);
          } else {
            addCoupon(data);
            showToast(`New cipher ${data.code} published`);
          }
        }}
      />

      {/* Payment Gateway & Account Modal */}
      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentMethodToEdit(null);
        }}
        methodToEdit={paymentMethodToEdit}
        onSave={(data) => {
          if (paymentMethodToEdit) {
            updatePaymentMethod(data.id, data);
            showToast(`Updated payment channel: ${data.name}`);
          } else {
            addPaymentMethod(data);
            showToast(`Added new payment channel: ${data.name}`);
          }
        }}
      />
    </div>
  );
}
