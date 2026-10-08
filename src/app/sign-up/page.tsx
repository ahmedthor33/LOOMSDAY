"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate password strength (0 to 3)
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);
  const strengthLabels = ["Unset", "Moderate", "Elevated", "Sanctuary-Grade"];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters in length.");
      return;
    }

    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const res = await signUpWithEmail(fullName, email, password);
      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
      } else {
        showToast("Welcome to LOOMSDAY Atelier.");
        router.push("/account");
      }
    } catch {
      setErrorMsg("An unexpected issue occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[92vh] -mt-28 pt-28 grid grid-cols-1 lg:grid-cols-12 bg-surface">
      {/* Left Column: Atmospheric Editorial Visual (6 Cols) */}
      <div className="relative hidden lg:flex lg:col-span-6 min-h-full flex-col justify-between p-12 xl:p-16 overflow-hidden bg-surface-container-high">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD54RdzxfjYQY5VK2E2YEvG2TQQKrOYkd18sPfUBQ24KHAOELh0da65NV2L7EI765-IpgeW0oAqtBLqXFa-LeJplWH7hH-QmZ44QVt-DlKi_JECUijc_3o4KxvSYyBlvrb2cvSY7kc7Lo0sEWmRPPu4D0dZGKVyK7LazDCPtHogszVTCg44GQp-VYL6PDBQgK1-f3324-KqvsswDBDicK8sWimSOUbQF-Nh2E9R6LNQ5Mwq7dCaPRHHpQ')",
          }}
        />

        {/* Scrim Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/25 to-transparent" />

        {/* Top Brand Stamp */}
        <div className="relative z-10 flex items-center justify-between text-on-primary">
          <Link href="/" className="inline-flex items-center gap-2 group" aria-label="LOOMSDAY">
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt="LOOMSDAY"
              width={160}
              height={28}
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-85"
            />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface/15 backdrop-blur-md rounded-full text-surface font-label-sm text-label-sm tracking-widest uppercase">
            <span>Atelier Collection</span>
          </div>
        </div>

        {/* Bottom Editorial Narrative */}
        <div className="relative z-10 max-w-lg mt-auto pt-24 text-surface">
          <div className="inline-block mb-3 px-2.5 py-1 bg-surface/20 backdrop-blur-sm rounded text-surface font-label-eyebrow text-label-eyebrow uppercase">
            Chapter 01 : Enrollment
          </div>
          <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-surface mb-4 leading-tight tracking-tight">
            Join the Sanctuary.
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-low/90 leading-relaxed font-light max-w-md">
            Exclusive access to archival releases, seasonal color drops, and personalized bedding consultations.
          </p>

          {/* Metrics */}
          <div className="mt-8 pt-6 flex items-center gap-6 text-surface/80 font-label-sm text-label-sm border-t border-surface/20">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-surface">175 GSM</span>
              <span className="text-[10px] tracking-widest uppercase opacity-75">Normandy Flax</span>
            </div>
            <div className="w-px h-8 bg-surface/20" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-surface">OEKO-TEX</span>
              <span className="text-[10px] tracking-widest uppercase opacity-75">Class 1 Toxin-Free</span>
            </div>
            <div className="w-px h-8 bg-surface/20" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-surface">100 Nights</span>
              <span className="text-[10px] tracking-widest uppercase opacity-75">Slumber Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Architectural Registration Suite (6 Cols) */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-surface">
        <div className="max-w-md w-full mx-auto">
          {/* Navigation Backlink */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest transition-colors hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:-translate-x-1">
                arrow_back
              </span>
              <span>Return to Boutique</span>
            </Link>
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
              Privilege Tier
            </span>
          </div>

          {/* Section Header */}
          <div className="mb-8">
            <p className="font-label-eyebrow text-label-eyebrow text-secondary uppercase tracking-widest mb-1.5">
              Guest Ledger Registration
            </p>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-normal">
              Create Your Account
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Begin your journey toward elevated, restorative sleep.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-error-container text-on-error-container font-body-sm text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Auth */}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container transition-all duration-200 border border-surface-variant/40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-[12px]">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full h-px bg-surface-variant" />
            <span className="absolute bg-surface px-4 font-label-sm text-label-sm text-on-surface-variant tracking-wider">
              or register with details
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Split Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Fatima"
                  className="w-full px-4 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Khan"
                  className="w-full px-4 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@domain.com"
                className="w-full px-4 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Password Field + Dynamic Strength Indicator */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                  Password
                </label>
                <span className="font-label-sm text-xs text-secondary tracking-wider">
                  Security: {strengthLabels[strengthScore]}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 pr-12 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Dynamic 3-stage bar in champagne gold shades */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div
                  className={`h-1 rounded-full transition-colors duration-300 ${
                    strengthScore >= 1 ? "bg-secondary" : "bg-surface-variant"
                  }`}
                />
                <div
                  className={`h-1 rounded-full transition-colors duration-300 ${
                    strengthScore >= 2 ? "bg-secondary" : "bg-surface-variant"
                  }`}
                />
                <div
                  className={`h-1 rounded-full transition-colors duration-300 ${
                    strengthScore >= 3 ? "bg-secondary" : "bg-surface-variant"
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 h-12 bg-surface-container-low text-on-surface rounded placeholder:text-on-surface-variant/40 font-body-md text-sm border border-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-container accent-primary"
              />
              <span className="font-body-sm text-xs text-on-surface-variant">
                I agree to the Sanctuary Terms &amp; Privileged Concierge Charter.
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200 shadow-md"
              >
                <span>{isLoading ? "Creating Member Profile..." : "Create Account"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Link to Sign In */}
          <div className="mt-8 text-center pt-6 border-t border-surface-variant/40">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:text-secondary underline underline-offset-4 ml-1 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
