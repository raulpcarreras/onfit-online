"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SidebarItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
};

type SidebarProps = {
  items: SidebarItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  const router = useRouter();
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-xs font-mono tracking-wider text-muted-foreground font-medium pl-2">MENU</h2>
      </div>
      <Nav items={items} />
    </div>
  );
}

function Nav({ items }: { items: SidebarItem[] }) {
  const router = useRouter();
  
  return (
    <nav className="px-3 py-1 space-y-1">
      {items.map((i) => (
        <button
          key={i.label}
          onClick={() => {
            if (i.onClick) {
              i.onClick();
            } else if (i.href) {
              router.push(i.href);
            }
          }}
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
        onClick={async () => {
          // Logout server-first: el servidor limpia las cookies
          await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
          window.location.replace("/login");
        }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <LogOut className="size-[18px] text-muted-foreground" />
        <span>Cerrar sesión</span>
      </button>
    </nav>
  );
}
