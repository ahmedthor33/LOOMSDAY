"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<{ error?: string }>;
  signUpWithEmail: (name: string, email: string, password?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Demo User from Stitch design ("Eleanor Vane")
const DEMO_PROFILE: UserProfile = {
  id: "demo-user-1",
  email: "eleanor@atelier-nocturne.com",
  fullName: "Eleanor Vane",
  phone: "+1 (555) 482-1928",
  shippingAddress: {
    street: "742 Evergreen Terrace, Suite 4B",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    country: "United States",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent guest/demo session
    const savedUser = localStorage.getItem("loomsday-user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ id: parsed.id, email: parsed.email });
        setProfile(parsed);
      } catch {
        // ignore parse error
      }
    }

    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || "" });
            setProfile({
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
            });
          }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session?.user) {
              const u = { id: session.user.id, email: session.user.email || "" };
              setUser(u);
              setProfile({
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name,
              });
            } else {
              if (!localStorage.getItem("loomsday-user")) {
                setUser(null);
                setProfile(null);
              }
            }
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    }

    setIsLoading(false);
  }, []);

  const signInWithEmail = async (email: string, password = ""): Promise<{ error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) return { error: error.message };
        return {};
      }
    }

    // Local / Offline fallback
    const simulatedProfile: UserProfile = {
      id: "usr-" + Date.now(),
      email,
      fullName: email.split("@")[0].replace(".", " "),
      shippingAddress: DEMO_PROFILE.shippingAddress,
    };
    setUser({ id: simulatedProfile.id, email });
    setProfile(simulatedProfile);
    localStorage.setItem("loomsday-user", JSON.stringify(simulatedProfile));
    setIsLoading(false);
    return {};
  };

  const signUpWithEmail = async (name: string, email: string, password = ""): Promise<{ error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        setIsLoading(false);
        if (error) return { error: error.message };
        return {};
      }
    }

    // Local / Offline fallback
    const simulatedProfile: UserProfile = {
      id: "usr-" + Date.now(),
      email,
      fullName: name,
      shippingAddress: DEMO_PROFILE.shippingAddress,
    };
    setUser({ id: simulatedProfile.id, email });
    setProfile(simulatedProfile);
    localStorage.setItem("loomsday-user", JSON.stringify(simulatedProfile));
    setIsLoading(false);
    return {};
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/api/auth/callback` },
        });
        return;
      }
    }
    // Demo fallback for instant Google sign-in
    demoLogin();
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem("loomsday-user");
  };

  const demoLogin = () => {
    setUser({ id: DEMO_PROFILE.id, email: DEMO_PROFILE.email });
    setProfile(DEMO_PROFILE);
    localStorage.setItem("loomsday-user", JSON.stringify(DEMO_PROFILE));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
