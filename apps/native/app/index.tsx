import React from "react";
import LoginScreen from "../features/auth/LoginScreen";
import { useUser } from "@/lib/user-provider";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, role, loading } = useUser();
  const router = useRouter();
  React.useEffect(() => {
    if (!loading && user) {
      if (role === "admin") router.replace("/admin");
      else if (role === "trainer") router.replace("/trainer");
      else if (role === "client") router.replace("/client");
    }
  }, [loading, user, role]);
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  // Si no hay usuario, mostrar login sin redirecciones
  return <LoginScreen />;
}
