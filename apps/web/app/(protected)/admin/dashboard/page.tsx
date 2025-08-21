"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Users, Euro, Activity } from "lucide-react";
import { useUser } from "@/lib/user-provider";
import FullScreenLoader from "@/components/FullScreenLoader";

// Cargar el gráfico solo en cliente para evitar problemas de hidratación
const RevenueChart = dynamic(() => import("@/components/RevenueChart"), { ssr: false });

const kpi = [
  { label: "Usuarios totales", value: "12.481", icon: Users, diff: "+2.8%" },
  { label: "Ingresos (30d)", value: "€ 18.420", icon: Euro, diff: "+6.1%" },
  { label: "Retención", value: "87%", icon: Activity, diff: "+1.3%" },
];

const ingresos = [
  { day: "L", value: 480 },
  { day: "M", value: 520 },
  { day: "X", value: 610 },
  { day: "J", value: 580 },
  { day: "V", value: 660 },
  { day: "S", value: 720 },
  { day: "D", value: 690 },
];

const recientes = [
  { name: "Ana López", email: "ana@example.com", role: "usuario", plan: "PRO" },
  { name: "Carlos Pérez", email: "carlos@example.com", role: "trainer", plan: "BASIC" },
  { name: "María Ruiz", email: "maria@example.com", role: "usuario", plan: "PRO" },
  { name: "Jorge Díaz", email: "jorge@example.com", role: "usuario", plan: "FREE" },
];

export default function AdminDashboard() {
  const { theme, resolvedTheme } = useTheme();
  const { user, role, loading } = useUser();
  const router = useRouter();

  // Protección de ruta: solo admins pueden ver esta página
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.replace("/login");
    }
  }, [loading, user, role, router]);

  // Mostrar loader hasta confirmar que es admin
  if (loading || !user || role !== "admin") {
    return <FullScreenLoader label={loading ? "Cargando..." : "Redirigiendo..."} />;
  }

  const accent = "text-primary";
  const border = "border border-border";
  const card = "bg-card p-0";
  // Usar resolvedTheme para evitar problemas de hidratación
  const ChartStroke = resolvedTheme === "light" ? "hsl(var(--primary))" : "hsl(var(--primary))";

  return (
    <div className="px-4 md:px-5 py-4">
      <main>
        {/* CONTENT */}
        <div className="space-y-4">
          {/* KPIs */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {kpi.map((item) => (
              <div key={item.label} className={`${card} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <item.icon className={`size-4 ${accent}`} />
                </div>
                <div className="mt-2 text-2xl font-semibold">{item.value}</div>
                <div className="mt-1 text-xs text-primary">{item.diff}</div>
              </div>
            ))}
          </section>

          {/* Chart + table */}
          <section className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            <div className={`xl:col-span-2 ${card} p-4`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">Ingresos últimos 7 días</div>
                <div className="text-xs text-muted-foreground">EUR</div>
              </div>
              <RevenueChart data={ingresos} stroke={ChartStroke} />
            </div>

            <div className={`${card} p-4`}>
              <div className="font-medium">Usuarios recientes</div>
              <div className="mt-3 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-popover text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2 font-normal">Nombre</th>
                      <th className="text-left px-3 py-2 font-normal">Email</th>
                      <th className="text-left px-3 py-2 font-normal">Rol</th>
                      <th className="text-left px-3 py-2 font-normal">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map((u, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2">{u.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-1 rounded-md bg-popover capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-3 py-2">{u.plan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition">
                Ver todos
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
