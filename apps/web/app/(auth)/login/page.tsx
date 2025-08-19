"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSignIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role", { head: false })
        .eq("user_id", user?.id)
        .single();
      const role = profile?.role === "user" ? "client" : profile?.role;
      if (role === "admin") router.replace("/admin");
      else if (role === "trainer") router.replace("/trainer");
      else router.replace("/client");
    } catch (err: any) {
      alert(err?.message ?? "Error al iniciar sesión");
    } finally {
      setLoadingSignIn(false);
    }
  };

  const onSignUp = async () => {
    try {
      setLoadingSignUp(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // tras registro, creamos perfil y redirigimos al dashboard (usuario por defecto)
      const { data: u } = await supabase.auth.getUser();
      if (u.user?.id) {
        await supabase
          .from("profiles")
          .upsert(
            { user_id: u.user.id, email: u.user.email ?? null },
            { onConflict: "user_id", ignoreDuplicates: true },
          );
      }
      router.replace("/client");
    } catch (err: any) {
      alert(err?.message ?? "Error al crear cuenta");
    } finally {
      setLoadingSignUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900/60 backdrop-blur shadow-xl border border-neutral-800 p-5">
        <div className="flex flex-col items-center gap-1 mb-4 text-center">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
            <span className="text-amber-400 font-semibold">ON</span>
          </div>
          <h1 className="text-lg font-semibold">ONFIT ONLINE</h1>
          <p className="text-xs text-neutral-400">Accede con tu cuenta</p>
        </div>


        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-neutral-950/40 border border-neutral-800 px-3 py-2 outline-none focus:border-white"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">Contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-neutral-950/40 border border-neutral-800 px-3 py-2 outline-none focus:border-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="px-3 rounded-xl border border-neutral-800 text-xs hover:border-neutral-700"
              >
                {showPwd ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingSignIn}
            className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-medium hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loadingSignIn && (
              <span className="inline-block size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {loadingSignIn ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-xs flex items-center justify-between">
          <a href="#" className="text-neutral-400 hover:text-white">
            Olvidé mi contraseña
          </a>
          <button onClick={onSignUp} disabled={loadingSignUp} className="text-neutral-400 hover:text-white flex items-center gap-2">
            {loadingSignUp && (
              <span className="inline-block size-3 border border-neutral-400/40 border-t-neutral-200 rounded-full animate-spin" />
            )}
            {loadingSignUp ? "Creando..." : "Crear cuenta nueva"}
          </button>
        </div>

        <p className="mt-5 text-[10px] text-neutral-500">
          Al continuar aceptas los Términos y la Política de Privacidad.
        </p>
      </div>
    </div>
  );
}
