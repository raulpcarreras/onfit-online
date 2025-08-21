"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

async function persistServerSession(access_token: string, refresh_token: string) {
  const res = await fetch("/api/auth/set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token, refresh_token }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j?.error || "No se pudo establecer la sesión en servidor");
  }
}

function getRedirectTarget() {
  const url = new URL(window.location.href);
  return url.searchParams.get("redirect") || "/";
}

export function useLoginActions() {
  const [loading, setLoading] = useState(false);

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        // 1) Login
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // 2) Obtener tokens (de la respuesta o, si falla, del getSession)
        let access_token = data.session?.access_token;
        let refresh_token = (data.session as any)?.refresh_token;

        if (!access_token || !refresh_token) {
          const s = await supabase.auth.getSession();
          access_token = s.data.session?.access_token || access_token;
          refresh_token = (s.data.session as any)?.refresh_token || refresh_token;
        }
        if (!access_token || !refresh_token) {
          throw new Error("Faltan tokens de sesión tras el login");
        }

        // 3) Persistir cookies en servidor
        await persistServerSession(access_token, refresh_token);

        // 4) Redirigir (evita estados inconsistentes del router)
        window.location.replace(getRedirectTarget());
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loginWithOAuth = useCallback(
    async (provider: "google" | "github" | "facebook" | "apple") => {
      setLoading(true);
      try {
        // Para OAuth con popup/redirect:
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/login`, // o una callback propia
          },
        });
        if (error) throw error;

        // Si usas "redirect" tradicional, no necesitas lo de abajo: el flujo vuelve por la callback.
        // Si usas "popup", tras volver, repite el paso de obtener sesión + POST /api/auth/set:
        // const s = await supabase.auth.getSession();
        // const at = s.data.session?.access_token;
        // const rt = (s.data.session as any)?.refresh_token;
        // if (at && rt) await persistServerSession(at, rt);
        // window.location.replace(getRedirectTarget());
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, loginWithPassword, loginWithOAuth };
}
