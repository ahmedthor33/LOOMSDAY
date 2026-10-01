"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      showToast("Recovery cipher dispatched to your email address.");
    }, 600);
  };

  return (
    <div className="w-full min-h-[85vh] -mt-28 pt-36 flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md w-full p-8 sm:p-10 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-variant/40 text-center space-y-6">
        <div>
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">
            lock_reset
          </span>
          <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest block mb-2">
            Private Key Recovery
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Reset Password
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-2 leading-relaxed">
            Enter the email associated with your concierge account and we will send you secure recovery instructions.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 rounded bg-surface-container-low space-y-4">
            <span className="material-symbols-outlined text-3xl text-secondary">mark_email_read</span>
            <p className="font-headline-sm text-base text-primary">Instructions Dispatched</p>
            <p className="font-body-sm text-xs text-on-surface-variant">
              We have sent a reset link to <strong className="text-primary">{email}</strong>. Check your inbox to regain vault access.
            </p>
            <Link
              href="/sign-in"
              className="inline-block mt-4 px-6 py-2.5 rounded bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label htmlFor="recovery-email" className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                Account Email
              </label>
              <input
                id="recovery-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@example.com"
                className="w-full px-4 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {isLoading ? "Dispatching Cipher..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-surface-variant/40">
          <Link
            href="/sign-in"
            className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
