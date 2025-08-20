"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, Sun, Moon, Monitor, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { setTheme, theme, resolvedTheme } = useTheme() as any;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  // Forzar tema por defecto a "system" siempre
  useEffect(() => {
    if (mounted) {
      // Si no hay tema guardado o es diferente de "system", establecer "system"
      if (!theme || theme !== "system") {
        setTheme("system");
      }
    }
  }, [mounted, theme, setTheme]);
  
  const themeSetting = mounted ? (theme || "system") : "system";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Por favor, introduce tu email");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor, introduce un email válido");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) throw resetError;
      
      setSuccess(true);
      
    } catch (error: any) {
      console.error("Error al enviar email de recuperación:", error);
      
      if (error.message.includes("User not found")) {
        setError("No existe una cuenta con este email");
      } else if (error.message.includes("Too many requests")) {
        setError("Demasiados intentos. Espera un momento antes de volver a intentar");
      } else {
        setError("Error al enviar el email de recuperación. Inténtalo de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
  };

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
              Email enviado correctamente
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>
            </p>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>¿Qué hacer ahora?</strong>
                <br />
                1. Revisa tu bandeja de entrada
                <br />
                2. Haz clic en el enlace de recuperación
                <br />
                3. Crea una nueva contraseña
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
            >
              Enviar otro email
            </button>
            <Link
              href="/login"
              className="block w-full py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              Volver al login
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Si no recibes el email, revisa tu carpeta de spam
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-foreground">ONFIT</span>
                  <span className="text-primary">ONLINE</span>
                </h1>
                <p className="text-xs text-muted-foreground">Tu app de fitness</p>
              </div>
            </div>
            <button
              onClick={() => setTheme(themeSetting === "light" ? "dark" : 
                                     themeSetting === "dark" ? "system" : "light")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
            >
              {themeSetting === "light" ? <Sun className="size-5" /> : 
               themeSetting === "dark" ? <Moon className="size-5" /> : <Monitor className="size-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href="/login"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="size-4 text-muted-foreground" />
            </Link>
            <h2 className="text-lg font-semibold text-foreground">Recuperar contraseña</h2>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loading && (
              <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Enviando..." : "Enviar email de recuperación"}
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
          El enlace de recuperación expirará en 1 hora por seguridad
        </p>
      </div>
    </div>
  );
}
