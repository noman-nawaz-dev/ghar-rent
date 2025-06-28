'use client';
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseBrowser } from "@/lib/SupabaseClient";
import { getUserById } from "@/lib/data/users";
import { User } from "@/lib/data/users";

export type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  currentUser: User | null;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const sessionRes = await supabase.auth.getSession();
      const session = sessionRes.data.session;
      setIsLoggedIn(!!session);
      if (session) {
        const user = await getUserById(session.user.id)
        setCurrentUser(user || null);
      } else {
        setCurrentUser(null);
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
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 