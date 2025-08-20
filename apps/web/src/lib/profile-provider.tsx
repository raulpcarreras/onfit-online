"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "user" | "trainer" | "admin";
export type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: Role;
};

type ProfileState = { loading: boolean; profile: Profile | null; error?: string };

const ProfileCtx = createContext<ProfileState>({ loading: true, profile: null });

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileState>({ loading: true, profile: null });

  useEffect(() => {
    let mounted = true;
    let channel: any = null;
    let authSub: any = null;

    async function load() {
      if (!mounted) return;
      
      setState((s) => ({ ...s, loading: true, error: undefined }));

      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      console.log("🔍 ProfileProvider - Auth user:", user);
      console.log("🔍 ProfileProvider - Auth error:", authErr);
      
      if (authErr || !user) {
        if (mounted) setState({ loading: false, profile: null, error: authErr?.message });
        return;
      }

      // NOTA: estamos en esquema "onfit"
      console.log("🔍 ProfileProvider - Querying profiles for user_id:", user.id);
      const { data, error } = await supabase
        .schema("onfit")
        .from("profiles")
        .select("user_id, full_name, email, avatar_url, role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      console.log("🔍 ProfileProvider - Profiles query result:", { data, error });

      if (!mounted) return;

      if (error) {
        setState({ loading: false, profile: null, error: error.message });
        return;
      }

      const profile: Profile = {
        user_id: user.id,
        full_name: data?.full_name ?? user.user_metadata?.full_name ?? (user.email?.split("@")[0] ?? "Usuario"),
        email: data?.email ?? user.email ?? null,
        avatar_url: data?.avatar_url ?? (user.user_metadata?.avatar_url ?? null),
        role: (data?.role ?? "user") as Role,
      };

      console.log("🔍 ProfileProvider - Final profile object:", profile);
      setState({ loading: false, profile });
    }

    // Cargar perfil inicial
    load();

    // Suscripción a cambios de auth (solo una vez)
    authSub = supabase.auth.onAuthStateChange(() => {
      if (mounted) load();
    });

    // Cleanup
    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
      if (authSub?.subscription) authSub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  return useContext(ProfileCtx);
}
