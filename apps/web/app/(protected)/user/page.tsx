"use client";

import { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/user-provider";
import { useProfile } from "@/lib/profile-provider";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@repo/design/components/FullScreenLoader";

import {
  Dumbbell,
  Calendar,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { Card } from "@repo/design/components/Card";
import { Checkbox } from "@repo/design/components/Checkbox";
import { ChecklistItem } from "@repo/design/components/ChecklistItem";
import { Progress } from "@repo/design/components/Progress";

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
  const { user, loading } = useUser();
  const { profile } = useProfile();
  const router = useRouter();
  const [habitStates, setHabitStates] = useState(habitos.map((h) => h.done));

  // Mostrar loader mientras se carga el perfil
  if (loading || !user || !profile) {
    return <FullScreenLoader label="Cargando..." />;
  }

  // Verificar que el usuario tenga rol de usuario (esto ya lo valida el middleware + layout)
  if (profile.role !== "user") {
    return <FullScreenLoader label="Redirigiendo..." />;
  }

  const session = {
    name: "Full Body – Semana 3 / Día 2",
    duration: "45–55 min",
    progress: 35,
  };

  // Calcular kcal (memoizado para evitar recálculos)
  const kcal = Math.round((1820 / 2200) * 100);

  return (
    <div className="px-4 md:px-5 py-4 space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <k.icon className="size-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
            {k.diff && <div className="mt-1 text-xs text-primary">{k.diff}</div>}
          </Card>
        ))}
      </div>

      {/* Entrenamiento + Macros */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        {/* Entrenamiento de hoy */}
        <Card className="xl:col-span-2 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Entrenamiento de hoy</div>
            <div className="text-xs text-muted-foreground">{session.duration}</div>
          </div>
          <div className="mt-1 text-muted-foreground">{session.name}</div>

          {/* progreso */}
          <div className="mt-4">
            <Progress value={session.progress} showValue />
            <div className="mt-1 text-xs text-muted-foreground">
              {session.progress}% completado
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="px-4 py-2">Iniciar</Button>
            <Button variant="outline" className="px-4 py-2">
              Ver detalles
            </Button>
          </div>
        </Card>

        {/* Macros del día */}
        <Card className="p-4">
          <div className="font-medium">Macros del día</div>
          <div className="mt-3 space-y-3">
            {macros.map((m) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{m.key}</span>
                    <span className="text-muted-foreground">
                      {m.current}/{m.target}g
                    </span>
                  </div>
                  <Progress value={pct} size="sm" />
                </div>
              );
            })}
            <div className="mt-2 text-xs text-muted-foreground">
              Kcal totales: {kcal}% del objetivo
            </div>
          </div>
        </Card>
      </div>

      {/* Agenda + Mensajes */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        {/* Próximo evento */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Próximo evento</div>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Mañana 18:00 — Sesión con Laura
          </div>
          <Button className="mt-3 w-full">Abrir calendario</Button>
        </Card>

        {/* Mensajes recientes */}
        <Card className="xl:col-span-2 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Mensajes recientes</div>
            <MessageSquare className="size-4 text-primary" />
          </div>
          <div className="mt-3 divide-y divide-border">
            {mensajes.map((m, i) => (
              <div key={i} className="py-3 flex items-start gap-3">
                <div className="size-8 rounded-full grid place-items-center bg-primary/15 shrink-0">
                  <MessageSquare className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{m.from}</div>
                  <div className="text-sm text-muted-foreground">{m.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-3 px-4 py-2">Abrir mensajes</Button>
        </Card>
      </div>

      {/* Peso rápido + Hábitos */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        {/* Peso rápido */}
        <Card className="p-4">
          <div className="font-medium">Peso rápido</div>
          <div className="mt-3 flex gap-2">
            <Input
              type="number"
              inputMode="decimal"
              placeholder="kg"
              className="flex-1"
            />
            <Button className="px-4 py-2">Guardar</Button>
          </div>
        </Card>

        {/* Hábitos (col-span-2) */}
        <Card className="xl:col-span-2 p-4">
          <div className="font-medium">Checklist de hoy</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {habitos.map((h, index) => (
              <ChecklistItem
                key={h.key}
                checked={habitStates[index]}
                onPress={() => {
                  const newStates = [...habitStates];
                  newStates[index] = !habitStates[index];
                  setHabitStates(newStates);
                }}
              >
                <Checkbox
                  checked={habitStates[index]}
                  onCheckedChange={(checked) => {
                    const newStates = [...habitStates];
                    newStates[index] = checked as boolean;
                    setHabitStates(newStates);
                  }}
                />
                <div className="text-sm">{h.key}</div>
              </ChecklistItem>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
