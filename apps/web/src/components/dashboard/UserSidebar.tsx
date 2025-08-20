"use client";

import React from "react";
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserSidebar() {
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
  const router = useRouter();
  
  const items = [
    { label: "Inicio (Hoy)", icon: Home, href: "/user" },
    { label: "Entrenamiento", icon: Dumbbell, href: "/training" },
    { label: "Nutrición", icon: Utensils, href: "/user/nutrition" },
    { label: "Calendario", icon: Calendar, href: "/user/calendar" },
    { label: "Progreso", icon: TrendingUp, href: "/user/progress" },
    { label: "Hábitos", icon: CheckCircle2, href: "/user/habits" },
    { label: "Mensajes", icon: MessageSquare, href: "/user/messages" },
    { label: "Pagos", icon: CreditCard, href: "/user/payments" },
    { label: "Ajustes", icon: Settings, href: "/user/settings" },
    { label: "Ayuda", icon: HelpCircle, href: "/user/help" },
  ];
  
  return (
    <nav className="px-3 py-1 space-y-1">
      {items.map((i) => (
        <button
          key={i.label}
          onClick={() => router.push(i.href)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
        >
          <i.icon className="size-[18px] text-muted-foreground" />
          <span>{i.label}</span>
        </button>
      ))}
      
      {/* Separador antes del botón de logout */}
      <div className="my-2 border-t border-border/50"></div>
      
      {/* Cerrar sesión como un ítem más del menú */}
      <button
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
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <LogOut className="size-[18px] text-muted-foreground" />
        <span>Cerrar sesión</span>
      </button>
    </nav>
  );
}
