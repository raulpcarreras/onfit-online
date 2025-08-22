"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, Plus, Edit, Trash2, Shield, User, Crown } from "lucide-react";
import { useUser } from "@/lib/user-provider";
import { useProfile } from "@/lib/profile-provider";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Button } from "@repo/design/components/Button";
import { Text } from "@repo/design/ui/text";
import SuperAdminToggle from "@/components/admin/SuperAdminToggle";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { useUsers } from "@/hooks/useUsers";

// Mock data - después se reemplazará con datos reales
const mockUsers = [
  { id: "1", name: "Ana López", email: "ana@example.com", role: "user", plan: "PRO", status: "active", created: "2024-01-15" },
  { id: "2", name: "Carlos Pérez", email: "carlos@example.com", role: "trainer", plan: "BASIC", status: "active", created: "2024-01-10" },
  { id: "3", name: "María Ruiz", email: "maria@example.com", role: "admin", plan: "PRO", status: "active", created: "2024-01-05" },
  { id: "4", name: "Jorge Díaz", email: "jorge@example.com", role: "user", plan: "FREE", status: "inactive", created: "2024-01-01" },
  { id: "5", name: "Laura García", email: "laura@example.com", role: "user", plan: "PRO", status: "active", created: "2023-12-28" },
];

export default function AdminUsers() {
  const { theme, resolvedTheme } = useTheme();
  const { user, loading: userLoading, isSuperAdmin } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const { toggleSuperAdmin } = useSuperAdmin();
  const { users: realUsers, loading: usersLoading, error: usersError, refreshUsers } = useUsers();

  // Mostrar loader mientras se cargan los datos
  if (userLoading || profileLoading || usersLoading || !user || !profile) {
    return <FullScreenLoader label="Cargando usuarios..." />;
  }

  // Verificar que el usuario tenga rol de admin o super admin
  if (profile.role !== "admin" && !isSuperAdmin) {
    return <FullScreenLoader label="Redirigiendo..." />;
  }

  const accent = "text-primary";
  const border = "border border-border";
  const card = "bg-card rounded-lg border border-border p-4";

  // Usar datos reales o mock data como fallback
  const users = realUsers.length > 0 ? realUsers : mockUsers;
  
  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const userName = 'full_name' in user ? user.full_name : user.name;
    const userEmail = user.email || "";
    const matchesSearch = (userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Contadores
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.role !== "inactive").length; // Simplificado
  const adminUsers = users.filter(u => u.role === "admin").length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="size-4 text-yellow-500" />;
      case "trainer": return <Shield className="size-4 text-blue-500" />;
      default: return <User className="size-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium capitalize";
    switch (role) {
      case "admin": return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "trainer": return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <div className="px-4 md:px-5 py-4">
      <main>
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
              <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="size-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
          <div className={card}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total Usuarios</div>
              <Users className={`size-4 ${accent}`} />
            </div>
            <div className="mt-2 text-2xl font-semibold">{totalUsers}</div>
            <div className="mt-1 text-xs text-primary">+12% este mes</div>
          </div>

          <div className={card}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Usuarios Activos</div>
              <Users className={`size-4 ${accent}`} />
            </div>
            <div className="mt-2 text-2xl font-semibold">{activeUsers}</div>
            <div className="mt-1 text-xs text-primary">{Math.round((activeUsers/totalUsers)*100)}% del total</div>
          </div>

          <div className={card}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Administradores</div>
              <Crown className={`size-4 ${accent}`} />
            </div>
            <div className="mt-2 text-2xl font-semibold">{adminUsers}</div>
            <div className="mt-1 text-xs text-primary">+1 este mes</div>
          </div>
        </section>

        {/* FILTROS Y BÚSQUEDA */}
        <section className={`${card} mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary/70 outline-none text-sm placeholder:text-muted-foreground border border-border"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por rol */}
            <select
              className="px-3 py-2 rounded-lg bg-secondary/70 outline-none text-sm border border-border"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="user">Usuarios</option>
              <option value="trainer">Trainers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </section>

        {/* MANEJO DE ERRORES */}
        {usersError && (
          <div className={`${card} mb-4 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800`}>
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <Shield className="size-4" />
              <span className="font-medium">Error al cargar usuarios:</span>
              <span>{usersError}</span>
            </div>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshUsers()}
                className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-950/30"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* TABLA DE USUARIOS */}
        <section className={card}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-popover text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2 font-normal">Usuario</th>
                  <th className="text-left px-3 py-2 font-normal">Rol</th>
                  <th className="text-left px-3 py-2 font-normal">Plan</th>
                  <th className="text-left px-3 py-2 font-normal">Estado</th>
                  <th className="text-left px-3 py-2 font-normal">Fecha</th>
                  <th className="text-left px-3 py-2 font-normal">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={user.id} className="border-t border-border hover:bg-popover/50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/15 grid place-items-center">
                          <User className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{'full_name' in user ? user.full_name : user.name || "Sin nombre"}</div>
                          <div className="text-xs text-muted-foreground">{user.email || "Sin email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        ('plan' in user && user.plan === "PRO") ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                        ('plan' in user && user.plan === "BASIC") ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {'plan' in user ? user.plan : "FREE"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        ('status' in user && user.status === "active")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {('status' in user && user.status === "active") ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {new Date('created_at' in user ? user.created_at : user.created).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {/* Solo super admins pueden gestionar super admin */}
                        {isSuperAdmin && (
                          <SuperAdminToggle
                            key={`${user.id}-${('is_super_admin' in user ? user.is_super_admin : false)}`} // Force re-render on state change
                            userId={user.id}
                            userEmail={user.email || ""}
                            isCurrentlySuperAdmin={'is_super_admin' in user ? (user.is_super_admin || false) : false}
                            onToggle={async (enabled) => {
                              try {
                                console.log(`Toggling super admin for ${user.email}: ${enabled}`);
                                const success = await toggleSuperAdmin(user.email || "", enabled);
                                if (success) {
                                  console.log(`Success! Refreshing users...`);
                                  // Refrescar los usuarios reales
                                  await refreshUsers();
                                } else {
                                  console.log(`Failed to toggle super admin`);
                                  // Mostrar error al usuario
                                  alert("Error al cambiar permisos de super admin");
                                }
                              } catch (error) {
                                console.error("Error en onToggle:", error);
                                // Mostrar error al usuario
                                alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
                                // Revertir cambios locales si es necesario
                                await refreshUsers();
                              }
                            }}
                          />
                        )}
                        
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-red-500 hover:text-red-600">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredUsers.length} de {totalUsers} usuarios
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <span className="px-3 py-1 text-sm">1</span>
              <Button variant="outline" size="sm" disabled>Siguiente</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
