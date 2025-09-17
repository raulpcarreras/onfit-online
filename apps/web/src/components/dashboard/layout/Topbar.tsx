"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  Search,
  Bell,
  User,
  Dumbbell,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { Input } from "@repo/design/components/Input";
import { Button } from "@repo/design/components/Button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/lib/profile-provider";

type TopbarProps = {
  onOpenMenu?: () => void;
  variant: "admin" | "user";
  brandName: string;
  showBreadcrumb?: boolean;
  userInfo?: {
    name: string;
    email: string;
  };
};

const formatPathSegment = (segment: string): string => {
  return segment.replace(/-/g, " ").replace(/^\w|\s\w/g, (s) => s.toUpperCase());
};

export default function Topbar({
  onOpenMenu,
  variant,
  brandName,
  showBreadcrumb = true,
  userInfo,
}: TopbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { profile, loading } = useProfile();

  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";

  // Preparar breadcrumb
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => {
      let href = `/${arr.slice(0, i + 1).join("/")}`;

      // Para admin, el primer segmento siempre debe ir a /admin/dashboard
      if (variant === "admin" && i === 0 && segment === "admin") {
        href = "/admin/dashboard";
      }

      return {
        name: formatPathSegment(segment),
        href,
      };
    });

  return (
    <div className="h-14 border-b border-border bg-background/80 backdrop-blur">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* IZQUIERDA: Menú móvil + Brand + Breadcrumb */}
        <div className="flex items-center gap-1">
          {/* Hamburger solo móvil */}
          <Button
            onPress={onOpenMenu}
            variant="ghost"
            size="sm"
            className="lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5 text-muted-foreground" />
          </Button>

          {/* Brand */}
          <div className="flex items-center shrink-0 relative z-10">
            {/* Logo adaptativo según tema */}
            {!mounted ? (
              <div className="w-8 h-8 bg-primary/15 rounded-lg grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicon.png"
                  alt="ONFIT Logo"
                  className="size-7 object-contain"
                />
              </div>
            ) : resolvedTheme === "dark" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logos/logo-dark.png"
                alt="ONFIT Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logos/logo-light.png"
                alt="ONFIT Logo"
                className="h-8 w-auto object-contain"
              />
            )}
          </div>

          {/* Breadcrumb (solo si showBreadcrumb es true) */}
          {showBreadcrumb && (
            <>
              <span
                className="hidden sm:inline mx-1 md:mx-2 text-xl md:text-2xl text-muted-foreground font-light"
                style={{ marginTop: "-2px" }}
              >
                /
              </span>

              <div className="hidden sm:flex items-center" style={{ marginTop: "3px" }}>
                <div className="flex items-center font-mono text-xs tracking-tight text-muted-foreground truncate max-w-[150px] md:max-w-none">
                  {pathSegments.map((segment, i) => (
                    <React.Fragment key={`breadcrumb-${i}-${segment.href}`}>
                      {i > 0 && (
                        <ChevronRight className="size-3 mx-1 text-muted flex-shrink-0" />
                      )}
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
            <Input className="w-full pl-9" placeholder="Buscar..." aria-label="Buscar" />
          </div>
        </div>

        {/* Búsqueda móvil (icono) */}
        <Button variant="ghost" size="sm" className="sm:hidden" aria-label="Buscar">
          <Search className="size-5 text-muted-foreground" />
        </Button>

        {/* DERECHA: Tema + Notificaciones + Usuario */}
        <div className="flex items-center gap-2">
          {/* Selector de tema personalizado */}
          <div className="relative">
            <Button
              onPress={() =>
                setTheme(
                  themeSetting === "light"
                    ? "dark"
                    : themeSetting === "dark"
                      ? "system"
                      : "light",
                )
              }
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
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
                {themeSetting === "light"
                  ? "Claro"
                  : themeSetting === "dark"
                    ? "Oscuro"
                    : "Sistema"}
              </span>
            </Button>
          </div>

          {/* Notificaciones */}
          <Button variant="ghost" size="sm" aria-label="Notificaciones">
            <Bell className="size-5 text-muted-foreground" />
          </Button>

          {/* Usuario */}
          <div className="hidden sm:flex items-center gap-2 pl-2">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium text-foreground">
                {loading
                  ? "Cargando..."
                  : profile?.full_name ||
                    userInfo?.name ||
                    (variant === "admin" ? "Raúl Carreras" : "Usuario")}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {loading
                  ? ""
                  : profile?.email ||
                    userInfo?.email ||
                    (variant === "admin" ? "admin@onfit.online" : "usuario@onfit.online")}
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
