"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserContextValue = {
  user: import("@supabase/supabase-js").User | null;
  role: "user" | "trainer" | "admin" | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({ user: null, role: null, loading: true });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [role, setRole] = useState<UserContextValue["role"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // Forzar emisión de sesión inicial para SSR/CSR híbrido
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user ?? null;
      if (!mounted) return;
      setUser(currentUser);
      if (currentUser) {
        const selectRole = async () =>
          supabase
            .from("profiles")
            .select("role", { head: false })
            .eq("id", currentUser.id)
            .single();

        let { data: profile } = await selectRole();
        if (!profile) {
          try {
            await supabase
              .from("profiles")
              .upsert({ id: currentUser.id, email: currentUser.email }, { onConflict: "id" });
          } catch (_) {}
          const { data: p2 } = await selectRole();
          profile = p2 ?? null;
        }
        if (!mounted) return;
        setRole(profile?.role ?? null);
      } else {
        setRole(null);
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const { data: userData } = await supabase.auth.getUser();
      const u = userData.user ?? null;
      setUser(u);
      if (u) {
        const selectRole = async () =>
          supabase
            .from("profiles")
            .select("role", { head: false })
            .eq("id", u.id)
            .single();

        let { data: profile } = await selectRole();
        if (!profile) {
          try {
            await supabase
              .from("profiles")
              .upsert({ id: u.id, email: u.email }, { onConflict: "id" });
          } catch (_) {}
          const { data: p2 } = await selectRole();
          profile = p2 ?? null;
        }
        setRole(profile?.role ?? null);
      } else {
        setRole(null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ user, role, loading }), [user, role, loading]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);


