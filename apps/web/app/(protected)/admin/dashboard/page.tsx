"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Users, Euro, Activity } from "lucide-react";
import { Button } from "@repo/design/components/Button";
import { Card } from "@repo/design/components/Card";
import { useUser } from "@/lib/user-provider";
import { useProfile } from "@/lib/profile-provider";
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
  const { user, loading } = useUser();
  const { profile } = useProfile();
  const router = useRouter();

  // Mostrar loader mientras se carga el perfil
  if (loading || !user || !profile) {
    return <FullScreenLoader label="Cargando..." />;
  }

  // Verificar que el usuario tenga permisos de admin (super admin o admin normal)
  const isSuperAdmin = !!(user.app_metadata as any)?.is_super_admin;
  const isAdmin = profile.role === "admin";
  
  if (!isSuperAdmin && !isAdmin) {
    return <FullScreenLoader label="Redirigiendo..." />;
  }

  // Usar resolvedTheme para evitar problemas de hidratación
  const ChartStroke = resolvedTheme === "light" ? "hsl(var(--primary))" : "hsl(var(--primary))";

  return (
    <div className="px-4 md:px-5 py-4">
      <main>
        {/* CONTENT */}
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {kpi.map((item) => (
              <Card key={item.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <item.icon className="size-4 text-primary" />
                </div>
                <div className="mt-2 text-2xl font-semibold">{item.value}</div>
                <div className="mt-1 text-xs text-primary">{item.diff}</div>
              </Card>
            ))}
          </div>

          {/* Chart + table */}
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            <Card className="xl:col-span-2 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Ingresos últimos 7 días</div>
                <div className="text-xs text-muted-foreground">EUR</div>
              </div>
              <RevenueChart data={ingresos} stroke={ChartStroke} />
            </Card>

            <Card className="p-4">
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
                  <tbody className="divide-y divide-border">
                    {recientes.map((user, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            user.plan === "PRO" ? "bg-primary text-primary-foreground" :
                            user.plan === "BASIC" ? "bg-secondary text-secondary-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center">
            <Button
              onPress={() => router.push("/admin/users")}
              variant="outline"
              className="px-8"
            >
              Ver todos
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
