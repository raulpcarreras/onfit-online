"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-provider";
import Topbar from "@/components/dashboard/Topbar";
import UserSidebar from "@/components/dashboard/UserSidebar";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, loading } = useUser();
  const router = useRouter();

  // Protección del layout: solo usuarios pueden ver este layout
  useEffect(() => {
    if (!loading && (!user || role !== "user")) {
      router.replace("/login");
    }
  }, [loading, user, role, router]);

  // Mostrar loader hasta confirmar que es usuario
  if (loading || !user || role !== "user") {
    return <FullScreenLoader label={loading ? "Cargando..." : "Redirigiendo..."} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOPBAR - Ahora ocupa todo el ancho */}
      <header className="fixed top-0 left-0 right-0 z-30">
        <Topbar variant="user" onOpenMenu={() => setMobileOpen(true)} />
      </header>

      {/* SIDEBAR DESKTOP - Ahora empieza debajo de la topbar con ancho ajustado */}
      <aside className="hidden lg:block fixed top-14 bottom-0 left-0 w-52 border-r border-border bg-background/90 backdrop-blur z-20">
        <UserSidebar />
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
              <UserSidebar />
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
