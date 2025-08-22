"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/design/components/Button";
import { useUser } from "@/lib/user-provider";
import { useProfile } from "@/lib/profile-provider";
import { supabase } from "@/lib/supabase";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function TrainerPage() {
  const { user, loading } = useUser();
  const { profile } = useProfile();
  const router = useRouter();

  // Solo mostrar loading mientras se carga el rol
  if (loading) return <FullScreenLoader label="Cargando..." />;

  const [signingOut, setSigningOut] = useState(false);
  const onLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    
    // Logout server-first: el servidor limpia las cookies
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            Has iniciado sesión como: <span className="font-medium text-white">{profile?.role ?? "usuario"}</span>
          </p>
          <Button onClick={onLogout} type="button" disabled={signingOut}
            variant="outline" 
            size="sm"
            className="text-xs">
            {signingOut ? "Saliendo..." : "Cerrar sesión"}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
            <span className="text-amber-400 font-semibold">ON</span>
          </div>
          <h1 className="text-lg font-semibold">Panel de trainer</h1>
          <p className="text-xs text-muted-foreground">Contenido para trainers</p>
        </div>
      </div>
    </div>
  );
}
