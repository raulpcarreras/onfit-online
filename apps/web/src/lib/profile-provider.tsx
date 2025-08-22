"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./user-provider";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "user" | "trainer" | "admin";
  is_super_admin?: boolean; // Nuevo campo para super admin
};

type ProfileCtx = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
};

const Ctx = createContext<ProfileCtx>({ profile: null, loading: true, error: null });

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 👉 No bloquees si no hay usuario
      if (!user) {
        setProfile(null);
        setLoading(false);
        setErr(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url, role")
          .eq("id", user.id) // 👈 usa **id** (clave primaria)
          .maybeSingle();

        // Añadir flag de super admin desde JWT
        let profileData = data as Profile | null;
        if (profileData && user.app_metadata) {
          profileData = {
            ...profileData,
            is_super_admin: !!(user.app_metadata as any)?.is_super_admin
          };
        }

        if (!cancelled) {
          setProfile(profileData ?? null);
          setErr(error ? error.message : null);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "profiles query failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const value = useMemo(
    () => ({ profile, loading, error }),
    [profile, loading, error]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProfile = () => useContext(Ctx);
