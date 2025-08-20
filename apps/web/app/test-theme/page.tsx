"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function TestThemePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold">Test de Variables CSS del Tema</h1>
      
      {/* Selector de tema */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Selector de Tema</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Claro
          </button>
          <button 
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Oscuro
          </button>
          <button 
            onClick={() => setTheme("system")}
            className={`px-4 py-2 rounded ${theme === "system" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Sistema
          </button>
        </div>
        
        <div className="text-sm">
          <p>Tema seleccionado: <strong>{theme}</strong></p>
          <p>Tema resuelto: <strong>{resolvedTheme}</strong></p>
          <p>Clase HTML: <strong>{typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') ? 'dark' : 'light' : 'N/A'}</strong></p>
        </div>
      </div>

      {/* Prueba de variables CSS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Prueba de Variables CSS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Variables del tema claro */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Variables :root (Tema Claro)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--background))' }}></div>
                <span>--background: {getComputedStyle(document.documentElement).getPropertyValue('--background')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                <span>--primary: {getComputedStyle(document.documentElement).getPropertyValue('--primary')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
                <span>--accent: {getComputedStyle(document.documentElement).getPropertyValue('--accent')}</span>
              </div>
            </div>
          </div>

          {/* Variables del tema oscuro */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Variables .dark (Tema Oscuro)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-neutral-900"></div>
                <span>--background: 0 0% 4%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span>--primary: 38 94% 52%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-neutral-800"></div>
                <span>--accent: 0 0% 10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prueba de clases Tailwind */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Prueba de Clases Tailwind</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90">
            Botón Primary
          </button>
          <button className="px-6 py-3 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Botón Secondary
          </button>
          <button className="px-6 py-3 rounded bg-accent text-accent-foreground hover:bg-accent/90">
            Botón Accent
          </button>
        </div>
      </div>
    </div>
  );
}
