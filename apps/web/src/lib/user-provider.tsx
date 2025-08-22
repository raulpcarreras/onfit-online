"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UserCtx = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isSuperAdmin: boolean; // Helper para verificar super admin
};

const Ctx = createContext<UserCtx>({ user: null, loading: true, error: null, isSuperAdmin: false });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!cancelled) {
          setUser(data?.user ?? null);
          setErr(error ? error.message : null);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "auth.getUser failed");
      } finally {
        if (!cancelled) setLoading(false); // 👉 nunca bloquees la UI
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const isSuperAdmin = !!(user?.app_metadata as any)?.is_super_admin;
  const value = useMemo(() => ({ user, loading, error: error, isSuperAdmin }), [user, loading, error, isSuperAdmin]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);


