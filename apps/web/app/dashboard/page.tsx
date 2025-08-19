"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-provider";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { user, role, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const onLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/login";
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center text-neutral-400">
        {loading ? "Cargando..." : "Redirigiendo..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900/60 backdrop-blur shadow-xl border border-neutral-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-400">
            Has iniciado sesión como: <span className="font-medium text-white">{role ?? "usuario"}</span>
          </p>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg border border-neutral-800 text-xs hover:border-neutral-700"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
            <span className="text-amber-400 font-semibold">ON</span>
          </div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs text-neutral-400">Área de usuario</p>
        </div>
      </div>
    </div>
  );
}


