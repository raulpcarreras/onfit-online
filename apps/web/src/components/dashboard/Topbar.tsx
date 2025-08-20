"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Search, Bell, User, Dumbbell, Sun, Moon, Monitor, ChevronRight } from "lucide-react";
import { Button } from "@repo/design/ui/button";

import { Text } from "@repo/design/ui/text";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/lib/profile-provider";

type TopbarProps = {
  onOpenMenu?: () => void;
  variant?: "admin" | "user";
  userInfo?: {
    name: string;
    email: string;
  };
};

const formatPathSegment = (segment: string): string => {
  // Formato para segmentos de ruta:
  // - Quita guiones y los convierte a espacios
  // - Primera letra de cada palabra en mayúscula
  return segment
    .replace(/-/g, ' ')
    .replace(/^\w|\s\w/g, (s) => s.toUpperCase());
};

export default function Topbar({ onOpenMenu, variant = "admin", userInfo }: TopbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { profile, loading } = useProfile();
  
  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";


  

  
  // Preparar breadcrumb
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => {
      // Ruta acumulativa para cada segmento
      const href = `/${arr.slice(0, i + 1).join('/')}`;
      return {
        name: formatPathSegment(segment),
        href
      };
    });
  
  return (
    <div className="h-14 border-b border-border bg-background/80 backdrop-blur">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* IZQUIERDA: Menú móvil + Brand + Breadcrumb */}
        <div className="flex items-center gap-1">
          {/* Hamburger solo móvil */}
          <button
            onClick={onOpenMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            aria-label="Abrir menú"
          >
            <Menu className="size-5 text-muted-foreground" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <div className="size-8 rounded-xl bg-primary/15 grid place-items-center">
              <Dumbbell className="size-5 text-primary" />
            </div>
            <div className="font-semibold">
              ONFIT <span className="text-primary">{variant === "admin" ? "Admin" : "Online"}</span>
            </div>
          </div>
          
          {/* Slash separado - se puede mover independientemente */}
          {variant === "admin" && (
            <>
              <span className="hidden sm:inline mx-1 md:mx-2 text-xl md:text-2xl text-muted-foreground font-light" style={{ marginTop: '-2px' }}>/</span>
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center" style={{ marginTop: '3px' }}>
                <div className="flex items-center font-mono text-xs tracking-tight text-muted-foreground truncate max-w-[150px] md:max-w-none">
                  {pathSegments.map((segment, i) => (
                    <React.Fragment key={segment.href}>
                      {i > 0 && <ChevronRight className="size-3 mx-1 text-muted flex-shrink-0" />}
                      <Link 
                        href={segment.href}
                        className="hover:text-primary transition-colors truncate"
                      >
                        {segment.name}
                      </Link>
                    </React.Fragment>
                  ))}
                  {pathSegments.length === 0 && (
                    <span className="text-muted-foreground">Dashboard</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* CENTRO: Buscador */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs md:max-w-md px-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary/70 outline-none text-sm placeholder:text-muted-foreground border border-border"
              placeholder="Buscar..."
              aria-label="Buscar"
            />
          </div>
        </div>
        
        {/* Búsqueda móvil (icono) */}
        <button className="sm:hidden p-2 rounded-lg hover:bg-secondary" aria-label="Buscar">
          <Search className="size-5 text-muted-foreground" />
        </button>
        
        {/* DERECHA: Tema + Notificaciones + Usuario */}
        <div className="flex items-center gap-2">
          {/* Selector de tema personalizado */}
          <div className="relative">
            <button 
              onClick={() => setTheme(themeSetting === "light" ? "dark" : themeSetting === "dark" ? "system" : "light")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2" 
              aria-label="Cambiar tema"
            >
              {!mounted ? (
                <Monitor className="size-5 text-muted-foreground" />
              ) : themeSetting === "light" ? (
                <Sun className="size-5 text-muted-foreground" />
              ) : themeSetting === "dark" ? (
                <Moon className="size-5 text-muted-foreground" />
              ) : (
                <Monitor className="size-5 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {themeSetting === "light" ? "Claro" : themeSetting === "dark" ? "Oscuro" : "Sistema"}
              </span>
            </button>
          </div>

          {/* Notificaciones */}
          <button className="p-2 rounded-lg hover:bg-secondary" aria-label="Notificaciones">
            <Bell className="size-5 text-muted-foreground" />
          </button>

          {/* Usuario */}
          <div className="hidden sm:flex items-center gap-2 pl-2">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium text-foreground">
                {loading 
                  ? "Cargando..." 
                  : (profile?.full_name || userInfo?.name || (variant === "admin" ? "Raúl Carreras" : "Usuario"))}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {loading 
                  ? "" 
                  : (profile?.email || userInfo?.email || (variant === "admin" ? "admin@onfit.online" : "usuario@onfit.online"))}
              </div>
            </div>
            <div className="size-8 rounded-full grid place-items-center bg-primary/15">
              <User className="size-4 text-primary" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}


