"use client";

import React from "react";
import { Menu, Users, Euro, Settings, LogOut } from "lucide-react";
import { Button } from "@repo/design/components/Button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const router = useRouter();
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-xs font-mono tracking-wider text-muted-foreground font-medium pl-2">MENU</h2>
      </div>
      <Nav />
    </div>
  );
}

function Nav() {
  const items = [
    { label: "Dashboard", icon: Menu },
    { label: "Usuarios", icon: Users },
    { label: "Pagos", icon: Euro },
    { label: "Ajustes", icon: Settings },
  ];
  
  return (
    <nav className="px-3 py-1 space-y-1">
      {items.map((i) => (
        <Button
          key={i.label}
          variant="ghost"
          className="w-full justify-start h-auto p-3"
        >
          <i.icon className="size-[18px] text-muted-foreground" />
          <span className="text-sm font-medium">{i.label}</span>
        </Button>
      ))}
      
      {/* Separador antes del botón de logout */}
      <div className="my-2 border-t border-border/50"></div>
      
      {/* Cerrar sesión como un ítem más del menú */}
      <Button
        onClick={() => {
          try {
            Object.keys(window.localStorage).forEach((k) => {
              if (k.startsWith("sb-") || k.toLowerCase().includes("supabase")) {
                window.localStorage.removeItem(k);
              }
            });
          } catch {}
          try { void supabase.auth.signOut({ scope: "global" as any }); } catch {}
          window.location.replace("/");
        }}
        variant="ghost"
        className="w-full justify-start h-auto p-3 text-foreground"
      >
        <LogOut className="size-[18px] text-muted-foreground" />
        <span className="text-sm font-medium">Cerrar sesión</span>
      </Button>
    </nav>
  );
}


