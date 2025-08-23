"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Play, Pause, SkipForward, CheckCircle, Clock, 
  ChevronLeft, ChevronRight, Timer, Target, Info
} from "lucide-react";
import { Button } from "@repo/design/components/Button";
import { Card } from "@repo/design/components/Card";
import { Progress } from "@repo/design/components/Progress";

// Datos de ejemplo de la sesión (luego vendrán de Supabase)
const sessionData = {
  id: 1,
  name: "Full Body - Semana 3 / Día 2",
  duration: "45-55 min",
  exercises: [
    {
      id: 1,
      name: "Sentadilla con barra",
      category: "Piernas",
      sets: 4,
      reps: "8-10",
      weight: "80kg",
      rpe: "8",
      rest: 180, // segundos
      notes: "Mantener pecho arriba, rodillas alineadas",
      completed: false,
      setsData: [
        { set: 1, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 2, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 3, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 4, reps: 0, weight: 0, rpe: 0, completed: false }
      ]
    },
    {
      id: 2,
      name: "Press de banca",
      category: "Pecho",
      sets: 3,
      reps: "10-12",
      weight: "60kg",
      rpe: "7-8",
      rest: 120,
      notes: "Controlar el descenso, explosivo en el empuje",
      completed: false,
      setsData: [
        { set: 1, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 2, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 3, reps: 0, weight: 0, rpe: 0, completed: false }
      ]
    },
    {
      id: 3,
      name: "Peso muerto rumano",
      category: "Posterior",
      sets: 3,
      reps: "12-15",
      weight: "50kg",
      rpe: "7",
      rest: 150,
      notes: "Sentir en isquios, mantener espalda neutra",
      completed: false,
      setsData: [
        { set: 1, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 2, reps: 0, weight: 0, rpe: 0, completed: false },
        { set: 3, reps: 0, weight: 0, rpe: 0, completed: false }
      ]
    }
  ]
};

export default function TrainingRunner() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<'pending' | 'active' | 'paused' | 'completed'>('pending');
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [exercises, setExercises] = useState(sessionData.exercises);

  const currentExercise = exercises[currentExerciseIndex];
  const currentSet = currentExercise?.setsData[currentSetIndex];

  // Timer de descanso
  useEffect(() => {
    let interval: number | undefined;
    
    if (restTimer && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev ? prev - 1 : null);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer]);

  // Iniciar sesión
  const startSession = () => {
    setSessionStatus('active');
    setSessionStartTime(new Date());
  };

  // Pausar/Reanudar
  const togglePause = () => {
    setSessionStatus(prev => prev === 'active' ? 'paused' : 'active');
  };

  // Completar serie
  const completeSet = (exerciseId: number, setIndex: number, data: any) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSetsData = [...ex.setsData];
        newSetsData[setIndex] = { ...newSetsData[setIndex], ...data, completed: true };
        
        // Si es la última serie del ejercicio, marcar como completado
        if (setIndex === ex.sets - 1) {
          return { ...ex, setsData: newSetsData, completed: true };
        }
        
        return { ...ex, setsData: newSetsData };
      }
      return ex;
    }));

    // Iniciar timer de descanso si no es la última serie
    if (setIndex < currentExercise.sets - 1) {
      setRestTimer(currentExercise.rest);
    } else {
      // Pasar al siguiente ejercicio
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSetIndex(0);
      } else {
        // Sesión completada
        setSessionStatus('completed');
      }
    }
  };

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progreso de la sesión
  const sessionProgress = exercises.reduce((acc, ex) => {
    const completedSets = ex.setsData.filter(set => set.completed).length;
    return acc + completedSets;
  }, 0);
  
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const progressPercentage = Math.round((sessionProgress / totalSets) * 100);

  return (
    <div className="px-4 md:px-5 py-4">
      {/* Header del Runner */}
      <div className="sticky top-14 z-20 bg-card border border-border rounded-lg mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              className="p-2 h-auto"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{sessionData.name}</h1>
              <p className="text-sm text-muted-foreground">
                Ejercicio {currentExerciseIndex + 1} de {exercises.length} • 
                Serie {currentSetIndex + 1} de {currentExercise?.sets}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Timer de descanso */}
            {restTimer && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-primary">
                <Timer className="size-4" />
                <div className="font-mono font-medium">{formatTime(restTimer)}</div>
              </div>
            )}
            
            {/* Controles de sesión */}
            {sessionStatus === 'pending' && (
              <Button 
                onPress={startSession}
                className="px-4 py-2"
              >
                <Play className="size-4" />
                Iniciar
              </Button>
            )}
            
            {sessionStatus === 'active' && (
              <Button 
                variant="secondary"
                onPress={togglePause}
                className="px-4 py-2"
              >
                <Pause className="size-4" />
                Pausar
              </Button>
            )}
            
            {sessionStatus === 'paused' && (
              <Button 
                onPress={togglePause}
                className="px-4 py-2"
              >
                <Play className="size-4" />
                Reanudar
              </Button>
            )}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="px-4 pb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <div>Progreso de la sesión</div>
            <div>{sessionProgress} / {totalSets} series</div>
          </div>
          <Progress 
            value={progressPercentage} 
            size="sm"
            animated
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto">
        {/* Ejercicio actual */}
        {currentExercise && (
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{currentExercise.name}</h2>
                <p className="text-muted-foreground">{currentExercise.category}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Objetivo</div>
                <div className="text-lg font-medium">
                  {currentExercise.reps} reps • {currentExercise.weight}
                </div>
                <div className="text-sm text-muted-foreground">RPE {currentExercise.rpe}</div>
              </div>
            </div>

            {/* Notas del ejercicio */}
            {currentExercise.notes && (
              <Card className="bg-secondary/50 p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Info className="size-4" />
                  Notas
                </div>
                <p className="text-sm">{currentExercise.notes}</p>
              </Card>
            )}

            {/* Series */}
            <div className="space-y-3">
              <h3 className="font-medium">Series</h3>
              {currentExercise.setsData.map((set, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    set.completed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                      : index === currentSetIndex 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-secondary/30 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">Serie {index + 1}</div>
                      {set.completed && <CheckCircle className="size-5 text-green-600" />}
                    </div>
                    
                    {!set.completed && index === currentSetIndex && (
                      <Button 
                        onPress={() => completeSet(currentExercise.id, index, {
                          reps: 10,
                          weight: 80,
                          rpe: 8
                        })}
                        className="px-4 py-2"
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                  
                  {set.completed && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {set.reps} reps • {set.weight}kg • RPE {set.rpe}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Lista de ejercicios */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ejercicios de la sesión</h3>
          {exercises.map((exercise, index) => (
            <div 
              key={exercise.id} 
              className={`p-4 rounded-lg border transition-colors ${
                index === currentExerciseIndex 
                  ? 'bg-primary/10 border-primary/50' 
                  : exercise.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                    : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full grid place-items-center text-sm font-medium ${
                    index === currentExerciseIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : exercise.completed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} series • {exercise.reps} reps • {exercise.weight}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {exercise.completed && <CheckCircle className="size-5 text-green-600" />}
                  <div className="text-sm text-muted-foreground">
                    {exercise.setsData.filter(set => set.completed).length}/{exercise.sets}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
