"use client";

import { useThemeBridge } from "@repo/design/providers/theme";
import { Button } from "@repo/design/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/design/components/Card";
import { useEffect, useState } from "react";

export default function TestThemePage() {
  const [mounted, setMounted] = useState(false);
  const { mode, resolvedMode, isDark, setMode, colors } = useThemeBridge();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar hidratación hasta que el cliente esté listo
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Test del ThemeBridge</h1>
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">Cargando tema...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Test del ThemeBridge</h1>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Tema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Modo preferido:</strong> {mode}
              </div>
              <div>
                <strong>Tema resuelto:</strong> {resolvedMode}
              </div>
              <div>
                <strong>Es oscuro:</strong> {isDark ? "Sí" : "No"}
              </div>
              <div>
                <strong>Color primario:</strong> {colors.primary}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onPress={() => setMode("light")} variant="outline">
                Tema Claro
              </Button>
              <Button onPress={() => setMode("dark")} variant="outline">
                Tema Oscuro
              </Button>
              <Button onPress={() => setMode("system")} variant="outline">
                Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colores del Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: value as string }}
                  />
                  <span className="text-sm font-mono">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Componentes del Design System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
