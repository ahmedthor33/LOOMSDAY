"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-variant/40 pt-16 pb-12 mt-auto">
      {/* 4 Brand Pillars */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-14 border-b border-surface-variant/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="material-symbols-outlined text-[26px] text-secondary">verified</span>
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary">
              OEKO-TEX® 100
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Guaranteed free of 300+ toxic chemicals &amp; synthetic softeners.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="material-symbols-outlined text-[26px] text-secondary">hotel</span>
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary">
              30-Night Trial
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Wash it, sleep on it. If not entirely transformed, return with ease.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="material-symbols-outlined text-[26px] text-secondary">local_shipping</span>
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary">
              Complimentary Delivery
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Free expedited shipping on all orders over Rs. 5,000.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="material-symbols-outlined text-[26px] text-secondary">workspace_premium</span>
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary">
              Lifetime Care
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Tailored with heirloom seams made to soften over decades.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block group" aria-label="LOOMSDAY">
              <Image
                src="/images/logo/logo.png"
                alt="LOOMSDAY"
                width={160}
                height={120}
                className="h-14 sm:h-16 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Quiet luxury bedding crafted from slow-harvested Normandy flax and Aegean cotton. Designed for the unhurried life.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest block mb-2">
                Sanctuary Gazette
              </span>
              {subscribed ? (
                <div className="p-3 rounded bg-surface-container text-secondary font-body-sm text-sm">
                  ✦ You have entered the sanctuary circle. Welcome.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded bg-surface border border-surface-variant text-on-surface font-body-sm text-sm focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1: Collections */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-label-eyebrow text-label-eyebrow uppercase text-primary tracking-widest font-semibold">
              Collections
            </h5>
            <ul className="space-y-2.5 font-body-sm text-sm text-on-surface-variant">
              <li>
                <Link href="/shop/bedsheets" className="hover:text-primary transition-colors">
                  Bedsheet Sets
                </Link>
              </li>
              <li>
                <Link href="/shop/pillows" className="hover:text-primary transition-colors">
                  Pillows &amp; Shams
                </Link>
              </li>
              <li>
                <Link href="/shop/duvets" className="hover:text-primary transition-colors">
                  Duvet Inserts &amp; Covers
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  All Rest Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Provenance */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-label-eyebrow text-label-eyebrow uppercase text-primary tracking-widest font-semibold">
              Provenance
            </h5>
            <ul className="space-y-2.5 font-body-sm text-sm text-on-surface-variant">
              <li>
                <Link href="/#craft" className="hover:text-primary transition-colors">
                  Normandy Harvest
                </Link>
              </li>
              <li>
                <Link href="/#craft" className="hover:text-primary transition-colors">
                  Artisanal Weave Mills
                </Link>
              </li>
              <li>
                <Link href="/#craft" className="hover:text-primary transition-colors">
                  0.0% Harmful Chemicals
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-primary transition-colors">
                  Rest Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Concierge */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-label-eyebrow text-label-eyebrow uppercase text-primary tracking-widest font-semibold">
              Concierge
            </h5>
            <ul className="space-y-2.5 font-body-sm text-sm text-on-surface-variant">
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  Member Orders &amp; Profile
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-primary transition-colors">
                  Private Wishlist Archive
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-primary transition-colors">
                  Complimentary Monogramming
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-primary transition-colors">
                  Care &amp; Wash Rituals
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pt-8 border-t border-surface-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-xs text-on-surface-variant/70">
        <p>© {new Date().getFullYear()} LOOMSDAY Atelier Ltd. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms of Atelier</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
