"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, UserPlus, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { Select } from "@repo/design/components/Select";
import { Checkbox } from "@repo/design/components/Checkbox";
import { Card } from "@repo/design/components/Card";
import { useUsers } from "@/hooks/useUsers";

interface UserFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "trainer" | "admin";
  is_super_admin: boolean;
  email_confirmed: boolean;
}

export default function UserManagementPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { users, refreshUsers } = useUsers();

  const action = params.action as string;
  const userId = searchParams.get("id");
  const isEditing = Boolean(action === "edit" && userId);

  const [formData, setFormData] = useState<UserFormData>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    is_super_admin: false,
    email_confirmed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (isEditing && userId && users.length > 0) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          password: "",
          confirmPassword: "",
          role: user.role,
          is_super_admin: user.is_super_admin === true,
          email_confirmed: true, // Al editar, asumimos que ya está confirmado
        });
      }
    }
  }, [isEditing, userId, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        // Actualizar usuario existente
        await updateUser();
      } else {
        // Crear nuevo usuario
        await createUser();
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    // Validaciones
    if (!formData.full_name.trim()) {
      throw new Error("El nombre es obligatorio");
    }
    if (!formData.email.trim()) {
      throw new Error("El email es obligatorio");
    }
    if (!formData.email.includes("@")) {
      throw new Error("El email no es válido");
    }
    if (!formData.password) {
      throw new Error("La contraseña es obligatoria");
    }

    // Validación de fortaleza de contraseña
    const passwordStrength = getPasswordStrength(formData.password);
    if (passwordStrength.score < 2) {
      throw new Error(
        "La contraseña es demasiado débil. Debe cumplir al menos 3 criterios de seguridad",
      );
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        is_super_admin: formData.is_super_admin,
        email_confirmed: formData.email_confirmed,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al crear usuario";

      // Traducir errores específicos
      switch (errorData.error) {
        case "email_already_exists":
          errorMessage = "Este email ya está registrado en el sistema";
          break;
        case "email_already_exists_in_profiles":
          errorMessage = "Este email ya existe en la base de datos";
          break;
        case "password_required":
          errorMessage = "La contraseña es obligatoria";
          break;
        case "password_too_short":
          errorMessage = "La contraseña debe tener al menos 8 caracteres";
          break;
        case "invalid_role":
          errorMessage = "El rol seleccionado no es válido";
          break;
        default:
          errorMessage = errorData.error || "Error al crear usuario";
      }

      throw new Error(errorMessage);
    }

    setSuccess("Usuario creado exitosamente");
    await refreshUsers();

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push("/admin/users");
    }, 2000);
  };

  const updateUser = async () => {
    if (!userId) return;

    const response = await fetch("/api/admin/update-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        ...formData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar usuario");
    }

    setSuccess("Usuario actualizado exitosamente");
    await refreshUsers();

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push("/admin/users");
    }, 2000);
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const tips = [];

    // Longitud mínima
    if (password.length >= 8) {
      score += 1;
      tips.push({ text: "Al menos 8 caracteres", fulfilled: true });
    } else {
      tips.push({ text: "Al menos 8 caracteres", fulfilled: false });
    }

    // Mayúsculas
    if (/[A-Z]/.test(password)) {
      score += 1;
      tips.push({ text: "Incluir mayúsculas", fulfilled: true });
    } else {
      tips.push({ text: "Incluir mayúsculas", fulfilled: false });
    }

    // Números
    if (/\d/.test(password)) {
      score += 1;
      tips.push({ text: "Incluir números", fulfilled: true });
    } else {
      tips.push({ text: "Incluir números", fulfilled: false });
    }

    // Caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
      tips.push({ text: "Incluir caracteres especiales", fulfilled: true });
    } else {
      tips.push({ text: "Incluir caracteres especiales", fulfilled: false });
    }

    // Bonus por longitud extra
    if (password.length >= 12) {
      score += 1;
    }

    const labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const label = labels[Math.min(score, 4)];

    return { score: Math.min(score, 4), label, tips };
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pageTitle = isEditing ? "Editar Usuario" : "Crear Nuevo Usuario";
  const pageDescription = isEditing
    ? "Modifica la información del usuario seleccionado"
    : "Añade un nuevo usuario al sistema";
  const submitText = isEditing ? "Guardar Cambios" : "Crear Usuario";
  const submitIcon = isEditing ? (
    <Save className="h-4 w-4" />
  ) : (
    <UserPlus className="h-4 w-4" />
  );

  // Usar EXACTAMENTE el mismo estilo que la página de usuarios
  const card = "bg-card rounded-lg border border-border p-4";

  return (
    <div className="px-4 md:px-5 py-4">
      <main>
        {/* HEADER - EXACTAMENTE igual que la página de usuarios */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <p className="text-muted-foreground">{pageDescription}</p>
            </div>
            <Button
              className="flex items-center gap-2"
              onPress={() => router.push("/admin/users")}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Usuarios
            </Button>
          </div>
        </div>

        {/* FORMULARIO - Usando el mismo estilo card */}
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium">
                Nombre Completo <span className="text-destructive">*</span>
              </label>
              {/* PRUEBA: Aplicando el mismo contexto que el Topbar */}
              <div className="relative w-full max-w-xs md:max-w-md">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                    className="w-full pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="juan@ejemplo.com"
                required
                disabled={isEditing}
                className="w-full"
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  El email no se puede modificar por seguridad
                </p>
              )}
            </div>

            {/* Password - Solo para crear usuarios */}
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Contraseña <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
                      required
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onPress={() => setShowPwd(!showPwd)}
                    >
                      {showPwd ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Barra de fortaleza de contraseña */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Fortaleza:</span>
                        <span
                          className={`font-medium ${
                            getPasswordStrength(formData.password).score === 0
                              ? "text-red-500"
                              : getPasswordStrength(formData.password).score === 1
                                ? "text-orange-500"
                                : getPasswordStrength(formData.password).score === 2
                                  ? "text-yellow-500"
                                  : getPasswordStrength(formData.password).score === 3
                                    ? "text-blue-500"
                                    : "text-green-500"
                          }`}
                        >
                          {getPasswordStrength(formData.password).label}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getPasswordStrength(formData.password).score === 0
                              ? "bg-red-500 w-1/5"
                              : getPasswordStrength(formData.password).score === 1
                                ? "bg-orange-500 w-2/5"
                                : getPasswordStrength(formData.password).score === 2
                                  ? "bg-yellow-500 w-3/5"
                                  : getPasswordStrength(formData.password).score === 3
                                    ? "bg-blue-500 w-4/5"
                                    : "bg-green-500 w-full"
                          }`}
                        />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {getPasswordStrength(formData.password).tips.map((tip, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1 ${
                              tip.fulfilled ? "text-green-600" : "text-muted-foreground"
                            }`}
                          >
                            {tip.fulfilled ? "✓" : "○"} {tip.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmar Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Contraseña <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPwd ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="••••••••"
                      required
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      aria-label={
                        showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      onPress={() => setShowConfirmPwd(!showConfirmPwd)}
                    >
                      {showConfirmPwd ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Rol - Usando el mismo estilo que el filtro de la página de usuarios */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Rol Funcional
              </label>
              <Select
                value={formData.role}
                onChange={(value: string) =>
                  handleInputChange("role", value as "user" | "trainer" | "admin")
                }
                options={[
                  { value: "user", label: "👤 Usuario - Acceso básico" },
                  { value: "trainer", label: "🏋️ Trainer - Gestión de entrenamientos" },
                  { value: "admin", label: "⚙️ Admin - Gestión del sistema" },
                ]}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                El rol determina las funcionalidades disponibles para el usuario
              </p>
            </div>

            {/* Email Confirmado - Solo para crear usuarios */}
            {!isEditing && (
              <div className="space-y-2">
                <label htmlFor="email_confirmed" className="text-sm font-medium">
                  Estado del Email
                </label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email_confirmed"
                    checked={formData.email_confirmed}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("email_confirmed", checked)
                    }
                  />
                  <label
                    htmlFor="email_confirmed"
                    className="text-sm text-muted-foreground"
                  >
                    Email ya validado (no requiere confirmación)
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  ✅ Si está marcado, el usuario podrá acceder inmediatamente sin
                  confirmar email
                </p>
              </div>
            )}

            {/* Super Admin */}
            <div className="space-y-2">
              <label htmlFor="is_super_admin" className="text-sm font-medium">
                Permisos de Super Admin
              </label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_super_admin"
                  checked={Boolean(formData.is_super_admin)}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange("is_super_admin", checked)
                  }
                />
                <label htmlFor="is_super_admin" className="text-sm text-muted-foreground">
                  Otorgar permisos de super administrador
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ Los super admins tienen acceso total al sistema
              </p>
            </div>

            {/* Alertas - Usando el mismo estilo que el manejo de errores de la página de usuarios */}
            {error && (
              <div
                className={`${card} border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800`}
              >
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <span className="font-medium">Error:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div
                className={`${card} border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800`}
              >
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span className="font-medium">Éxito:</span>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Botones de Acción - Usando el mismo estilo que los botones de la página de usuarios */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEditing ? "Guardando..." : "Creando..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {submitIcon}
                    {submitText}
                  </div>
                )}
              </Button>

              <Button
                type="button"
                onPress={() => router.push("/admin/users")}
                disabled={loading}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
