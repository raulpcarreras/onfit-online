import { useState } from "react";

interface UseSuperAdminReturn {
  toggleSuperAdmin: (email: string, enable: boolean) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useSuperAdmin(): UseSuperAdminReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSuperAdmin = async (email: string, enable: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // En producción, esto debería usar una API route interna
      // Por ahora, simulamos la llamada al endpoint
      const response = await fetch("/api/admin/grant-super", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // En producción, esto se manejaría internamente en el servidor
          // "Authorization": `Bearer ${process.env.ADMIN_INTERNAL_SECRET}`
        },
        body: JSON.stringify({ email, enable }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.ok) {
        return true;
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err: any) {
      setError(err.message || "Error al cambiar super admin");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleSuperAdmin,
    loading,
    error,
  };
}
