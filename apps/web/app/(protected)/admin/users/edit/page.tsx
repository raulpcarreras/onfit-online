"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { Select } from "@repo/design/components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/ui/dialog";
import { Badge } from "@repo/design/ui/badge";
import { Label } from "@repo/design/ui/label";

import {
  Search,
  Edit,
  Eye,
  EyeOff,
  Save,
  X,
  User,
  Mail,
  Shield,
  Calendar,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

// Usar el tipo del hook useUsers en lugar de duplicar
type User = Awaited<ReturnType<typeof useUsers>>["users"][0];

interface EditUserData {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "trainer" | "admin";
  is_super_admin: boolean;
  password?: string;
  confirmPassword?: string;
}

export default function EditUsersPage() {
  const { users, loading, error, refreshUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<EditUserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Filtrar usuarios basado en búsqueda y rol
  const filteredUsers = users.filter((user) => {
    const email = user.email || "";
    const fullName = user.full_name || "";
    const matchesSearch =
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Iniciar edición de usuario
  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditData({
      id: user.id,
      email: user.email || "",
      full_name: user.full_name || "",
      role: user.role,
      is_super_admin: user.is_super_admin || false,
      password: "",
      confirmPassword: "",
    });
    setEditError(null);
    setEditSuccess(null);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingUser(null);
    setEditData(null);
    setEditError(null);
    setEditSuccess(null);
    setIsEditing(false);
  };

  // Guardar cambios
  const saveChanges = async () => {
    if (!editData) return;

    // Validaciones
    if (!editData.full_name.trim()) {
      setEditError("El nombre completo es obligatorio");
      return;
    }

    if (!editData.email.trim() || !editData.email.includes("@")) {
      setEditError("El email debe ser válido");
      return;
    }

    if (editData.password && editData.password.length < 8) {
      setEditError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (editData.password && editData.password !== editData.confirmPassword) {
      setEditError("Las contraseñas no coinciden");
      return;
    }

    setIsEditing(true);
    setEditError(null);

    try {
      const response = await fetch("/api/admin/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const result = await response.json();

      if (response.ok) {
        setEditSuccess("Usuario actualizado exitosamente");
        refreshUsers();
        setTimeout(() => {
          cancelEdit();
        }, 2000);
      } else {
        setEditError(result.error || "Error al actualizar usuario");
      }
    } catch (error) {
      setEditError("Error de conexión");
    } finally {
      setIsEditing(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtener color del badge según rol
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "trainer":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error al cargar usuarios: {error}</p>
          <Button onPress={refreshUsers} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Gestiona y edita los usuarios existentes del sistema
          </p>
        </div>
        <Button
          onPress={() => window.history.back()}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="user">Usuarios</option>
            <option value="trainer">Entrenadores</option>
            <option value="admin">Administradores</option>
          </select>
          <div className="text-right">
            <Badge className="text-sm bg-secondary text-secondary-foreground">
              {filteredUsers.length} usuarios encontrados
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role === "trainer" && <User className="h-3 w-3 mr-1" />}
                        {user.role === "user" && <User className="h-3 w-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      {user.is_super_admin && (
                        <Badge className="text-xs bg-destructive text-destructive-foreground">
                          Super Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-green-600 border-green-200 bg-green-50">
                      Activo
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(user.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {user.updated_at ? formatDate(user.updated_at) : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onPress={() => startEdit(user)} size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de Edición */}
      <Dialog open={!!editingUser} onOpenChange={() => !editingUser && cancelEdit()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuario: {editingUser?.full_name}</DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-6">
              {/* Mensajes de estado */}
              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 text-sm">{editError}</p>
                </div>
              )}

              {editSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800 text-sm">{editSuccess}</p>
                </div>
              )}

              {/* Campos de edición */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <Input
                    value={editData.full_name}
                    onChange={(e) =>
                      setEditData({ ...editData, full_name: e.target.value })
                    }
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                    type="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <Select
                    value={editData.role}
                    onChange={(v: string) =>
                      setEditData({
                        ...editData,
                        role: v as "user" | "trainer" | "admin",
                      })
                    }
                    options={[
                      { label: "Usuario", value: "user" },
                      { label: "Entrenador", value: "trainer" },
                      { label: "Administrador", value: "admin" },
                    ]}
                    placeholder="Selecciona un rol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Super Admin
                  </label>
                  <Select
                    value={editData.is_super_admin.toString()}
                    onChange={(value: string) =>
                      setEditData({ ...editData, is_super_admin: value === "true" })
                    }
                    options={[
                      { label: "No", value: "false" },
                      { label: "Sí", value: "true" },
                    ]}
                    placeholder="Selecciona el estado"
                  />
                </div>
              </div>

              {/* Cambio de contraseña */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={editData.password || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, password: e.target.value })
                        }
                        placeholder="Dejar vacío para no cambiar"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={editData.confirmPassword || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirmar nueva contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Deja los campos de contraseña vacíos si no quieres cambiarla
                </p>
              </div>

              {/* Acciones */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button onPress={cancelEdit} variant="outline" disabled={isEditing}>
                  Cancelar
                </Button>
                <Button
                  onPress={saveChanges}
                  disabled={isEditing}
                  className="min-w-[100px]"
                >
                  {isEditing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
