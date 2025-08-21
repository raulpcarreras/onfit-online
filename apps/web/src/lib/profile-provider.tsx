"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "user" | "trainer" | "admin";
export type Profile = {
  id: string;
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

      const { data: { session }, error: authErr } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      console.log("🔍 ProfileProvider - Auth user:", user);
      console.log("🔍 ProfileProvider - Auth error:", authErr);
      
      if (authErr) {
        console.warn("⚠️ ProfileProvider - Error al obtener sesión:", authErr);
        // No es crítico, continuar sin sesión
      }
      
      if (!user) {
        if (mounted) setState({ loading: false, profile: null, error: undefined });
        return;
      }

      // NOTA: estamos en esquema "public"
      console.log("🔍 ProfileProvider - Querying profiles for id:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, role")
        .eq("id", user.id)
        .maybeSingle();
      
      console.log("🔍 ProfileProvider - Profiles query result:", { data, error });

      if (!mounted) return;

      if (error) {
        setState({ loading: false, profile: null, error: error.message });
        return;
      }

      const profile: Profile = {
        id: user.id,
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
    authSub = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 ProfileProvider - Cambio de estado de auth: ${event}`);
      
      // Para eventos de logout, limpiar inmediatamente
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        console.log(`👤 ProfileProvider - Usuario desconectado (evento: ${event})`);
        if (mounted) {
          setState({ loading: false, profile: null, error: undefined });
        }
        return;
      }
      
      // Solo recargar si hay sesión activa
      if (session?.user && mounted) {
        load();
      }
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
