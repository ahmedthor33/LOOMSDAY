"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onUpdateTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
}: OrderDetailModalProps) {
  const [carrier, setCarrier] = useState(order?.carrier || "UPS Express");
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "");
  const [status, setStatus] = useState<Order["status"]>(order?.status || "Processing");

  React.useEffect(() => {
    if (order) {
      setCarrier(order.carrier || "UPS Express");
      setTrackingNumber(order.trackingNumber || "");
      setStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSaveFulfillment = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(order.id, status);
    if (trackingNumber.trim()) {
      onUpdateTracking(order.id, carrier, trackingNumber.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-variant/70 rounded-xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-variant/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-eyebrow text-[10px] text-secondary tracking-widest uppercase">
                ATELIER ORDER LEDGER
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="text-xs text-on-surface-variant">{order.createdAt}</span>
            </div>
            <h2 className="font-headline-md text-2xl text-primary font-medium mt-1">
              {order.id}
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Customer: <span className="font-medium text-primary">{order.customerName || "Customer"}</span> ({order.customerEmail || "No email recorded"})
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

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-label-md text-xs uppercase tracking-wider text-primary font-medium">
            Handcrafted Manifest ({order.items.length} items)
          </h3>
          <div className="divide-y divide-surface-variant/30 border border-surface-variant/40 rounded-lg overflow-hidden bg-surface-container-lowest">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded overflow-hidden bg-surface-container-highest shrink-0 border border-surface-variant">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary truncate">{item.productName}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {item.size} • {item.colorName} • Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Destination & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-surface-container border border-surface-variant/40 space-y-1 text-xs">
            <p className="font-label-eyebrow text-[10px] uppercase tracking-wider text-secondary font-semibold">
              SHIPPING DESTINATION
            </p>
            <p className="font-medium text-primary">{order.shippingAddress.name}</p>
            <p className="text-on-surface-variant">{order.shippingAddress.street}</p>
            <p className="text-on-surface-variant">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p className="text-on-surface-variant">{order.shippingAddress.country}</p>
          </div>

          <div className="p-4 rounded-lg bg-surface-container border border-surface-variant/40 space-y-2 text-xs">
            <p className="font-label-eyebrow text-[10px] uppercase tracking-wider text-secondary font-semibold">
              TRANSACTION AUDIT
            </p>
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? "Complimentary" : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-primary pt-1 border-t border-surface-variant/40">
              <span>Grand Total:</span>
              <span className="text-sm text-secondary">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-[10px] text-on-surface-variant italic pt-1">
              Method: {order.paymentMethod || "Direct Settlement"}
            </p>
          </div>
        </div>

        {/* Fulfillment & Tracking Updater */}
        <form onSubmit={handleSaveFulfillment} className="p-4 rounded-lg bg-surface-container-low border border-surface-variant/60 space-y-4">
          <h3 className="font-label-md text-xs uppercase tracking-wider text-primary font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">local_shipping</span>
            <span>Update Carrier Dispatch & Tracking</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-primary mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order["status"])}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-primary mb-1">Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
              >
                <option value="TCS Express">TCS Express</option>
                <option value="Leopards Courier">Leopards Courier</option>
                <option value="Trax Logistics">Trax Logistics</option>
                <option value="M&P Express">M&P Express</option>
                <option value="UPS Express">UPS Express</option>
                <option value="DHL Express">DHL Express</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-primary mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. UPS-8491-9281-US"
                className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              Save Dispatch Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
