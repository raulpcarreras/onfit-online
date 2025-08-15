"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState<"cliente" | "trainer" | "admin">("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login simulado → rol: ${role}, email: ${email}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900/60 backdrop-blur shadow-xl border border-neutral-800 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
            <span className="text-amber-400 font-semibold">ON</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">ONFIT ONLINE</h1>
            <p className="text-xs text-neutral-400">Accede con tu cuenta</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {(["cliente", "trainer", "admin"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setRole(opt)}
              className={`text-sm py-2 rounded-xl border transition ${
                role === opt
                  ? "bg-white text-black border-white"
                  : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {opt === "cliente" ? "Cliente" : opt === "trainer" ? "Trainer" : "Admin"}
            </button>
          ))}
        </div>

        {role === "trainer" && (
          <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg mb-3">
            El rol <b>Trainer</b> solo lo otorga <b>Admin</b>. Si aún no lo tienes,
            solicita el acceso.
          </div>
        )}

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
            className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-medium hover:brightness-95"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-xs flex items-center justify-between">
          <a href="#" className="text-neutral-400 hover:text-white">
            Olvidé mi contraseña
          </a>
          {role === "cliente" ? (
            <a href="#" className="text-neutral-400 hover:text-white">
              Crear cuenta nueva
            </a>
          ) : (
            <span className="text-neutral-500">Acceso restringido</span>
          )}
        </div>

        <p className="mt-5 text-[10px] text-neutral-500">
          Al continuar aceptas los Términos y la Política de Privacidad.
        </p>
      </div>
    </div>
  );
}
