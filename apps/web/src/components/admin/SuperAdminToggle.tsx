"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { useUser } from "@/lib/user-provider";

interface SuperAdminToggleProps {
  userId: string;
  userEmail: string;
  isCurrentlySuperAdmin: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
}

export default function SuperAdminToggle({ 
  userId, 
  userEmail, 
  isCurrentlySuperAdmin, 
  onToggle 
}: SuperAdminToggleProps) {
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(isCurrentlySuperAdmin);
  const { user } = useUser();

  // Prevenir auto-desactivación
  const isCurrentUser = user?.email === userEmail;
  const canToggle = !isCurrentUser || !isCurrentlySuperAdmin;

  const handleToggle = async () => {
    // Protección adicional
    if (isCurrentUser && isCurrentlySuperAdmin) {
      alert("No puedes quitarte tus propios permisos de super admin");
      return;
    }

    setLoading(true);
    try {
      await onToggle(!isSuperAdmin);
      setIsSuperAdmin(!isSuperAdmin);
    } catch (error) {
      console.error("Error al cambiar super admin:", error);
      // Revertir estado local en caso de error
      setIsSuperAdmin(isCurrentlySuperAdmin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !canToggle}
      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
        canToggle 
          ? "hover:bg-secondary" 
          : "opacity-50 cursor-not-allowed"
      }`}
      aria-label={
        !canToggle 
          ? "No puedes quitarte tus propios permisos" 
          : isSuperAdmin 
            ? "Quitar super admin" 
            : "Otorgar super admin"
      }
      title={
        !canToggle 
          ? "No puedes quitarte tus propios permisos de super admin" 
          : `${isSuperAdmin ? "Quitar" : "Otorgar"} super admin a ${userEmail}`
      }
    >
      {loading ? (
        <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
      ) : (
        <Zap className={`size-5 ${isSuperAdmin ? "text-primary" : "text-muted-foreground"}`} />
      )}
    </button>
  );
}
