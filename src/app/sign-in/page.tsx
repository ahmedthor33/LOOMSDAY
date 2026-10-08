"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function SignInPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
      } else {
        showToast("Welcome back to your Sanctuary.");
        router.push("/account");
      }
    } catch {
      setErrorMsg("An unexpected issue occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      showToast("Signed in via Google Concierge.");
      router.push("/account");
    } catch {
      setErrorMsg("Google authentication encountered an error.");
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    demoLogin();
    showToast("Signed in as Valued Patron.");
    router.push("/account");
  };

  return (
    <div className="w-full min-h-[92vh] -mt-28 pt-28 grid grid-cols-1 lg:grid-cols-12 bg-surface">
      {/* Left Column: Editorial Atmospheric Visual (6 Cols) */}
      <div className="relative hidden lg:flex lg:col-span-6 overflow-hidden flex-col justify-between p-12 xl:p-16 bg-surface-container">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFnio8prB3nNNxAn9K69bj2ttX66ynef72vtjnVPJRTlm8v464hwildEhjP3yeBym3EzDU5lgIj9hHr1dh82t7Ww0Jv6O2xKg-OQ_Tt3JngNN8XCkh4AuD8w8SG5XsEgij18F3rRA23yTA3gkj0Nvv4iZ93K5W9VJVBmKTGPrAGEcNXM_TRfaZH2F1Hoix2TBiVVn4ySPW6wMina25ew50SABpJgO3_8H4vSsyZDvKgjJhdVILwZYMlw')",
          }}
        />

        {/* Ambient Tint & Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />

        {/* Top Brand Stamp */}
        <div className="relative z-10 flex items-center justify-between text-on-primary">
          <Link href="/" className="inline-flex items-center gap-3 group" aria-label="LOOMSDAY">
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt="LOOMSDAY"
              width={160}
              height={28}
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-85"
            />
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface/10 backdrop-blur-md text-surface/90 font-label-sm text-label-sm uppercase tracking-widest">
            <span>Sanctuary Edition</span>
          </div>
        </div>

        {/* Bottom Editorial Callout */}
        <div className="relative z-10 max-w-lg mt-auto space-y-6 text-surface">
          <div className="w-8 h-[1px] bg-secondary-fixed" />
          <blockquote className="font-headline-lg text-headline-lg text-surface italic font-normal leading-[1.25]">
            &ldquo;The art of resting well begins here.&rdquo;
          </blockquote>
          <div className="flex items-center justify-between text-surface/80 pt-2 font-body-sm text-body-sm tracking-wide">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
              <span>Suite 04 — Copenhagen Morning Light</span>
            </div>
            <span className="font-label-eyebrow text-label-eyebrow text-surface/70">
              300 GSM RAW LINEN
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Suite (6 Cols) */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-24 py-12 bg-surface">
        <div className="w-full max-w-md mx-auto flex flex-col">
          {/* Navigation Backlink */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-200 group font-label-sm text-label-sm tracking-widest uppercase"
            >
              <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:-translate-x-1">
                west
              </span>
              <span>Return to Boutique</span>
            </Link>
          </div>

          {/* Section Header */}
          <header className="mb-8">
            <div className="inline-block px-2.5 py-0.5 mb-3 rounded bg-surface-container font-label-eyebrow text-label-eyebrow text-secondary uppercase">
              Private Vault Access
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-normal">
              Welcome Back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Sign in to access your bespoke orders, personalized sleep profiles, and member-only linen archives.
            </p>
          </header>

          {/* Demo VIP Instant Button */}
          <div className="mb-6 p-3.5 bg-surface-container-low rounded-lg border border-surface-variant/50 flex items-center justify-between gap-3">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-medium">
                Testing the Boutique?
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant">
                1-Click Instant Access as Valued Patron
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="px-3.5 py-1.5 rounded bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Demo Sign In
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-error-container text-on-error-container font-body-sm text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Social Authentication: Google */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex items-center justify-center gap-3 text-on-surface cursor-pointer group shadow-sm border border-surface-variant/30"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-105 duration-200" viewBox="0 0 24 24">
                <path
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  fill="#34A853"
                />
                <path
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-label-md text-label-md uppercase tracking-wider text-[12px]">
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative py-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[1px] bg-surface-variant" />
              </div>
              <span className="relative px-4 bg-surface font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Traditional Auth Form */}
          <form onSubmit={handleSignIn} className="space-y-4 mt-2">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@domain.com"
                  className="w-full h-12 px-4 rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md transition-all duration-200 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-variant/50"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block font-label-sm text-label-sm uppercase text-on-surface-variant tracking-widest"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-4 pr-12 rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md transition-all duration-200 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-variant/50"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Recover Link */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-container accent-primary cursor-pointer"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">
                  Remember this device
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 shadow-md"
              >
                <span>{isLoading ? "Validating Credentials..." : "Sign In"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* New User Link */}
          <div className="mt-8 text-center pt-6 border-t border-surface-variant/40">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to LOOMSDAY?
              <Link
                href="/sign-up"
                className="font-medium text-primary hover:text-secondary underline underline-offset-4 ml-1 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
