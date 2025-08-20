"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-provider";
import { supabase } from "@/lib/supabase";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function DashboardPage() {
  const { user, role, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Evitar FOUC: no mostrar nada mientras se confirma sesión
  if (loading || !user) return <FullScreenLoader label={loading ? "Cargando..." : "Redirigiendo..."} />;

  const onLogout = async () => {
    try { await supabase.auth.signOut({ scope: "global" as any }); } catch {}
    try {
      Object.keys(window.localStorage).forEach((k) => {
        if (k.startsWith("sb-") || k.toLowerCase().includes("supabase")) {
          window.localStorage.removeItem(k);
        }
      });
    } catch {}
    window.location.replace("/");
  };

  

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            Has iniciado sesión como: <span className="font-medium text-white">{role ?? "usuario"}</span>
          </p>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg border border-border text-xs hover:border-neutral-300 dark:hover:border-neutral-600"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
            <span className="text-amber-400 font-semibold">ON</span>
          </div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Área de usuario</p>
        </div>
      </div>
    </div>
  );
}


