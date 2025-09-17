ONFIT — Dashboard de Usuario (Cliente) · Especificación MVP

Objetivo: definir estructura, funcionalidades y prioridades para diseñar y construir el Dashboard de Usuario (web responsive), listo para conectar con datos reales (Supabase) más adelante.

⸻

1. Estructura UX (layout base)

Topbar (común)
• Buscador / Command palette (⌘K) para acciones rápidas.
• Selector de tema (claro / oscuro / sistema).
• Notificaciones (campana con badge).
• Avatar menú: Perfil, Ajustes, Suscripción/Pagos, Ayuda, Cerrar sesión.

Sidebar (usuario) 1. Inicio (Hoy) 2. Entrenamiento
• Programas
• Sesiones (hoy / próximas)
• Historial 3. Nutrición
• Plan del día
• Registro
• Historial 4. Calendario 5. Progreso
• Peso y medidas
• PRs fuerza
• Fotos comparativas 6. Hábitos 7. Mensajes (entrenador/soporte) 8. Pagos (suscripción, facturas) 9. Ajustes (perfil, notificaciones, privacidad, integraciones) 10. Ayuda (FAQ, soporte)

⸻

2. Pantalla “Inicio (Hoy)” — widgets clave
   • Entrenamiento de hoy
   Resumen (ejercicios, series, duración), CTA Iniciar/Continuar, progreso %, temporizador si activo.
   • Macros del día
   Objetivo vs consumido (kcal, P/C/G), barras de progreso.
   • Próximo evento
   Próxima sesión/consulta del calendario con CTA.
   • Racha de hábitos
   Streak + checklist rápido.
   • Peso rápido
   Input del día + acceso a métricas.
   • Mensajes recientes
   Último hilo/actividad con el entrenador.
   • Avisos
   Cambios de plan, renovaciones, incidencias.

Empty states con CTA claros (ej.: “Empieza tu primer entrenamiento”).

⸻

3. Entrenamiento

Programas activos
• Nombre, fase, semanas, adherencia.

Runner de sesión
• Lista de ejercicios (vídeo/técnica/sustituciones).
• Series con reps, carga, RPE/RIR, rest timer, notas por serie.
• Marcar completado, auto-guardado, guardar parciales.

Historial
• Filtros por fecha/ejercicio, búsqueda de PRs, export.

⸻

4. Nutrición

Plan del día
• Comidas predefinidas + alternativas.

Registro
• Añadir alimento (buscador), porciones, macros.
(Futuro móvil: escáner de código de barras).

Objetivos
• Kcal y macros diarios; alertas de sobre/infra cumplimiento.

Historial
• Vista semanal/mensual y gráficos.

⸻

5. Calendario
   • Sesiones, hábitos, eventos (revisiones, entregas).
   • Vistas mes/semana/día; click → detalle con CTA (iniciar sesión, registrar comida, marcar hábito).

⸻

6. Progreso
   • Peso (gráfico con media móvil).
   • Medidas (cintura, cadera, pecho…).
   • PRs por ejercicio (1RM estimada/real).
   • Fotos (comparativas; control de privacidad).
   • Export CSV/PDF.

⸻

7. Hábitos
   • Lista diaria con check (agua, pasos, sueño…).
   • Streaks, metas semanales, recordatorios.

⸻

8. Mensajes
   • Hilos, texto + adjuntos.
   (Futuro: audio, plantillas rápidas del entrenador).

⸻

9. Pagos (Stripe)
   • Estado de suscripción (plan, renovación, pausar/cancelar).
   • Método de pago.
   • Facturas descargables.

⸻

10. Ajustes
    • Perfil: avatar, nombre, fecha nacimiento, sexo, altura.
    • Objetivos: perder/ganar/rendimiento, kcal objetivo.
    • Notificaciones: email/push por tipo.
    • Privacidad: visibilidad fotos/progreso.
    • Integraciones (futuro): Apple Health / Google Fit.
    • Seguridad: cambiar contraseña, sesiones activas.

⸻

11. Prioridades MVP (orden de construcción)
    1.  Layout base (Topbar + Sidebar) + Inicio (Hoy) con 3–4 widgets clave.
    2.  Runner de Entrenamiento (crítico).
    3.  Progreso: Peso (input + gráfico).
    4.  Mensajes básicos.
    5.  Perfil + Ajustes básicos.
    6.  Pagos (solo lectura: estado + facturas si ya hay Stripe).

(Nutrición con registro simple y objetivos: fase 2 si no hay integración aún).

⸻

12. Componentes UI (shadcn + recharts)
    • Cards (KPIs, listas), Tabs, Tables (paginated).
    • Modals/Sheets (móvil) para runner y registros rápidos.
    • Dropdowns/Selects, Switches, Sliders (RPE).
    • Charts: líneas (peso), barras (macros), radar (fuerza, opcional).
    • Toasts, Skeletons, Empty states.

⸻

13. Mapeo rápido a datos (Supabase)
    • profiles (user_id, avatar_url, height_cm, birthdate, sex)
    • training_programs, training_sessions, training_sets, exercise_library
    • workout_logs (por sesión/serie)
    • nutrition_targets (kcal, p/c/g), nutrition_logs
    • body_metrics (weight_kg, measurements)
    • habits, habit_logs
    • messages, threads
    • subscriptions, invoices (mirror via Stripe webhooks)
    • notifications

⸻

14. Reglas de diseño
    • Tokens canónicos (background, foreground, card, border, primary, accent, secondary, etc.).
    • En “Inicio”: 3–4 widgets antes del scroll.
    • Siempre empty state y skeleton.
    • Acciones primarias arriba a la derecha o en la tarjeta.
    • Mobile: sidebar como drawer; runner a pantalla completa.

⸻

15. Siguientes pasos
    • Wireframe funcional del Inicio (Hoy) con 4–5 widgets clave.
    • Implementación responsive usando tokens canónicos y componentes shadcn.
    • Preparar stubs de datos y hooks para integrar Supabase.

16. EJEMPLO:

perfecto. te dejo un dashboard de usuario 100% funcional (UI fake-data) listo para pegar y ver en local. No depende de shadcn (evitamos el problema de variables), solo Tailwind y next-themes.

Crea este archivo:

apps/web/app/(user)/dashboard/page.tsx

"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
Menu, X, Search, Bell, User, Dumbbell, Calendar, MessageSquare, CheckCircle2,
} from "lucide-react";

type KPI = { label: string; value: string; diff?: string; icon: any };

const kpis: KPI[] = [
{ label: "Sesiones completadas (30d)", value: "14", diff: "+2", icon: Dumbbell },
{ label: "Racha de hábitos", value: "7 días", diff: "+1", icon: CheckCircle2 },
{ label: "Calorías hoy", value: "1.820 / 2.200", icon: User },
];

const macros = [
{ key: "Proteína", current: 120, target: 160 },
{ key: "Carbohidratos", current: 230, target: 280 },
{ key: "Grasas", current: 50, target: 70 },
];

const mensajes = [
{ from: "Coach Laura", text: "Mañana ajustamos tirón y core.", time: "hoy 10:20" },
{ from: "Soporte ONFIT", text: "Factura de agosto disponible.", time: "ayer 19:40" },
];

const habitos = [
{ key: "Beber 2L agua", done: true },
{ key: "Dormir ≥7h", done: false },
{ key: "10k pasos", done: false },
];

export default function UserDashboard() {
const { theme, setTheme } = useTheme();
const [mobileOpen, setMobileOpen] = useState(false);

const border = "border border-neutral-200/50 dark:border-neutral-800/70";
const card = `rounded-xl bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur ${border}`;
const topbarBg = "bg-white/80 dark:bg-neutral-950/80";
const pageBg = "bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100";
const accent = "text-amber-500";
const barBg = "bg-neutral-200 dark:bg-neutral-800";
const barFill = "bg-amber-500";

const session = {
name: "Full Body – Semana 3 / Día 2",
duration: "45–55 min",
progress: 35,
};

const kcal = useMemo(
() => {
const [cur, tar] = [1820, 2200];
return Math.round((cur / tar) \* 100);
},
[]
);

return (

<div className={`min-h-screen ${pageBg}`}>
{/_ SIDEBAR DESKTOP _/}
<aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-neutral-200/60 dark:border-neutral-800/70 bg-white/90 dark:bg-neutral-950/90 backdrop-blur z-30">
<Sidebar />
</aside>

      {/* DRAWER MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <Brand />
              <button
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="size-5 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
            <Nav />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="lg:ml-64">
        {/* TOP BAR */}
        <div className={`sticky top-0 z-20 border-b border-neutral-200/60 dark:border-neutral-800/70 ${topbarBg} backdrop-blur`}>
          <div className="flex items-center gap-3 px-4 md:px-6 py-3">
            {/* Hamburger móvil */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Abrir menú"
            >
              <Menu className="size-5 text-neutral-700 dark:text-neutral-300" />
            </button>

            {/* Buscador */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-100/90 dark:bg-neutral-900/70 outline-none text-sm placeholder:text-neutral-500 border border-neutral-200/60 dark:border-neutral-800/60"
                placeholder="Buscar entrenos, mensajes, pagos…"
              />
            </div>

            {/* selector de tema */}
            <select
              aria-label="Tema"
              value={theme ?? "system"}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-neutral-100/90 dark:bg-neutral-900/70 text-sm border border-neutral-200/60 dark:border-neutral-800/60 rounded-lg px-2 py-1"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>

            <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900" aria-label="Notificaciones">
              <Bell className="size-5 text-neutral-700 dark:text-neutral-300" />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2">
              <div className="text-right leading-tight">
                <div className="text-sm font-medium">Raúl Carreras</div>
                <div className="text-[11px] text-neutral-500">usuario@onfit.online</div>
              </div>
              <div className="size-8 rounded-full grid place-items-center bg-amber-500/15">
                <User className={`size-4 ${accent}`} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-4 md:px-6 py-6 space-y-6">
          {/* KPIs */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className={`${card} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{k.label}</div>
                  <k.icon className={`size-4 ${accent}`} />
                </div>
                <div className="mt-2 text-2xl font-semibold">{k.value}</div>
                {k.diff && <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{k.diff}</div>}
              </div>
            ))}
          </section>

          {/* Entrenamiento + Macros */}
          <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            {/* Entrenamiento de hoy */}
            <div className={`xl:col-span-2 ${card} p-4`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">Entrenamiento de hoy</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{session.duration}</div>
              </div>
              <div className="mt-1 text-neutral-500 dark:text-neutral-400">{session.name}</div>

              {/* progreso */}
              <div className="mt-4">
                <div className={`h-2 rounded-full ${barBg}`}>
                  <div className={`h-2 rounded-full ${barFill}`} style={{ width: `${session.progress}%` }} />
                </div>
                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{session.progress}% completado</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition">Iniciar</button>
                <button className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">
                  Ver detalles
                </button>
              </div>
            </div>

            {/* Macros del día */}
            <div className={`${card} p-4`}>
              <div className="font-medium">Macros del día</div>
              <div className="mt-3 space-y-3">
                {macros.map((m) => {
                  const pct = Math.min(100, Math.round((m.current / m.target) * 100));
                  return (
                    <div key={m.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-600 dark:text-neutral-300">{m.key}</span>
                        <span className="text-neutral-500 dark:text-neutral-400">{m.current}/{m.target}g</span>
                      </div>
                      <div className={`h-2 rounded-full ${barBg}`}>
                        <div className={`h-2 rounded-full ${barFill}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Kcal totales: {kcal}% del objetivo</div>
              </div>
            </div>
          </section>

          {/* Agenda + Mensajes */}
          <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            {/* Próximo evento */}
            <div className={`${card} p-4`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">Próximo evento</div>
                <Calendar className={`size-4 ${accent}`} />
              </div>
              <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Mañana 18:00 — Sesión con Laura</div>
              <button className="mt-3 w-full py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition">
                Abrir calendario
              </button>
            </div>

            {/* Mensajes recientes */}
            <div className={`xl:col-span-2 ${card} p-4`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">Mensajes recientes</div>
                <MessageSquare className={`size-4 ${accent}`} />
              </div>
              <div className="mt-3 divide-y divide-neutral-200/60 dark:divide-neutral-800/70">
                {mensajes.map((m, i) => (
                  <div key={i} className="py-3 flex items-start gap-3">
                    <div className="size-8 rounded-full grid place-items-center bg-amber-500/15 shrink-0">
                      <User className={`size-4 ${accent}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{m.from}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">{m.text}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">
                Abrir mensajes
              </button>
            </div>
          </section>

          {/* Peso rápido + Hábitos */}
          <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            {/* Peso rápido */}
            <div className={`${card} p-4`}>
              <div className="font-medium">Peso rápido</div>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="kg"
                  className="flex-1 px-3 py-2 rounded-lg bg-neutral-100/90 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800/60 outline-none"
                />
                <button className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition">
                  Guardar
                </button>
              </div>
            </div>

            {/* Hábitos (col-span-2) */}
            <div className={`xl:col-span-2 ${card} p-4`}>
              <div className="font-medium">Checklist de hoy</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {habitos.map((h) => (
                  <label key={h.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${border} hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 cursor-pointer`}>
                    <input type="checkbox" defaultChecked={h.done} className="size-4 accent-amber-500" />
                    <span className="text-sm">{h.key}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

);
}

/_ ---------- SUBCOMPONENTES ---------- _/

function Brand() {
return (

<div className="flex items-center gap-2">
<div className="size-8 rounded-xl bg-amber-500/15 grid place-items-center">
<span className="text-amber-500 font-semibold">ON</span>
</div>
<div>
<div className="font-semibold">ONFIT</div>
<div className="text-xs text-neutral-500">Tu progreso</div>
</div>
</div>
);
}

function Nav() {
const items = [
{ label: "Inicio (hoy)", icon: User },
{ label: "Entrenamiento", icon: Dumbbell },
{ label: "Nutrición", icon: User },
{ label: "Calendario", icon: Calendar },
{ label: "Mensajes", icon: MessageSquare },
{ label: "Ajustes", icon: User },
];
return (

<nav className="px-2 py-2 space-y-1">
{items.map((i) => (
<button
          key={i.label}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
<i.icon className="size-4 text-neutral-600 dark:text-neutral-400" />
<span>{i.label}</span>
</button>
))}
<div className="pt-2">
<button className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-neutral-200/60 dark:border-neutral-800/70 hover:bg-neutral-100 dark:hover:bg-neutral-900">
Cerrar sesión
</button>
</div>
</nav>
);
}

function Sidebar() {
return (

<div className="h-full flex flex-col">
<div className="px-5 py-4">
<Brand />
</div>
<Nav />
</div>
);
}

Cómo verlo en local 1. Arranca la web:

pnpm dev:web

    2.	Abre en el navegador:

http://localhost:3000/(user)/dashboard

Si quieres que este sea el “home” del área de usuario, luego movemos/alias la ruta (por ejemplo, /app/(user)/page.tsx que redirija al dashboard).
