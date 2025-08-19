import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "@/lib/user-provider";
import { supabase } from "@/lib/supabase";

export default function AdminScreen() {
  const { loading, role, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/");
    }
  }, [loading, role, router]);

  if (loading || role !== "admin") {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {loading ? <ActivityIndicator /> : <Text>Redirigiendo...</Text>}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a0a0a", padding: 16 }}>
      <View style={{ width: Math.min(360, "100%" as any), gap: 12, padding: 20, borderRadius: 12, backgroundColor: "rgba(23,23,23,0.4)", borderWidth: 1, borderColor: "#262626" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Has iniciado sesión como: <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>{role ?? "usuario"}</Text></Text>
          <LogoutButton />
      </View>
        <View style={{ alignItems: "center", gap: 4 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#F59E0B33", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#F59E0B", fontWeight: "600" }}>ON</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFFFF" }}>Panel de administración</Text>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Bienvenido{user?.email ? `, ${user.email}` : ""}.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onLogout = async () => {
    if (loading) return;
    setLoading(true);
    const hardRedirect = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const toRemove = keys.filter((k) => k.startsWith("sb-") || k.toLowerCase().includes("supabase"));
        if (toRemove.length) await AsyncStorage.multiRemove(toRemove);
      } catch {}
      // Navegar a raíz y evitar entrar otra vez por efecto de role (espera a que user sea null)
      setTimeout(() => router.replace("/"), 50);
    };
    const fallback = setTimeout(() => { void hardRedirect(); }, 800);
    try { await supabase.auth.signOut(); } catch {}
    clearTimeout(fallback);
    await hardRedirect();
    setLoading(false);
  };
  return (
    <TouchableOpacity onPress={onLogout} disabled={loading}
      style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#2A2A2A", opacity: loading ? 0.6 : 1 }}>
      <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{loading ? "Saliendo..." : "Cerrar sesión"}</Text>
    </TouchableOpacity>
  );
}


