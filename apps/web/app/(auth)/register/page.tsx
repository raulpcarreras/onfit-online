"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Dumbbell, Sun, Moon, Monitor, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setTheme, theme, resolvedTheme } = useTheme() as any;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email no válido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    
    // Validación mejorada de contraseña
    const passwordStrength = getPasswordStrength(formData.password);
    if (passwordStrength.score < 2) {
      newErrors.password = "La contraseña es demasiado débil. Debe cumplir al menos 3 criterios de seguridad";
    }
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: "client" // Solo clientes por defecto
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // 2. Insertar datos adicionales en la tabla de perfiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            role: "client", // Solo clientes por defecto
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.warn("Error al crear perfil:", profileError);
          // No es crítico, el usuario ya existe en auth
        }
        
        // 3. Redirigir a la página del cliente
        router.push("/client");
      }
      
    } catch (error: any) {
      console.error("Error de registro:", error);
      
      if (error.message.includes("User already registered")) {
        setErrors({ email: "Este email ya está registrado" });
      } else if (error.message.includes("Password should be at least")) {
        setErrors({ password: "La contraseña debe tener al menos 6 caracteres" });
      } else {
        setErrors({ email: "Error al crear la cuenta" });
      }
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-foreground">ONFIT</span>
                  <span className="text-primary">ONLINE</span>
                </h1>
                <p className="text-xs text-muted-foreground">Tu app de fitness</p>
              </div>
            </div>
            <button
              onClick={() => setTheme(themeSetting === "light" ? "dark" : 
                                     themeSetting === "dark" ? "system" : "light")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
            >
              {themeSetting === "light" ? <Sun className="size-5" /> : 
               themeSetting === "dark" ? <Moon className="size-5" /> : <Monitor className="size-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href="/login"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="size-4 text-muted-foreground" />
            </Link>
            <h2 className="text-lg font-semibold text-foreground">Crear cuenta nueva</h2>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Completa los datos para crear tu cuenta en ONFIT. Después, en el panel de usuario, rellenarás un formulario con los datos necesarios para empezar tu cambio físico.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-sm text-muted-foreground">Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm text-muted-foreground">Contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            {/* Barra de fortaleza de contraseña */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Fortaleza:</span>
                  <span className={`font-medium ${
                    getPasswordStrength(formData.password).score === 0 ? "text-red-500" :
                    getPasswordStrength(formData.password).score === 1 ? "text-orange-500" :
                    getPasswordStrength(formData.password).score === 2 ? "text-yellow-500" :
                    getPasswordStrength(formData.password).score === 3 ? "text-blue-500" :
                    "text-green-500"
                  }`}>
                    {getPasswordStrength(formData.password).label}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getPasswordStrength(formData.password).score === 0 ? "bg-red-500 w-1/5" :
                      getPasswordStrength(formData.password).score === 1 ? "bg-orange-500 w-2/5" :
                      getPasswordStrength(formData.password).score === 2 ? "bg-yellow-500 w-3/5" :
                      getPasswordStrength(formData.password).score === 3 ? "bg-blue-500 w-4/5" :
                      "bg-green-500 w-full"
                    }`}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {getPasswordStrength(formData.password).tips.map((tip, index) => (
                    <div key={index} className={`flex items-center gap-1 ${
                      tip.fulfilled ? "text-green-600" : "text-muted-foreground"
                    }`}>
                      {tip.fulfilled ? "✓" : "○"} {tip.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="text-sm text-muted-foreground">Confirmar contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0"
                aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? (
                  <EyeOff className="size-5 text-muted-foreground" />
                ) : (
                  <Eye className="size-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>



          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loading && (
              <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          Al crear una cuenta aceptas los{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Términos
          </Link>{" "}
          y la{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidad
          </Link>.
        </p>
      </div>
    </div>
  );
}
