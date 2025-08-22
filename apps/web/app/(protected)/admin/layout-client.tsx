"use client";

import React, { useState } from "react";
import Topbar from "@/components/dashboard/layout/Topbar";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { adminMenuItems } from "@/components/dashboard/layout/menu-config";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOPBAR - Ahora ocupa todo el ancho */}
      <header className="fixed top-0 left-0 right-0 z-30">
        <Topbar 
          variant="admin" 
          brandName="Admin"
          showBreadcrumb={true}
          onOpenMenu={() => setMobileOpen(true)} 
        />
      </header>

      {/* SIDEBAR DESKTOP - Ahora empieza debajo de la topbar con ancho ajustado */}
      <aside className="hidden lg:block fixed top-14 bottom-0 left-0 w-52 border-r border-border bg-background/90 backdrop-blur z-20">
        <Sidebar items={adminMenuItems} />
      </aside>

      {/* DRAWER MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute top-14 bottom-0 left-0 w-60 max-w-[85%] bg-card border-r border-border shadow-xl">
            <div className="p-2">
              <Sidebar items={adminMenuItems} />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT - Ahora con padding-top para despejar la topbar */}
      <main className="pt-14 lg:ml-52">
        {children}
      </main>
    </div>
  );
}
