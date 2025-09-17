"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { ThemeToggle } from "@repo/design/components/ThemeToggle";

function ResetPasswordContent() {
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Verificar si hay una sesión válida de recuperación
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.aud === "authenticated") {
        setSession({ user });
      } else {
        // Si no hay sesión, redirigir al login
        router.push("/login?error=invalid-reset-link");
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
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Cerrar sesión después de cambiar la contraseña
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/login?message=password-updated");
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
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <AlertCircle className="size-16 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Enlace inválido
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              El enlace de recuperación no es válido o ha expirado
            </p>
          </div>

          <Link href="/forgot-password">
            <Button className="w-full">Solicitar nuevo enlace</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="size-16 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Contraseña actualizada
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tu contraseña ha sido actualizada correctamente
            </p>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                Serás redirigido al login en unos segundos...
              </p>
            </div>
          </div>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Ir al login
            </Button>
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
          <div className="mb-5 relative">
            {/* Botón de tema posicionado absolutamente en la esquina superior derecha */}
            <ThemeToggle className="absolute top-0 right-0 p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0 z-10" />
            <div className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon.png"
                alt="ONFIT Logo"
                className="h-12 w-auto object-contain mb-4"
              />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Crear nueva contraseña
              </h2>
              <p className="text-sm text-muted-foreground">
                Introduce tu nueva contraseña
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange("password", e.target.value)}
                className="w-full pr-10"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => setShowPwd(!showPwd)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPwd ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="w-full pr-10"
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
