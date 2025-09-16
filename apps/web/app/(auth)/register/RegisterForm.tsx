"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Sun, Moon, Monitor, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@repo/design/components/Button";
import { Input } from "@repo/design/components/Input";
import { ThemeToggle } from "@repo/design/components/ThemeToggle";

export default function RegisterForm() {
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

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const tips = [
      { text: "Al menos 8 caracteres", fulfilled: password.length >= 8 },
      { text: "Al menos una mayúscula", fulfilled: /[A-Z]/.test(password) },
      { text: "Al menos un número", fulfilled: /\d/.test(password) },
      { text: "Al menos un carácter especial", fulfilled: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];
    
    tips.forEach(tip => {
      if (tip.fulfilled) score++;
    });
    
    const labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    return { score, label: labels[score], tips };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    const passwordStrength = getPasswordStrength(formData.password);
    if (passwordStrength.score < 2) {
      newErrors.password = "La contraseña es muy débil";
    }
    
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
            role: "user" // Solo usuarios por defecto
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
            role: "user", // Solo usuarios por defecto
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.warn("Error al crear perfil:", profileError);
          // No es crítico, el usuario ya existe en auth
        }
        
        // 3. Redirigir a la página del usuario
        router.push("/user");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-5 relative">
            {/* Botón de tema posicionado absolutamente en la esquina superior derecha */}
            <ThemeToggle
              className="absolute top-0 right-0 p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-0 z-10"
            />
            
            <div className="flex flex-col items-center text-center">
              {/* Logo adaptativo según tema */}
              {!mounted ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/favicon.png"
                  alt="ONFIT Logo"
                  className="h-12 w-auto object-contain"
                />
              ) : resolvedTheme === "dark" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src="/logos/logo-dark.png" 
                  alt="ONFIT Logo" 
                  className="h-12 w-auto object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src="/logos/logo-light.png" 
                  alt="ONFIT Logo" 
                  className="h-12 w-auto object-contain"
                />
              )}
            </div>
            
            <div className="mt-4 border-t border-border/50" />
            <h2 className="text-xl font-semibold text-center text-foreground mt-4 mb-2">Crear cuenta</h2>
            <p className="text-center text-sm text-muted-foreground">
              Únete a ONFIT y comienza tu transformación fitness
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nombre completo
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full"
              placeholder="Tu nombre completo"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pr-10"
                placeholder="Mínimo 8 caracteres"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => setShowPwd(!showPwd)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Barra de fortaleza de contraseña */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
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
                
                {/* Barra de progreso */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${
                    getPasswordStrength(formData.password).score === 0 ? "bg-red-500 w-1/5" :
                    getPasswordStrength(formData.password).score === 1 ? "bg-orange-500 w-2/5" :
                    getPasswordStrength(formData.password).score === 2 ? "bg-yellow-500 w-3/5" :
                    getPasswordStrength(formData.password).score === 3 ? "bg-blue-500 w-4/5" :
                    "bg-green-500 w-full"
                  }`}></div>
                </div>
                
                {/* Tips */}
                <div className="mt-2 space-y-1">
                  {getPasswordStrength(formData.password).tips.map((tip, index) => (
                    <div key={index} className={`text-xs ${
                      tip.fulfilled ? "text-green-600" : "text-muted-foreground"
                    }`}>
                      {tip.fulfilled ? "✓" : "○"} {tip.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPwd ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full pr-10"
                placeholder="Repite tu contraseña"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botón de registro */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
          
          <div className="mt-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
