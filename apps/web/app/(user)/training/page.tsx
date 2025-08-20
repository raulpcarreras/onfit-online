"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Play, Clock, Calendar, Target, TrendingUp, Dumbbell, 
  ChevronRight, Plus, Settings, History
} from "lucide-react";

// Datos de ejemplo (luego vendrán de Supabase)
const activePrograms = [
  {
    id: 1,
    name: "Full Body - Fuerza",
    phase: "Fase 2: Hipertrofia",
    weeks: 8,
    currentWeek: 3,
    adherence: 85,
    nextSession: "Full Body - Semana 3 / Día 2"
  },
  {
    id: 2,
    name: "Core & Estabilidad",
    phase: "Fase 1: Base",
    weeks: 4,
    currentWeek: 1,
    adherence: 92,
    nextSession: "Core - Semana 1 / Día 3"
  }
];

const todaySession = {
  id: 1,
  name: "Full Body - Semana 3 / Día 2",
  duration: "45-55 min",
  exercises: 8,
  totalSets: 24,
  status: "pending", // pending, active, completed
  progress: 0
};

const recentSessions = [
  { date: "Ayer", name: "Full Body - Semana 3 / Día 1", duration: "48 min", status: "completed" },
  { date: "Hace 2 días", name: "Core - Semana 1 / Día 2", duration: "32 min", status: "completed" },
  { date: "Hace 3 días", name: "Full Body - Semana 2 / Día 4", duration: "52 min", status: "completed" }
];

export default function TrainingPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const accent = "text-primary";
  const card = "bg-card rounded-lg border border-border p-4";

  return (
    <div className="px-4 md:px-5 py-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entrenamiento</h1>
          <p className="text-muted-foreground">Gestiona tus programas y sesiones</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition">
            <History className="size-4 mr-2 inline" />
            Historial
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition">
            <Plus className="size-4 mr-2 inline" />
            Nuevo programa
          </button>
        </div>
      </div>

      {/* Sesión de hoy */}
      <section className={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Sesión de hoy</h2>
            <p className="text-muted-foreground">Tu entrenamiento programado</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <Clock className="size-4 inline mr-1" />
              {todaySession.duration}
            </span>
            <span className="text-sm text-muted-foreground">
              <Dumbbell className="size-4 inline mr-1" />
              {todaySession.exercises} ejercicios
            </span>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{todaySession.name}</h3>
              <p className="text-sm text-muted-foreground">
                {todaySession.totalSets} series totales
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progreso</div>
              <div className="text-lg font-semibold">{todaySession.progress}%</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/training/runner')}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition flex items-center justify-center"
          >
            <Play className="size-4 mr-2" />
            Iniciar sesión
          </button>
          <button className="px-4 py-3 rounded-lg border border-border hover:bg-secondary transition">
            <Settings className="size-4" />
          </button>
        </div>
      </section>

      {/* Programas activos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Programas activos</h2>
          <button className="text-sm text-primary hover:underline">Ver todos</button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {activePrograms.map((program) => (
            <div key={program.id} className={`${card} hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{program.name}</h3>
                  <p className="text-sm text-muted-foreground">{program.phase}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Adherencia</div>
                  <div className="text-lg font-semibold text-primary">{program.adherence}%</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span>Semana {program.currentWeek} de {program.weeks}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(program.currentWeek / program.weeks) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-3">
                Próxima sesión: {program.nextSession}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg bg-primary text-black text-sm hover:bg-primary/90 transition">
                  Continuar
                </button>
                <button className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition">
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sesiones recientes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sesiones recientes</h2>
          <button className="text-sm text-primary hover:underline">Ver historial completo</button>
        </div>
        
        <div className="bg-card rounded-lg border border-border">
          {recentSessions.map((session, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 ${
                index < recentSessions.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/15 grid place-items-center">
                  <Dumbbell className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{session.name}</div>
                  <div className="text-sm text-muted-foreground">{session.date} • {session.duration}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  session.status === 'completed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {session.status === 'completed' ? 'Completada' : 'En progreso'}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
