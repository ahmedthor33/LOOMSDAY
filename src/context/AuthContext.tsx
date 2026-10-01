"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clean Patron Profile template
const DEMO_PROFILE: UserProfile = {
  id: "demo-user-1",
  email: "patron@loomsday.com",
  fullName: "Valued Patron",
  phone: "",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileFromSupabase = useCallback(async (userId: string, email: string, metaName?: string) => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setProfile({
          id: userId,
          email,
          fullName: data.full_name || metaName || email.split("@")[0],
          phone: data.phone || undefined,
          shippingAddress: data.shipping_street
            ? {
                street: data.shipping_street,
                city: data.shipping_city || "",
                state: data.shipping_state || "",
                zipCode: data.shipping_zip || "",
                country: data.shipping_country || "United States",
              }
            : undefined,
        });
      } else {
        setProfile((prev) => ({
          id: userId,
          email,
          fullName: metaName || prev?.fullName || email.split("@")[0],
          shippingAddress: prev?.shippingAddress,
        }));
      }
    } catch (err) {
      console.warn("Could not query profiles table:", err);
    }
  }, []);

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
        supabase.auth
          .getSession()
          .then(({ data }) => {
            const session = data?.session;
            if (session?.user) {
              const u = { id: session.user.id, email: session.user.email || "" };
              setUser(u);
              fetchProfileFromSupabase(
                session.user.id,
                session.user.email || "",
                session.user.user_metadata?.full_name
              );
            }
          })
          .catch((err: unknown) => {
            console.warn("Error getting Supabase session:", err);
          })
          .finally(() => {
            setIsLoading(false);
          });

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event: string, session: { user?: { id: string; email?: string; user_metadata?: { full_name?: string } } } | null) => {
            if (session?.user) {
              const u = { id: session.user.id, email: session.user.email || "" };
              setUser(u);
              await fetchProfileFromSupabase(
                session.user.id,
                session.user.email || "",
                session.user.user_metadata?.full_name
              );
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
  }, [fetchProfileFromSupabase]);

  const signInWithEmail = async (email: string, password = ""): Promise<{ error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) return { error: error.message };
        if (data?.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          fetchProfileFromSupabase(
            data.user.id,
            data.user.email || email,
            data.user.user_metadata?.full_name
          );
        }
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        setIsLoading(false);
        if (error) return { error: error.message };
        if (data?.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          setProfile({
            id: data.user.id,
            email: data.user.email || email,
            fullName: name,
            shippingAddress: DEMO_PROFILE.shippingAddress,
          });
        }
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

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    try {
      const merged = { ...profile, ...updates } as UserProfile;
      setProfile(merged);
      localStorage.setItem("loomsday-user", JSON.stringify(merged));

      if (isSupabaseConfigured && user) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          const payload: Record<string, unknown> = {
            id: user.id,
            updated_at: new Date().toISOString(),
          };
          if (merged.fullName) payload.full_name = merged.fullName;
          if (merged.phone) payload.phone = merged.phone;
          if (merged.shippingAddress) {
            payload.shipping_street = merged.shippingAddress.street;
            payload.shipping_city = merged.shippingAddress.city;
            payload.shipping_state = merged.shippingAddress.state;
            payload.shipping_zip = merged.shippingAddress.zipCode;
            payload.shipping_country = merged.shippingAddress.country;
          }

          const { error } = await supabase.from("profiles").upsert(payload);
          if (error) {
            console.warn("Note: Profile upsert returned:", error.message);
            // Non-fatal if schema hasn't been run yet
          }
        }
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Failed to update profile" };
    }
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
        updateProfile,
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
