"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/user-provider";

import {
  Dumbbell, Calendar, MessageSquare, CheckCircle2, TrendingUp, Utensils
} from "lucide-react";

type KPI = { label: string; value: string; diff?: string; icon: any };

const kpis: KPI[] = [
  { label: "Sesiones completadas (30d)", value: "14", diff: "+2", icon: Dumbbell },
  { label: "Racha de hábitos", value: "7 días", diff: "+1", icon: CheckCircle2 },
  { label: "Calorías hoy", value: "1.820 / 2.200", icon: Utensils },
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
  const { resolvedTheme } = useTheme();
  const { user, role, loading } = useUser();

  const border = "border border-border";
  const card = "bg-card rounded-lg p-4";
  const accent = "text-primary";

  const session = {
    name: "Full Body – Semana 3 / Día 2",
    duration: "45–55 min",
    progress: 35,
  };

  const kcal = useMemo(
    () => {
      const [cur, tar] = [1820, 2200];
      return Math.round((cur / tar) * 100);
    },
    []
  );

  return (
    <div className="px-4 md:px-5 py-4 space-y-6">
      {/* KPIs */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className={`${card}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{k.label}</div>
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
        <div className={`xl:col-span-2 ${card}`}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Entrenamiento de hoy</div>
            <div className="text-xs text-muted-foreground">{session.duration}</div>
          </div>
          <div className="mt-1 text-muted-foreground">{session.name}</div>

          {/* progreso */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${session.progress}%` }} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{session.progress}% completado</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition">
              Iniciar
            </button>
            <button className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition">
              Ver detalles
            </button>
          </div>
        </div>

        {/* Macros del día */}
        <div className={`${card}`}>
          <div className="font-medium">Macros del día</div>
          <div className="mt-3 space-y-3">
            {macros.map((m) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{m.key}</span>
                    <span className="text-muted-foreground">{m.current}/{m.target}g</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-2 text-xs text-muted-foreground">Kcal totales: {kcal}% del objetivo</div>
          </div>
        </div>
      </section>

      {/* Agenda + Mensajes */}
      <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        {/* Próximo evento */}
        <div className={`${card}`}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Próximo evento</div>
            <Calendar className={`size-4 ${accent}`} />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">Mañana 18:00 — Sesión con Laura</div>
          <button className="mt-3 w-full py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition">
            Abrir calendario
          </button>
        </div>

        {/* Mensajes recientes */}
        <div className={`xl:col-span-2 ${card}`}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Mensajes recientes</div>
            <MessageSquare className={`size-4 ${accent}`} />
          </div>
          <div className="mt-3 divide-y divide-border">
            {mensajes.map((m, i) => (
              <div key={i} className="py-3 flex items-start gap-3">
                <div className="size-8 rounded-full grid place-items-center bg-primary/15 shrink-0">
                  <MessageSquare className={`size-4 ${accent}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{m.from}</div>
                  <div className="text-sm text-muted-foreground">{m.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition">
            Abrir mensajes
          </button>
        </div>
      </section>

      {/* Peso rápido + Hábitos */}
      <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        {/* Peso rápido */}
        <div className={`${card}`}>
          <div className="font-medium">Peso rápido</div>
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="kg"
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border outline-none"
            />
            <button className="px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition">
              Guardar
            </button>
          </div>
        </div>

        {/* Hábitos (col-span-2) */}
        <div className={`xl:col-span-2 ${card}`}>
          <div className="font-medium">Checklist de hoy</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {habitos.map((h) => (
              <label key={h.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${border} hover:bg-secondary cursor-pointer`}>
                <input type="checkbox" defaultChecked={h.done} className="size-4 accent-primary" />
                <span className="text-sm">{h.key}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
