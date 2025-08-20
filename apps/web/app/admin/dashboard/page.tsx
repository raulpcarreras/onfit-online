"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Euro, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-provider";
import FullScreenLoader from "@/components/FullScreenLoader";

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
  { name: "Ana López", email: "ana@example.com", role: "cliente", plan: "PRO" },
  { name: "Carlos Pérez", email: "carlos@example.com", role: "trainer", plan: "BASIC" },
  { name: "María Ruiz", email: "maria@example.com", role: "cliente", plan: "PRO" },
  { name: "Jorge Díaz", email: "jorge@example.com", role: "cliente", plan: "FREE" },
];

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const { role, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") router.replace("/login");
  }, [loading, role, router]);

  const accent = "text-primary";
  const border = "border border-border";
  const card = "bg-card p-0";
  const ChartStroke = theme === "light" ? "hsl(var(--primary))" : "hsl(var(--primary))";

  // Evitar FOUC de contenido protegido: mostrar loader corporativo hasta confirmar rol
  if (loading || role !== "admin") return <FullScreenLoader label={loading ? "Cargando..." : "Redirigiendo..."} />;

  return (
    <div>
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
                <div className="mt-1 text-xs text-emerald-400">{item.diff}</div>
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
              <div className="h-[260px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ingresos} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="rgba(120,120,120,0.15)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "currentColor" }} stroke="rgba(120,120,120,0.25)" />
                    <YAxis tick={{ fill: "currentColor" }} stroke="rgba(120,120,120,0.25)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--tooltip-bg)",
                        border: "1px solid var(--tooltip-border)",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "var(--tooltip-text)" }}
                      itemStyle={{ color: "var(--tooltip-value)" }}
                    />
                    <Line type="monotone" dataKey="value" stroke={ChartStroke} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
              <button className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium transition btn-primary">
                Ver todos
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
