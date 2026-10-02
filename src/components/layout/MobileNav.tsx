"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const links = [
    { name: "Home", href: "/" },
    { name: "All Bedding", href: "/shop" },
    { name: "Bedsheet Sets", href: "/shop/bedsheets" },
    { name: "Pillows & Shams", href: "/shop/pillows" },
    { name: "Duvets & Inserts", href: "/shop/duvets" },
    { name: "Saved Sanctuary", href: "/wishlist" },
    { name: "My Concierge Account", href: "/account" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dim backdrop */}
      <div 
        className="fixed inset-0 bg-primary/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
            <span className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">
              LOOMSDAY
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="p-1 rounded-full text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`py-2 px-3 rounded font-label-md text-label-md uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-surface-container-high text-primary font-semibold"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-surface-variant/40 space-y-3">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
            <span>OEKO-TEX 100 Certified</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Complimentary shipping on orders over Rs. 5,000.
          </p>
        </div>
      </div>
    </div>
  );
}
