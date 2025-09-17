import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUser } from "./user-provider";
import { View, ActivityIndicator } from "react-native";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Esperar a que se cargue el estado

    if (!user) {
      // No hay sesión, redirigir a login
      router.replace("/login");
      return;
    }

    // Hay sesión, redirigir según rol
    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "trainer") {
      router.replace("/trainer");
    } else if (role === "user") {
      router.replace("/client");
    } else {
      // Rol no reconocido, ir a login
      router.replace("/login");
    }
  }, [user, role, loading, router]);

  // Mostrar loading mientras se determina la redirección
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  // Usuario autenticado, mostrar children
  return <>{children}</>;
}
