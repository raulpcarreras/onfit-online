import React, { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useThemeBridge } from "@repo/design/providers/theme";

export default function OnfitAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colors } = useThemeBridge();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Datos requeridos", "Introduce email y contraseña");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Cargar rol desde onfit.profiles
      const { data: user } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.user?.id)
        .maybeSingle();
      if (profile?.role === "admin") router.replace("/(protected)/admin" as any);
      else router.replace("/");
    } catch (e: any) {
      Alert.alert("Error de inicio de sesión", e?.message ?? "Inténtalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Datos requeridos", "Introduce email y contraseña");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      Alert.alert("Registro iniciado", "Revisa tu email para confirmar la cuenta");
    } catch (e: any) {
      Alert.alert("Error al registrar", e?.message ?? "Inténtalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get("window");
  const maxWidth = Math.min(width * 0.9, 400);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors["background"] }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="gap-3 p-5 rounded-xl"
            style={{
              width: maxWidth,
              backgroundColor: colors["card"],
            }}
          >
            {/* Logo y título */}
            <View className="flex-row items-center gap-2.5 justify-center">
              <View
                className="w-9 h-9 rounded-xl justify-center items-center"
                style={{ backgroundColor: `${colors["primary"]}33` }}
              >
                <Text className="text-primary font-semibold">ON</Text>
              </View>
              <View>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors["foreground"] }}
                >
                  ONFIT13
                </Text>
                <Text
                  className="text-xs text-center"
                  style={{ color: colors["muted-foreground"] }}
                >
                  Accede con tu cuenta
                </Text>
              </View>
            </View>

            {/* Email */}
            <Text
              className="text-xs mt-1.5"
              style={{ color: colors["muted-foreground"] }}
            >
              Email
            </Text>
            <TextInput
              className="border border-input rounded-lg px-2.5 py-2"
              style={{
                backgroundColor: colors["muted"],
                color: colors["foreground"],
              }}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tu@correo.com"
              placeholderTextColor={colors["muted-foreground"]}
            />

            {/* Contraseña */}
            <Text
              className="text-xs mt-1.5"
              style={{ color: colors["muted-foreground"] }}
            >
              Contraseña
            </Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 border border-input rounded-lg px-2.5 py-2"
                style={{
                  backgroundColor: colors["muted"],
                  color: colors["foreground"],
                }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPwd}
                placeholder="••••••••"
                placeholderTextColor={colors["muted-foreground"]}
              />
              <Pressable
                className="border border-input rounded-lg px-2 py-1.5"
                onPress={() => setShowPwd(!showPwd)}
              >
                <Text className="text-xs" style={{ color: colors["foreground"] }}>
                  {showPwd ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            {/* Botón de login */}
            <Pressable
              className="rounded-lg py-2.5 items-center mt-2.5"
              style={{
                backgroundColor: colors["primary"],
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text
                className="font-semibold"
                style={{ color: colors["primary-foreground"] }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>

            {/* Links */}
            <View className="flex-row justify-between mt-2.5">
              <Text className="text-xs" style={{ color: colors["muted-foreground"] }}>
                Olvidé mi contraseña
              </Text>
              <Pressable onPress={handleSignUp} disabled={loading}>
                <Text className="text-xs" style={{ color: colors["muted-foreground"] }}>
                  {loading ? "..." : "Crear cuenta nueva"}
                </Text>
              </Pressable>
            </View>

            <Text
              className="text-xs mt-3 text-center"
              style={{ color: colors["muted-foreground"] }}
            >
              Al continuar aceptas los Términos y la Política de Privacidad.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
