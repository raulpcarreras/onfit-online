"use client";
import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Dumbbell, Sun, Moon, Monitor } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/design/ui/dialog";
import { Input, InputField, InputIcon } from "@repo/design/ui/input";
import { Button } from "@repo/design/ui/button";
import { Checkbox } from "@repo/design/ui/checkbox";
import { Text } from "@repo/design/ui/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@repo/design/ui/dropdown-menu";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [name, setName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPwd, setShowSignUpPwd] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; terms?: string }>({});
  const { setTheme, theme, resolvedTheme } = useTheme() as any;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";
  const isDark = mounted ? (resolvedTheme === "dark") : false;
  const accent = "hsl(var(--accent))";

  const getPasswordStrength = (value: string) => {
    const lengthOk = (value ?? "").length >= 8;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    const criteria = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    const score = Math.max(0, Math.min(4, (lengthOk ? 1 : 0) + criteria));
    let color: string = "bg-red-500";
    let label: string = "Baja";
    if (score >= 4) {
      color = "bg-green-500";
      label = "Muy alta";
    } else if (score === 3) {
      color = "bg-green-500";
      label = "Alta";
    } else if (score === 2) {
      color = "bg-amber-400";
      label = "Media";
    } else {
      color = "bg-red-500";
      label = "Baja";
    }
    return { score, color, label };
  };

  const signUpSchema = useMemo(() => z.object({
    name: z.string().trim().optional(),
    email: z.string().email("Email no válido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Debes aceptar los términos" }) }),
  }).refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  }), []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación simple de login
    const errs: typeof loginErrors = {};
    if (!email) errs.email = "Campo requerido";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email no válido";
    if (!password) errs.password = "Campo requerido";
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoadingSignIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role", { head: false })
        .eq("user_id", user?.id)
        .single();
      const role = profile?.role === "user" ? "client" : profile?.role;
      if (role === "admin") router.replace("/admin");
      else if (role === "trainer") router.replace("/trainer");
      else router.replace("/client");
    } catch (err: any) {
      alert(err?.message ?? "Error al iniciar sesión");
    } finally {
      setLoadingSignIn(false);
    }
  };

  const onSignUp = async () => {
    // Validación con zod
    const parse = signUpSchema.safeParse({
      name,
      email,
      password: signUpPassword,
      confirm: confirmPassword,
      terms: termsAccepted,
    });
    if (!parse.success) {
      const fieldErrors: typeof errors = {} as any;
      for (const issue of parse.error.issues) {
        const key = issue.path[0] as keyof typeof fieldErrors;
        fieldErrors[key] = issue.message as any;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      setLoadingSignUp(true);
      const { error } = await supabase.auth.signUp({ email, password: signUpPassword });
      if (error) throw error;
      const { data: u } = await supabase.auth.getUser();
      if (u.user?.id) {
        await supabase
          .from("profiles")
          .upsert(
            { user_id: u.user.id, email: u.user.email ?? null, name: name || null },
            { onConflict: "user_id", ignoreDuplicates: true },
          );
      }
      setOpenSignUp(false);
      router.replace("/client");
    } catch (err: any) {
      alert(err?.message ?? "Error al crear cuenta");
    } finally {
      setLoadingSignUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm surface-card p-5">
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center">
                <Dumbbell className="size-5 text-amber-400" />
              </div>
              <h1 className="text-xl font-semibold">ONFIT ONLINE</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="iconGhostAuto" size="sm" className="p-2 h-auto btn-ghost-icon shrink-0 z-10 min-w-[36px]" enableRipple>
                  {!mounted ? (
                    <Monitor className="size-5" style={{ color: 'hsl(var(--brand-accent))', stroke: 'hsl(var(--brand-accent))' }} strokeWidth={2} />
                  ) : themeSetting === "light" ? (
                    <Sun className="size-5" style={{ color: 'hsl(var(--brand-accent))', stroke: 'hsl(var(--brand-accent))' }} strokeWidth={2} />
                  ) : themeSetting === "dark" ? (
                    <Moon className="size-5" style={{ color: '#ffffff', stroke: '#ffffff' }} strokeWidth={2} />
                  ) : (
                    <Monitor className="size-5" style={{ color: 'hsl(var(--brand-accent))', stroke: 'hsl(var(--brand-accent))' }} strokeWidth={2} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 surface-popover btn-ghost-icon">
                <DropdownMenuLabel>
                  <Text className="text-xs text-muted-foreground">Selecciona tema</Text>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={themeSetting} onValueChange={(v) => setTheme(v as any)}>
                  <DropdownMenuRadioItem value="light">
                    <Sun className="size-3 mr-2" style={{ color: "hsl(var(--accent))", stroke: "hsl(var(--accent))" }} />
                    <Text className="text-sm">Claro</Text>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon className="size-3 mr-2" style={{ color: "hsl(var(--accent))", stroke: "hsl(var(--accent))" }} />
                    <Text className="text-sm">Oscuro</Text>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Monitor className="size-3 mr-2" style={{ color: "hsl(var(--accent))", stroke: "hsl(var(--accent))" }} />
                    <Text className="text-sm">Sistema</Text>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4 divider-muted" />
          <p className="mt-2 text-xs text-muted-foreground">
            Accede con tus credenciales para continuar con tu progreso.
          </p>
        </div>


        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <Input
              variant="outline"
              size="md"
              className={`mt-1 input-base ${loginErrors.email ? "border-red-500" : ""}`}
            >
              <InputField
                placeholder="tu@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail as any}
              />
            </Input>
            {loginErrors.email && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Contraseña</label>
            <div className="mt-1 flex items-stretch gap-2">
              <Input
                variant="outline"
                size="md"
                className={`flex-1 input-base ${loginErrors.password ? "border-red-500" : ""}`}
              >
                <InputField
                  placeholder="••••••••"
                  secureTextEntry={!showPwd}
                  value={password}
                  onChangeText={setPassword as any}
                />
              </Input>
              <Button
                type="button"
                variant="iconGhostAuto"
                size="sm"
                className="p-2 h-auto btn-ghost-icon shrink-0 z-10 min-w-[36px]"
                enableRipple
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onPress={() => setShowPwd((v) => !v)}
              >
                {showPwd ? (
                  <EyeOff
                    className="size-5"
                    style={{ color: 'hsl(var(--brand-accent))', stroke: 'hsl(var(--brand-accent))' }}
                    strokeWidth={2}
                  />
                ) : (
                  <Eye
                    className="size-5"
                    style={{ color: 'hsl(var(--brand-accent))', stroke: 'hsl(var(--brand-accent))' }}
                    strokeWidth={2}
                  />
                )}
              </Button>
            </div>
            {loginErrors.password && (
              <p className="mt-1 text-xs text-red-500">{loginErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingSignIn}
            className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-medium hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loadingSignIn && (
              <span className="inline-block size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {loadingSignIn ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-xs flex items-center justify-between">
          <a href="#" className="link-muted">
            Olvidé mi contraseña
          </a>
          <button onClick={() => setOpenSignUp(true)} className="link-muted">
            Crear cuenta nueva
          </button>
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground">
          Al continuar aceptas los Términos y la Política de Privacidad.
        </p>
      </div>

      {/* Sign Up Dialog */}
      <Dialog open={openSignUp} onOpenChange={setOpenSignUp}>
        <DialogContent
          onInteractOutside={(e: any) => e.preventDefault()}
          onEscapeKeyDown={(e: any) => e.preventDefault()}
          className="w-[95%] max-w-sm surface-card p-5"
        >
          <DialogHeader>
            <DialogTitle>Crear cuenta</DialogTitle>
            <DialogDescription>
              Regístrate con los datos básicos. Podrás completar tu perfil más tarde.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 divider-muted" />

          <div className="space-y-3 mt-2">
            <Input variant="outline" size="md" className="input-base">
              <InputField
                placeholder="Tu nombre"
                value={name}
                onChangeText={setName as any}
              />
            </Input>
            <div>
              <Input variant="outline" size="md" className={`input-base ${errors.email ? "border-red-500" : ""}`}>
                <InputField
                  placeholder="tu@correo.com"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail as any}
                />
              </Input>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <Input variant="outline" size="md" className={`input-base ${errors.password ? "border-red-500" : ""}`}>
                <InputField
                  placeholder="Contraseña (mín. 8 caracteres)"
                  secureTextEntry={!showSignUpPwd}
                  value={signUpPassword}
                  onChangeText={((v: string) => setSignUpPassword(v)) as any}
                />
                <InputIcon onPress={() => setShowSignUpPwd((v) => !v)}>
                  {showSignUpPwd ? (
                    <EyeOff className="h-[18px] w-[18px] accent-icon" />
                  ) : (
                    <Eye className="h-[18px] w-[18px] accent-icon" />
                  )}
                </InputIcon>
              </Input>
              {(() => {
                const { score } = getPasswordStrength(signUpPassword);
                const bars = [0,1,2,3];
                return (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {bars.map((i) => {
                        const active = i < score;
                        const color = score >= 3 ? "bg-green-500" : score === 2 ? "bg-amber-400" : "bg-red-500";
                        return <div key={i} className={`h-1.5 flex-1 rounded ${active ? color : "bg-[hsl(var(--border))]"}`} />;
                      })}
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">Fortaleza: {getPasswordStrength(signUpPassword).label}</p>
                  </div>
                );
              })()}
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <Input variant="outline" size="md" className={`input-base ${errors.confirm ? "border-red-500" : ""}`}>
                <InputField
                  placeholder="Repite la contraseña"
                  secureTextEntry={!showConfirmPwd}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword as any}
                />
                <InputIcon onPress={() => setShowConfirmPwd((v) => !v)}>
                  {showConfirmPwd ? (
                    <EyeOff className="h-[18px] w-[18px] accent-icon" />
                  ) : (
                    <Eye className="h-[18px] w-[18px] accent-icon" />
                  )}
                </InputIcon>
              </Input>
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>
            <div className="mt-10">
              <label className="mt-[20px] flex items-center gap-3 text-sm text-muted-foreground">
                <Checkbox
                  aria-label="Aceptar términos"
                  checked={termsAccepted}
                  onCheckedChange={(v: any) => setTermsAccepted(!!v)}
                  className="h-5 w-5 border-amber-400 data-[state=checked]:bg-amber-400 web:focus-visible:ring-amber-400"
                />
                <span>
                  Acepto los <a href="/terminos" target="_blank" className="text-amber-400 hover:underline">Términos</a> y la
                  {' '}
                  <a href="/privacidad" target="_blank" className="text-amber-400 hover:underline">Política de privacidad</a>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <button
              onClick={onSignUp}
              disabled={loadingSignUp}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-medium hover:brightness-95 disabled:opacity-60"
            >
              {loadingSignUp ? "Creando..." : "Crear cuenta"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
