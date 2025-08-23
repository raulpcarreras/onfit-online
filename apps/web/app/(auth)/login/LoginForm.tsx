"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useLoginActions } from "@/lib/use-login-actions";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { ThemeToggle } from "@repo/design/components/ThemeToggle";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { loading, loginWithPassword } = useLoginActions();
  
  useEffect(() => setMounted(true), []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación simple de login
    const errs: typeof loginErrors = {};
    if (!email) errs.email = "Campo requerido";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email no válido";
    if (!password) errs.password = "Campo requerido";
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    try {
      await loginWithPassword(email, password);
    } catch (error: any) {
      // Solo loggear errores que no sean credenciales inválidas
      if (!error.message.includes("Invalid login credentials")) {
        console.error("Error de login:", error);
      }
      
      if (error.message.includes("Invalid login credentials")) {
        setLoginErrors({ email: "Credenciales incorrectas" });
      } else {
        setLoginErrors({ email: "Error al iniciar sesión" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-5 shadow-lg">
        <div className="mb-5 relative">
          {/* Botón de tema posicionado absolutamente en la esquina superior derecha */}
          <ThemeToggle
            className="absolute top-0 right-0 p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0 z-10"
          />
          
                                {/* Logo centrado en la card (sin interferencia del botón) */}
          <div className="flex flex-col items-center text-center">
            {/* Logo adaptativo según tema */}
            {!mounted ? (
              <img
                src="/favicon.png"
                alt="ONFIT Logo"
                className="h-12 w-auto object-contain"
              />
            ) : resolvedTheme === "dark" ? (
              <img 
                src="/logos/logo-dark.png" 
                alt="ONFIT Logo" 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <img 
                src="/logos/logo-light.png" 
                alt="ONFIT Logo" 
                className="h-12 w-auto object-contain"
              />
            )}
          </div>
          <div className="mt-4 border-t border-border/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Accede con tus credenciales para continuar con tu progreso.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="text-xs text-muted-foreground">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${
                loginErrors.email ? "border-red-500" : ""
              }`}
            />
            {loginErrors.email && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-xs text-muted-foreground">Contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <Input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`flex-1 ${
                  loginErrors.password ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onPress={() => setShowPwd(!showPwd)}
              >
                {showPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </Button>
            </div>
            {loginErrors.password && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loading && (
              <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
          
          <div className="mt-2">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          Al iniciar sesión aceptas los{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Términos
          </Link>{" "}
          y la{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidad
          </Link>.
        </p>
      </div>
    </div>
  );
}
