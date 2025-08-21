import React, { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  useColorScheme,
} from "react-native";

export default function OnfitAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    bg: isDark ? "#0a0a0a" : "#f9fafb",
    card: "transparent",
    text: isDark ? "#ffffff" : "#000000",
    subtext: isDark ? "#9CA3AF" : "#4B5563",
    inputBg: isDark ? "#17171799" : "#f3f4f6",
    inputBorder: isDark ? "#262626" : "#d1d5db",
    toggleTxt: isDark ? "#ffffff" : "#000000",
    link: isDark ? "#D1D5DB" : "#1f2937",
    footer: isDark ? "#6B7280" : "#6B7280",
    btnBg: "#F59E0B",
    btnText: "#000000",
  };

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
      if (profile?.role === "admin") router.replace("/admin");
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

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[s.container, { backgroundColor: colors.card }]}>
            {/* Logo y título */}
            <View style={s.header}>
              <View style={[s.logo, { backgroundColor: "#F59E0B33" }]}>
                <Text style={[s.logoTxt]}>ON</Text>
              </View>
              <View>
                <Text style={[s.title, { color: colors.text }]}>ONFIT ONLINE</Text>
                <Text style={[s.subtitle, { color: colors.subtext }]}>
                  Accede con tu cuenta
                </Text>
              </View>
            </View>

            {/* Email */}
            <Text style={[s.label, { color: colors.subtext }]}>Email</Text>
            <TextInput
              style={[
                s.input,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tu@correo.com"
              placeholderTextColor={colors.subtext}
            />

            {/* Contraseña */}
            <Text style={[s.label, { color: colors.subtext }]}>Contraseña</Text>
            <View style={s.row}>
              <TextInput
                style={[
                  s.input,
                  {
                    flex: 1,
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPwd}
                placeholder="••••••••"
                placeholderTextColor={colors.subtext}
              />
              <Pressable
                style={[s.toggle, { borderColor: colors.inputBorder }]}
                onPress={() => setShowPwd(!showPwd)}
              >
                <Text style={[s.toggleTxt, { color: colors.toggleTxt }]}>
                  {showPwd ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            {/* Botón de login */}
            <Pressable
              style={[s.primary, { backgroundColor: colors.btnBg, opacity: loading ? 0.6 : 1 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[s.primaryTxt, { color: colors.btnText }]}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>

            {/* Links */}
            <View style={s.links}>
              <Text style={[s.link, { color: colors.link }]}>Olvidé mi contraseña</Text>
              <Pressable onPress={handleSignUp} disabled={loading}>
                <Text style={[s.link, { color: colors.link }]}>{loading ? "..." : "Crear cuenta nueva"}</Text>
              </Pressable>
            </View>

            <Text style={[s.footer, { color: colors.footer }]}>
              Al continuar aceptas los Términos y la Política de Privacidad.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const maxWidth = Math.min(width * 0.9, 400);

const s = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    width: maxWidth,
    gap: 12,
    padding: 20,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoTxt: { color: "#F59E0B", fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 12, textAlign: "center" },
  label: { fontSize: 12, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggle: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  toggleTxt: { fontSize: 12 },
  primary: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primaryTxt: { fontWeight: "600" },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  link: { fontSize: 12 },
  footer: { fontSize: 10, marginTop: 12, textAlign: "center" },
});
