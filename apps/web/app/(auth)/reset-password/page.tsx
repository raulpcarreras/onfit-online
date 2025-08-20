"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Verificar si hay una sesión válida de recuperación
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.aud === 'authenticated') {
        setSession(session);
      } else {
        // Si no hay sesión, redirigir al login
        router.push('/login?error=invalid-reset-link');
      }
    };

    checkSession();
  }, [router]);

  const validateForm = () => {
    if (!password) {
      setError("La contraseña es requerida");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError("");
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      
      // Cerrar sesión después de cambiar la contraseña
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/login?message=password-updated');
      }, 3000);
      
    } catch (error: any) {
      console.error("Error al actualizar contraseña:", error);
      
      if (error.message.includes("Password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres");
      } else if (error.message.includes("Invalid password")) {
        setError("La contraseña no cumple con los requisitos de seguridad");
      } else {
        setError("Error al actualizar la contraseña. Inténtalo de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    if (error) setError("");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-block size-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="size-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-foreground">ONFIT</span>
                  <span className="text-primary">ONLINE</span>
                </h1>
                <p className="text-xs text-muted-foreground">Tu app de fitness</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="size-16 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              ¡Contraseña actualizada!
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tu contraseña ha sido cambiada exitosamente
            </p>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-600">
                <strong>Redirigiendo al login...</strong>
                <br />
                Serás redirigido automáticamente en unos segundos
              </p>
            </div>
          </div>

          {/* Manual redirect */}
          <Link
            href="/login"
            className="block w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
          >
            Ir al login ahora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="size-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-foreground">ONFIT</span>
                <span className="text-primary">ONLINE</span>
              </h1>
              <p className="text-xs text-muted-foreground">Tu app de fitness</p>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-foreground text-center mb-2">
            Crear nueva contraseña
          </h2>
          
          <p className="text-sm text-muted-foreground text-center">
            Introduce tu nueva contraseña para completar la recuperación
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva Contraseña */}
          <div>
            <label className="text-sm text-muted-foreground">Nueva contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange("password", e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="text-sm text-muted-foreground">Confirmar nueva contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Botón de actualización */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loading && (
              <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Recordaste tu contraseña?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          Esta página solo es accesible desde el enlace de recuperación
        </p>
      </div>
    </div>
  );
}
