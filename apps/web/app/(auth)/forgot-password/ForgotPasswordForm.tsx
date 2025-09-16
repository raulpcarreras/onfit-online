"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../src/lib/supabase";
import { Dumbbell, Sun, Moon, Monitor, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { ThemeToggle } from "@repo/design/components/ThemeToggle";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { setTheme, theme, resolvedTheme } = useTheme() as any;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";

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
            <div className="mb-5">
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
            <Button
              onPress={() => setSuccess(false)}
              variant="outline"
              className="w-full"
            >
              Enviar otro email
            </Button>
            
            <Link href="/login">
              <Button
                variant="ghost"
                className="w-full"
              >
                Volver al login
              </Button>
            </Link>
          </div>
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
                         <ThemeToggle
               className="absolute top-0 right-0 p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0 z-10"
             />
            
            {/* Logo centrado en la card */}
            <div className="flex flex-col items-center text-center">
              {!mounted ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/favicon.png"
                  alt="ONFIT Logo"
                  className="h-12 w-auto object-contain"
                />
              ) : resolvedTheme === "dark" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src="/logos/logo-dark.png" 
                  alt="ONFIT Logo" 
                  className="h-12 w-auto object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src="/logos/logo-light.png" 
                  alt="ONFIT Logo" 
                  className="h-12 w-auto object-contain"
                />
              )}
            </div>
            
            <div className="mt-4 border-t border-border/50" />
            <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">
              Recuperar contraseña
            </h2>
            <p className="text-sm text-muted-foreground">
              Introduce tu email y te enviaremos un enlace para crear una nueva contraseña
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "Enviando..." : "Enviar email de recuperación"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
