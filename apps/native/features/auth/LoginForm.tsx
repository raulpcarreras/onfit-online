import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Button } from "@repo/design/components/Button/index.native";
import { ThemeToggle } from "@repo/design/components/ThemeToggle";
import { useThemeBridge } from "@repo/design/providers/theme";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { colors, isDark } = useThemeBridge();

  useEffect(() => setMounted(true), []);

  const onSubmit = async () => {
    // Validación simple de login
    const errs: typeof loginErrors = {};
    if (!email) errs.email = "Campo requerido";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email no válido";
    if (!password) errs.password = "Campo requerido";
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;

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
    } catch (error: any) {
      // Solo loggear errores que no sean credenciales inválidas
      if (!error.message.includes("Invalid login credentials")) {
        console.error("Error de login:", error);
      }

      if (error.message.includes("Invalid login credentials")) {
        setLoginErrors({ email: "Credenciales incorrectas" });
      } else {
        setLoginErrors({ email: "Error al iniciar sesión" });
      }
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get("window");
  const maxWidth = Math.min(width * 0.9, 400);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors["background"] }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              maxWidth: maxWidth,
              backgroundColor: colors["card"],
              borderColor: colors["border"],
            },
          ]}
        >
          <View style={styles.header}>
            {/* Botón de tema posicionado absolutamente en la esquina superior derecha */}
            <View style={styles.themeToggleContainer}>
              <ThemeToggle />
            </View>

            {/* Logo centrado */}
            <View style={styles.logoContainer}>
              <Image
                source={
                  isDark
                    ? require("../../assets/images/logo-dark.png")
                    : require("../../assets/images/logo-light.png")
                }
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.divider, { borderTopColor: colors["border"] }]} />
            <Text style={[styles.subtitle, { color: colors["muted-foreground"] }]}>
              Accede con tus credenciales para continuar con tu progreso.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors["muted-foreground"] }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors["muted"],
                    color: colors["foreground"],
                    borderColor: loginErrors.email ? "#ef4444" : colors["border"],
                  },
                ]}
                placeholder="tu@correo.com"
                placeholderTextColor={colors["muted-foreground"]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {loginErrors.email && (
                <Text style={styles.errorText}>{loginErrors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors["muted-foreground"] }]}>
                Contraseña
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors["muted"],
                      color: colors["foreground"],
                      borderColor: loginErrors.password ? "#ef4444" : colors["border"],
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colors["muted-foreground"]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPwd}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? (
                    <EyeOff size={20} color={colors["muted-foreground"]} />
                  ) : (
                    <Eye size={20} color={colors["muted-foreground"]} />
                  )}
                </TouchableOpacity>
              </View>
              {loginErrors.password && (
                <Text style={styles.errorText}>{loginErrors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: colors["primary"],
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading && <View style={styles.spinner} />}
              <Text
                style={[styles.loginButtonText, { color: colors["primary-foreground"] }]}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors["muted-foreground"] }]}>
              ¿No tienes cuenta?{" "}
              <Text style={{ color: colors["muted-foreground"] }}>Regístrate</Text>
            </Text>

            <Text style={[styles.footerText, { color: colors["muted-foreground"] }]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </View>

          <Text style={[styles.termsText, { color: colors["muted-foreground"] }]}>
            Al iniciar sesión aceptas los{" "}
            <Text
              style={{ color: colors["primary"] }}
              onPress={() => router.push("/terms" as any)}
            >
              Términos
            </Text>{" "}
            y la{" "}
            <Text
              style={{ color: colors["primary"] }}
              onPress={() => router.push("/privacy" as any)}
            >
              Política de Privacidad
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
    position: "relative",
  },
  themeToggleContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
  },
  divider: {
    borderTopWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    marginRight: 8,
  },
  eyeButton: {
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "transparent",
    borderTopColor: "currentColor",
    borderRadius: 8,
    marginRight: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 14,
  },
});
