"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth } from "@/context/AuthContext";
import { useAdminStore, INITIAL_PAYMENT_METHODS } from "@/store/useAdminStore";
import { AddressConfirmationModal } from "@/components/cart/AddressConfirmationModal";
import { Order, PaymentMethodConfig } from "@/types";
import { formatCurrency, MONOGRAM_THRESHOLD, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function CartPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { addOrder, paymentMethods } = useAdminStore();
  const {
    items,
    removeItem,
    updateQuantity,
    applyPromo,
    clearPromo,
    promoCode,
    discountPercentage,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    totalItemsCount,
    clearCart,
  } = useCartStore();

  const { items: wishlistItems } = useWishlistStore();
  const { showToast } = useToast();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Dynamic Payment Methods from Admin Atelier OS
  const enabledPaymentMethods: PaymentMethodConfig[] = React.useMemo(() => {
    const list = paymentMethods && paymentMethods.length > 0 ? paymentMethods : INITIAL_PAYMENT_METHODS;
    return list.filter((m) => m.isEnabled);
  }, [paymentMethods]);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("cod");
  const [paymentRef, setPaymentRef] = useState("");

  React.useEffect(() => {
    if (enabledPaymentMethods.length > 0) {
      const exists = enabledPaymentMethods.some((m) => m.id === selectedPaymentId);
      if (!exists) {
        setSelectedPaymentId(enabledPaymentMethods[0].id);
      }
    }
  }, [enabledPaymentMethods, selectedPaymentId]);

  const activePaymentMethod =
    enabledPaymentMethods.find((m) => m.id === selectedPaymentId) || enabledPaymentMethods[0];

  const currentSubtotal = subtotal();
  const currentTotal = total();
  const currentDiscount = discountAmount();
  const currentShipping = shippingFee();
  const count = totalItemsCount();

  const monogramProgress = Math.min(100, Math.round((currentSubtotal / MONOGRAM_THRESHOLD) * 100));
  const awayFromMonogram = Math.max(0, MONOGRAM_THRESHOLD - currentSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage(res.message);
    if (res.success) {
      showToast(res.message);
      setInputCode("");
    } else {
      showToast(res.message, "error");
    }
  };

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsAddressModalOpen(true);
  };

  const handleConfirmedOrder = (address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    notes?: string;
  }) => {
    setIsProcessingCheckout(true);

    const paymentMethodTitle = activePaymentMethod ? activePaymentMethod.name : "Cash on Delivery (COD)";
    const paymentMethodDisplay = paymentRef ? `${paymentMethodTitle} (Ref: ${paymentRef})` : paymentMethodTitle;

    const newOrder: Order = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      userId: user?.id || "guest-pk",
      customerName: address.name,
      customerEmail: user?.email || `${address.phone.replace(/[^0-9]/g, "")}@loomsday.pk`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      status: "Processing",
      carrier: "TCS Express Courier",
      trackingNumber: "TCS-" + Math.floor(1000000 + Math.random() * 9000000),
      paymentMethod: paymentMethodDisplay,
      items: items.map((it) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        productId: it.productId,
        productName: it.productName,
        productSlug: it.productSlug,
        imageUrl: it.imageUrl,
        price: it.price,
        quantity: it.quantity,
        size: it.size,
        colorName: it.colorName,
      })),
      subtotal: currentSubtotal,
      shipping: currentShipping,
      discount: currentDiscount,
      total: currentTotal,
      promoCode: promoCode || undefined,
      shippingAddress: {
        name: address.name,
        street: address.street + (address.notes ? ` (Note: ${address.notes})` : ""),
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: "Pakistan",
      },
    };

    setTimeout(() => {
      addOrder(newOrder);
      setIsProcessingCheckout(false);
      setIsAddressModalOpen(false);
      clearCart();
      showToast(`Order #${newOrder.id} placed! Delivering via TCS to ${address.city}.`, "success");
      router.push("/account");
    }, 1000);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-24 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl animate-spin text-secondary">progress_activity</span>
        <p className="font-label-eyebrow text-xs uppercase tracking-widest mt-4">Preparing Sanctuary Bag...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Monogram Privilege Banner */}
      <div className="mb-10 p-6 rounded-xl bg-surface-container-low shadow-sm border border-surface-variant/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
              Complimentary Privilege
            </span>
          </div>
          <p className="font-headline-sm text-lg text-primary">
            {currentSubtotal >= MONOGRAM_THRESHOLD
              ? "Complimentary White-Glove Monogramming Unlocked!"
              : `You’re ${formatCurrency(awayFromMonogram)} away from Complimentary White-Glove Monogramming`}
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Unlock personalized bespoke embroidery on your heirloom sheets with orders over $715.
          </p>
        </div>

        <div className="w-full md:w-72 flex flex-col gap-2">
          <div className="flex justify-between items-center font-label-sm text-xs text-on-surface">
            <span>Current Bag: {formatCurrency(currentSubtotal)}</span>
            <span className="text-secondary font-medium">{monogramProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${monogramProgress}%` }}
            />
          </div>
          <span className="font-label-eyebrow text-[10px] tracking-wider text-right text-on-surface-variant uppercase">
            Target: $715
          </span>
        </div>
      </div>

      {/* Main Grid: 65% Items / 35% Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (Items) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-baseline justify-between pb-3 border-b border-surface-variant/40">
            <h1 className="font-headline-md text-headline-md text-primary">
              Shopping Bag <span className="font-body-md text-base text-on-surface-variant">({count} {count === 1 ? "item" : "items"})</span>
            </h1>
            <Link
              href="/shop"
              className="font-label-sm text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>Continue Curating</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-surface-container-low rounded-xl p-8 border border-surface-variant/30">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">shopping_bag</span>
              <h3 className="font-headline-sm text-xl text-primary">Your Shopping Bag is Quiet</h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
                No items currently resting in your cart. Explore our slower, softer linen collections.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-2 px-8 py-3 bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded shadow-sm"
              >
                Discover Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-lg bg-surface-container-low shadow-sm flex flex-col sm:flex-row gap-6 border border-surface-variant/30 transition-all hover:shadow-md"
                >
                  <div className="w-full sm:w-36 h-44 rounded overflow-hidden flex-shrink-0 bg-surface-container relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
                            Sanctuary Piece
                          </span>
                          <Link href={`/product/${item.productSlug}`} className="block">
                            <h2 className="font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors">
                              {item.productName}
                            </h2>
                          </Link>
                        </div>
                        <span className="font-headline-sm text-base text-primary font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1 font-body-sm text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full shadow-sm inline-block border border-surface-variant"
                            style={{ backgroundColor: item.colorHex || "#FAF7F2" }}
                          />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span className="text-secondary font-medium">In Stock</span>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-variant/30">
                      {/* Stepper */}
                      <div className="flex items-center rounded bg-surface px-2.5 py-1 gap-3 border border-surface-variant/50">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded text-on-surface hover:text-primary active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-label-md text-sm min-w-[20px] text-center text-primary font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded text-on-surface hover:text-primary active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.id);
                            showToast(`Saved ${item.productName} for later.`);
                          }}
                          className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">bookmark</span>
                          <span>Save for Later</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="p-6 rounded-xl bg-surface-container-low shadow-sm border border-surface-variant/40 space-y-6">
            <h3 className="font-headline-sm text-lg text-primary border-b border-surface-variant/40 pb-4">
              Order Summary
            </h3>

            {/* Calculations */}
            <div className="space-y-3 font-body-sm text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({count} items)</span>
                <span className="text-primary font-medium">{formatCurrency(currentSubtotal)}</span>
              </div>

              <div className="flex justify-between text-on-surface-variant">
                <span>Expedited Shipping</span>
                <span className="text-primary font-medium">
                  {currentShipping === 0 ? "Complimentary" : formatCurrency(currentShipping)}
                </span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Privilege Cipher ({promoCode} -{discountPercentage}%)</span>
                  <span>-{formatCurrency(currentDiscount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-variant/40 flex justify-between items-baseline">
                <span className="font-label-md text-base text-primary font-semibold">Total</span>
                <span className="font-headline-md text-xl text-primary font-medium">
                  {formatCurrency(currentTotal)}
                </span>
              </div>
            </div>



            {/* Promo Code Input */}
            <div className="pt-2">
              <label htmlFor="promo" className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant mb-1.5">
                Privilege Cipher / Promo Code
              </label>
              {discountPercentage > 0 ? (
                <div className="flex items-center justify-between p-2.5 rounded bg-surface border border-secondary/40 text-secondary font-label-sm text-xs">
                  <span>Cipher {promoCode} active (-{discountPercentage}%)</span>
                  <button type="button" onClick={clearPromo} className="underline text-error uppercase text-[10px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="e.g. SANCTUARY15"
                    className="flex-1 px-3 py-2 bg-surface text-on-surface rounded font-body-sm text-xs border border-surface-variant focus:outline-none focus:border-secondary uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-primary font-label-sm text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoMessage && discountPercentage === 0 && (
                <p className="font-body-sm text-xs text-error mt-1">{promoMessage}</p>
              )}
            </div>

            {/* Payment Method Selector (Pakistan) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block font-label-sm text-xs uppercase tracking-wider text-primary font-medium">
                  Payment Method (Pakistan)
                </label>
                <span className="text-[10px] text-secondary font-label-eyebrow uppercase tracking-wider">
                  {enabledPaymentMethods.length} Channels Active
                </span>
              </div>

              {enabledPaymentMethods.length === 0 ? (
                <div className="p-4 rounded-xl bg-surface-container border border-surface-variant text-xs text-on-surface-variant text-center space-y-1">
                  <span className="material-symbols-outlined text-xl text-secondary">payment</span>
                  <p className="font-semibold text-primary">No Payment Channels Currently Active</p>
                  <p className="text-[11px]">Please contact store administration to enable payment gateways.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {enabledPaymentMethods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedPaymentId(m.id)}
                        className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                          selectedPaymentId === m.id
                            ? "border-secondary bg-surface ring-1 ring-secondary/40 shadow-sm"
                            : "border-surface-variant/50 bg-surface-container hover:border-surface-variant"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="material-symbols-outlined text-secondary text-lg">{m.icon}</span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                            {m.badge}
                          </span>
                        </div>
                        <span className="font-label-md text-xs text-primary font-medium mt-2">
                          {m.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Active Payment Details Box */}
                  {activePaymentMethod && (
                    <div className="p-3.5 rounded-xl bg-surface border border-secondary/30 text-xs space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-secondary text-[11px] uppercase tracking-wider">
                          {activePaymentMethod.name} Details
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold uppercase">
                          Verified Channel
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-on-surface">
                        <p>
                          <span className="text-on-surface-variant">Account Title:</span>{" "}
                          <strong className="text-primary">{activePaymentMethod.accountTitle || "LOOMSDAY LUXURY BEDDING"}</strong>
                        </p>

                        {activePaymentMethod.accountNumber && (
                          <p>
                            <span className="text-on-surface-variant">Account / Phone:</span>{" "}
                            <strong className="font-mono text-primary">{activePaymentMethod.accountNumber}</strong>
                          </p>
                        )}

                        {activePaymentMethod.bankName && (
                          <p>
                            <span className="text-on-surface-variant">Bank / Channel:</span>{" "}
                            <strong>{activePaymentMethod.bankName}</strong>
                          </p>
                        )}

                        {activePaymentMethod.iban && (
                          <p>
                            <span className="text-on-surface-variant">IBAN:</span>{" "}
                            <span className="font-mono text-[10px] text-secondary font-medium">{activePaymentMethod.iban}</span>
                          </p>
                        )}

                        {activePaymentMethod.raastId && (
                          <p>
                            <span className="text-on-surface-variant">Raast ID:</span>{" "}
                            <span className="font-mono text-primary">{activePaymentMethod.raastId}</span>
                          </p>
                        )}

                        {activePaymentMethod.instructions && (
                          <p className="text-[11px] text-on-surface-variant pt-1 leading-relaxed border-t border-surface-variant/30">
                            {activePaymentMethod.instructions}
                          </p>
                        )}
                      </div>

                      {activePaymentMethod.requiresProofReference && (
                        <div className="pt-1.5 border-t border-surface-variant/30">
                          <label className="block text-[10px] uppercase font-label-eyebrow text-on-surface-variant mb-1">
                            Sender Name / Mobile Number / Transaction TID
                          </label>
                          <input
                            type="text"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder="e.g. 0300-1234567 or Meezan TID / Transfer Ref..."
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-surface-variant bg-surface-container-low text-primary focus:outline-none focus:border-secondary"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              disabled={items.length === 0 || isProcessingCheckout || enabledPaymentMethods.length === 0}
              onClick={handleCheckout}
              className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md active:translate-y-0.5"
            >
              <span>
                {isProcessingCheckout
                  ? "Confirming Sanctuary Order..."
                  : enabledPaymentMethods.length === 0
                  ? "No Payment Channel Available"
                  : activePaymentMethod?.id === "cod"
                  ? `Place Order (${activePaymentMethod.name})`
                  : `Proceed with ${activePaymentMethod?.name || "Payment"}`}
              </span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>

            {/* Trust Seals */}
            <div className="pt-4 border-t border-surface-variant/30 space-y-2 text-on-surface-variant text-xs font-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span>256-Bit Encrypted Concierge Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">hotel</span>
                <span>30-Night Slumber Trial &amp; Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Delivery Address Confirmation Modal */}
      <AddressConfirmationModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleConfirmedOrder}
        totalAmount={currentTotal}
        paymentMethodLabel={activePaymentMethod ? activePaymentMethod.name : "Cash on Delivery (COD)"}
        initialData={{
          name: profile?.fullName || "Syed Ahmed",
          phone: profile?.phone || "0300-1234567",
          street: profile?.shippingAddress?.street || "House 14, Street 7, Phase 5, DHA",
          city: profile?.shippingAddress?.city || "Lahore",
          state: profile?.shippingAddress?.state || "Punjab",
          zipCode: profile?.shippingAddress?.zipCode || "54000",
        }}
        isSubmitting={isProcessingCheckout}
      />
    </div>
  );
}
