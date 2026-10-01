"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth } from "@/context/AuthContext";
import { useAdminStore, isSuperAdminEmail } from "@/store/useAdminStore";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "./SearchModal";

export function Header() {
  const pathname = usePathname();
  const { totalItemsCount, openDrawer } = useCartStore();
  const { count: wishlistCount } = useWishlistStore();
  const { user, profile, signOut } = useAuth();
  const { cms } = useAdminStore();
  
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = totalItemsCount();
  const savedCount = wishlistCount();
  const isOwner = user && isSuperAdminEmail(user.email);

  const navLinks = [
    { name: "Bedsheets", href: "/shop/bedsheets" },
    { name: "Pillows & Covers", href: "/shop/pillows" },
    { name: "Duvets", href: "/shop/duvets" },
    { name: "All Collections", href: "/shop" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,28,28,0.04)] border-b border-surface-variant/30">
        {/* Promotional Ticker from Admin CMS */}
        {cms.announcement.enabled && (
          <div className="bg-surface-container text-on-surface-variant flex items-center justify-center py-2 px-4 text-center tracking-widest uppercase font-label-eyebrow text-label-eyebrow border-b border-surface-variant/40 select-none">
            {cms.announcement.text}
          </div>
        )}

        {/* Main Navbar */}
        <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden text-on-surface p-1 hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-headline-sm text-headline-sm tracking-[0.2em] text-primary uppercase font-medium">
                LOOMSDAY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-label-md text-label-md uppercase tracking-wider transition-colors duration-200 py-1 ${
                      isActive
                        ? "text-primary font-medium border-b border-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase">
              <span>PKR Rs.</span>
            </div>

            {/* Search Trigger */}
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setIsSearchOpen(true)}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="View Saved Sanctuary"
              className="relative text-on-surface-variant hover:text-on-surface transition-colors p-1.5 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {mounted && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              aria-label="Shopping Cart"
              onClick={openDrawer}
              className="relative text-on-surface-variant hover:text-on-surface transition-colors p-1.5 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {mounted && user ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="User Account Menu"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-surface-variant hover:ring-secondary transition-all flex items-center justify-center bg-surface-container text-primary font-label-sm font-semibold">
                      {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-lg shadow-xl border border-surface-variant/50 p-2 z-50">
                      <div className="px-3 py-2 border-b border-surface-variant/40">
                        <p className="font-label-md text-primary font-medium truncate">{profile?.fullName || "Member"}</p>
                        <p className="font-body-sm text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                      {isOwner && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/20 rounded transition-colors mt-1 border border-secondary/20"
                        >
                          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                          <span>Atelier Admin OS ⚙</span>
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded transition-colors mt-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        Concierge Profile
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        Saved Items ({savedCount})
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/30 rounded transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  aria-label="Sign In"
                  className="flex items-center gap-2 pl-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[22px]">person</span>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
