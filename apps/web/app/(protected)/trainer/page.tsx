"use client";
import React, { useState } from "react";
import { Button } from "@repo/design/components/Button";
import { Card } from "@repo/design/components/Card";
import { useUser } from "@/lib/user-provider";
import { useProfile } from "@/lib/profile-provider";
import { FullScreenLoader } from "@repo/design/components/FullScreenLoader";

export default function TrainerPage() {
  const { user, loading } = useUser();
  const { profile } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  // Solo mostrar loading mientras se carga el rol
  if (loading) return <FullScreenLoader label="Cargando..." />;

  const onLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);

    // Logout server-first: el servidor limpia las cookies
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">TRAINER PANEL</h1>

        <Button
          onPress={onLogout}
          disabled={signingOut}
          variant="outline"
          className="w-full"
        >
          {signingOut ? "Saliendo..." : "Cerrar sesión"}
        </Button>
      </Card>
    </div>
  );
}
