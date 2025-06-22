'use client';
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseBrowser } from "@/lib/SupabaseClient";

export type AuthContextType = {
  isLoggedIn: boolean;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const sessionRes = await supabase.auth.getSession();
      const session = sessionRes.data.session;
      setIsLoggedIn(!!session);
      if (session) {
        const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single();
        setUserRole(user?.role || null);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    };
    checkSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 