// components/auth-provider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string } | null;
type AuthContextValue = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "erp_user_token"; // simple dev token

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // on mount read localStorage for a token (very basic)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    // === Replace this section with a real API call in production ===
    // Fake authentication: accept any email/password, create a fake user and 'token'
    await new Promise((r) => setTimeout(r, 600)); // small delay to simulate network
    const fakeUser = { id: "u1", name: email.split("@")[0] ?? "User", email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
