import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "client" | "trainer" | "admin" | null;

type UserContextValue = {
  user: import("@supabase/supabase-js").User | null;
  role: Role;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({ user: null, role: null, loading: true });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await supabase.auth.getUser();
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user ?? null;
      if (!mounted) return;
      setUser(currentUser);
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();
        if (!mounted) return;
        const normalized = (profile?.role as any) === "user" ? "client" : (profile?.role as any);
        setRole((normalized as Role) ?? null);
      } else {
        setRole(null);
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        setRole(null);
        return;
      }
      supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .maybeSingle()
        .then(({ data: profile }) => {
          const normalized = (profile?.role as any) === "user" ? "client" : (profile?.role as any);
          setRole((normalized as Role) ?? null);
        })
        .catch(() => setRole(null));
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


