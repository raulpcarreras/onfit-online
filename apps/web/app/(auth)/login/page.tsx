"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Dumbbell, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const { setTheme, theme, resolvedTheme } = useTheme() as any;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";

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
      setLoadingSignIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Error de login:", error);
      if (error.message.includes("Invalid login credentials")) {
        setLoginErrors({ email: "Credenciales incorrectas" });
      } else {
        setLoginErrors({ email: "Error al iniciar sesión" });
      }
    } finally {
      setLoadingSignIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-5 shadow-lg">
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3">
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
          <div className="mt-4 border-t border-border/50" />
          <p className="mt-2 text-xs text-muted-foreground">
            Accede con tus credenciales para continuar con tu progreso.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                loginErrors.email ? "border-red-500" : ""
              }`}
            />
            {loginErrors.email && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  loginErrors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingSignIn}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loadingSignIn && (
              <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {loadingSignIn ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-xs flex items-center justify-between">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
            Olvidé mi contraseña
          </Link>
          <Link 
            href="/register"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Crear cuenta nueva
          </Link>
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground">
          Al continuar aceptas los{" "}
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
