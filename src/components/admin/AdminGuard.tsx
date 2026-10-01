"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SUPER_ADMIN_EMAIL, isSuperAdminEmail } from "@/store/useAdminStore";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, signInWithEmail, signOut } = useAuth();

  const isOwner = user && isSuperAdminEmail(user.email);

  if (isOwner) {
    return <>{children}</>;
  }

  // Fallback: Restricted Access Screen for non-superadmin users
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-variant/60 rounded-xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto text-secondary">
          <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
        </div>

        <div className="space-y-2">
          <span className="font-label-eyebrow text-[10px] tracking-[0.25em] text-secondary uppercase font-semibold">
            ATELIER SOVEREIGN VAULT
          </span>
          <h1 className="font-headline-md text-2xl text-primary font-medium">Restricted Owner Access</h1>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            This terminal governs product pricing, inventory allocations, orders, and storefront hero curation. Access is strictly reserved for the designated master owner.
          </p>
        </div>

        {/* Current user badge */}
        <div className="p-3 rounded-lg bg-surface-container border border-surface-variant/40 text-left">
          <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Authorized Owner</p>
          <p className="text-xs font-medium text-primary font-mono mt-0.5">{SUPER_ADMIN_EMAIL}</p>
          {user && (
            <p className="text-[11px] text-error mt-1">
              Currently signed in as: <span className="font-mono">{user.email}</span>
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {/* Quick 1-Click Owner Switch for Ahmed */}
          <button
            type="button"
            onClick={async () => {
              await signInWithEmail(SUPER_ADMIN_EMAIL, "admin12345");
            }}
            className="w-full py-3.5 px-4 rounded bg-primary hover:bg-neutral-800 text-on-primary font-label-md text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">vpn_key</span>
            <span>Authenticate as Master Owner</span>
          </button>

          <div className="flex items-center gap-2 pt-2">
            {user ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="flex-1 py-2.5 px-3 rounded border border-surface-variant text-xs text-on-surface-variant hover:text-error hover:border-error transition-colors"
              >
                Sign Out Current Session
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="flex-1 py-2.5 px-3 rounded border border-surface-variant text-xs text-primary hover:bg-surface-container transition-colors"
              >
                Standard Sign In
              </Link>
            )}
            <Link
              href="/"
              className="py-2.5 px-3 rounded text-xs text-secondary hover:underline"
            >
              Return to Store ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
