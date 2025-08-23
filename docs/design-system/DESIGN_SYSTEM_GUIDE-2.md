# Onfit — Guía definitiva del sistema de diseño
*Última revisión: 2025-08-23T09:59:55.371298 UTC*

> Este documento explica **cómo está montado el sistema de diseño** en el monorepo,
> dónde vive cada pieza, cómo se estiliza **web y native**, cómo crear variantes,
> cómo envolver componentes, cómo funcionan **los tokens**, el **theme bridge**,
> y cómo mantener los estilos **shadcn** “de serie” sin romper el ecosistema.
>
> Está pensado para que cualquier persona (o tú futuro) pueda mantenerlo con confianza,
> y para alinear criterios con IA/coder assistants.

---

## 0) Mapa mental rápido
- **Tokens → Theme → Primitivas → Componentes con variantes → Páginas/Pantallas**
- **Web** usa Tailwind + componentes shadcn (clases utilitarias, sin CSS “suelto” salvo lo mínimo en `globals.css`).  
- **Native** usa **NativeWind** (Tailwind en RN) + primitivas RN envueltas con las mismas **APIs de variantes**.
- **Theme Bridge**: una capa ligera que **sincroniza tokens** con Tailwind (web y native) y con el `ThemeProvider`/hooks.
- **Variantes**: `cva` o `tailwind-variants` para definir tamaños, estado, intent, etc. **Una única fuente** compartida.
- **Wrappers**: capa UI que estandariza API (props) y usa web/native internamente (o uno cross-platform).

---

## 1) Estructura del repo (orientativa)
> Ajusta nombres si en tu repo difieren; mantén **la idea** y los límites entre capas.

```
apps/
  web/                # Next.js (o Expo Web) + shadcn/ui + Tailwind
    app/              # rutas (app router) o pages/
    styles/globals.css
    tailwind.config.ts
    postcss.config.js
  native/             # Expo + expo-router + NativeWind
    app/              # rutas (expo-router)
    babel.config.js
    index.js / app.tsx
packages/
  tokens/             # tokens de diseño (TS/JSON)
    src/index.ts
  tailwind-config/    # configuración compartida (importa tokens)
    tailwind.shared.ts
  ui/                 # librería de UI cross (wrappers + variantes)
    src/primitives/   # <View/> <Text/> etc. extendidos
    src/components/   # Button, Input, Card, Tabs...
    src/themes/       # ThemeProvider, ThemeBridge, hooks
  icons/              # set de iconos si aplica
  utils/              # helpers comunes
```

### Import aliases (recomendado)
- `@tokens` → `packages/tokens/src`
- `@ui` → `packages/ui/src`
- `@theme` → `packages/ui/src/themes`
- `@icons` → `packages/icons/src`

Configúralos en `tsconfig.json` de cada app y en Babel (native).

---

## 2) Tokens de diseño (la “verdad”)
Los **tokens** definen la **identidad visual** y los valores reutilizables:
- **colors** (roles semánticos: `bg`, `fg`, `muted`, `primary`, `success`, `warning`, `destructive`)
- **space** (4, 8, 12, 16… en `rem`/`px` equivalentes)
- **radii**, **borderWidth**, **zIndex**
- **font** (familias, tamaños, weights, leading, tracking)
- **shadow**, **opacity**
- **durations** (transiciones), **easings**

### Ejemplo `packages/tokens/src/index.ts`
```ts
export const colors = {
  // Paleta base
  slate: {
    1: "#0b0c0e",
    2: "#111316",
    3: "#171a1e",
    9: "#2c313a",
    12: "#f6f7f9",
  },

  // Roles semánticos (light)
  light: {
    bg: "white",
    fg: "#0b0c0e",
    muted: "#f2f3f5",
    border: "#e5e7eb",
    primary: "#0ea5e9",
    success: "#10b981",
    warning: "#f59e0b",
    destructive: "#ef4444",
  },

  // Roles semánticos (dark)
  dark: {
    bg: "#0b0c0e",
    fg: "#f6f7f9",
    muted: "#171a1e",
    border: "#2c313a",
    primary: "#38bdf8",
    success: "#34d399",
    warning: "#fbbf24",
    destructive: "#f87171",
  },
};

export const space = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const radii = {{ xs: 4, sm: 6, md: 8, lg: 12, xl: 16, full: 9999 }};

export const font = {
  family: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    mono: "JetBrains Mono, ui-monospace, SFMono-Regular",
  },
  size: {{ xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24 }},
  weight: {{ regular: "400", medium: "500", semibold: "600", bold: "700" }},
  leading: {{ tight: 1.1, snug: 1.25, normal: 1.5 }},
  tracking: {{ tight: -0.01, normal: 0, wide: 0.02 }},
};

export const durations = {{ fast: 120, normal: 200, slow: 320 }};
export const easings = {{ standard: "cubic-bezier(0.2, 0, 0, 1)" }};
```

> **Regla:** Los tokens **no** conocen de frameworks.
> No escribas clases Tailwind ni estilos de RN aquí.
> Este paquete se importa desde Tailwind (web y native) y desde el **Theme Bridge**.

---

## 3) Tailwind (web + native) desde tokens
### Web (`apps/web/tailwind.config.ts`)
```ts
import shared from "@tailwind-config/tailwind.shared";

export default {
  ...shared({ platform: "web" }),
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
```

### Native (`apps/native/tailwind.config.js`)
```js
const shared = require("@tailwind-config/tailwind.shared").default;

module.exports = {
  ...shared({ platform: "native" }),
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
```

### Config compartida (`packages/tailwind-config/tailwind.shared.ts`)
```ts
import {{ colors, space, radii, font }} from "@tokens";

type Opts = {{ platform: "web" | "native" }};

export default function shared({{ platform }}: Opts) {{
  // Helpers: traducir tokens → tailwind theme
  const spacing = Object.fromEntries(Object.entries(space).map(([k,v]) => [k, `${{v}}px`]));
  const radius = Object.fromEntries(Object.entries(radii).map(([k,v]) => [k, `${{v}}px`]));

  return {{
    theme: {{
      extend: {{
        spacing,
        borderRadius: radius,
        fontFamily: {{
          sans: [font.family.sans],
          mono: [font.family.mono],
        }},
        colors: {{
          // Usamos roles semánticos; el Theme Bridge decidirá light/dark en runtime
          bg: "rgb(var(--bg) / <alpha-value>)",
          fg: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--muted) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          primary: "rgb(var(--primary) / <alpha-value>)",
          success: "rgb(var(--success) / <alpha-value>)",
          warning: "rgb(var(--warning) / <alpha-value>)",
          destructive: "rgb(var(--destructive) / <alpha-value>)",
        }},
      }},
    }},
    plugins: [require("tailwindcss-animate")],
  }};
}}
```

> En **web** las variables `--bg`, `--fg`, etc. se definen en `:root` (o `.dark`) por el **Theme Bridge**.  
> En **native**, **NativeWind** interpreta las clases y resuelve las variables vía su proveedor de theme (ver siguiente sección).

---

## 4) Theme Bridge (sincroniza runtime)
Objetivo: **mismo API de theme** en web y native con los mismos tokens.

### API
- `<ThemeProvider initialTheme="system" />`
- `useTheme()` → `{ theme, setTheme, isDark, tokens }`
- Variables CSS (web) / Context (native) para que Tailwind/NativeWind resuelvan colores por roles.

### Implementación base (`packages/ui/src/themes/ThemeProvider.tsx`)
```tsx
import * as React from "react";
import {{ Platform }} from "react-native";
import {{ colors }} from "@tokens";

type ThemeName = "light" | "dark" | "system";
type Ctx = {
  theme: Exclude<ThemeName, "system">;
  setTheme: (t: ThemeName) => void;
  isDark: boolean;
  tokens: typeof colors;
};
const ThemeCtx = React.createContext<Ctx | null>(null);

export function ThemeProvider({
  initialTheme = "system",
  children,
}: {
  initialTheme?: ThemeName;
  children: React.ReactNode;
}) {
  const [resolved, setResolved] = React.useState<"light"|"dark">("light");

  React.useEffect(() => {
    if (initialTheme === "system") {
      const mq = typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
      const apply = (dark: boolean) => setResolved(dark ? "dark" : "light");
      if (mq) {
        apply(mq.matches);
        const fn = (e: MediaQueryListEvent) => apply(e.matches);
        mq.addEventListener("change", fn);
        return () => mq.removeEventListener("change", fn);
      } else {
        // Native: usa Appearance
        try {
          const {{ Appearance }} = require("react-native");
          const scheme = Appearance.getColorScheme();
          setResolved(scheme === "dark" ? "dark" : "light");
          const sub = Appearance.addChangeListener(({ colorScheme }) =>
            setResolved(colorScheme === "dark" ? "dark" : "light")
          );
          return () => sub.remove();
        } catch {{}}
      }
    } else {
      setResolved(initialTheme);
    }
  }, [initialTheme]);

  // Exponer tokens por tema
  const role = resolved === "dark" ? colors.dark : colors.light;

  // WEB: escribir variables CSS (NativeWind no usa CSS, pero podemos mantener una sola API mental)
  React.useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const root = document.documentElement;
      const setVar = (name: string, hex: string) => {
        // pasar hex a r g b
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        root.style.setProperty(`--${{name}}`, f"{r} {g} {b}");
      };
      setVar("bg", role.bg);
      setVar("fg", role.fg);
      setVar("muted", role.muted);
      setVar("border", role.border);
      setVar("primary", role.primary);
      setVar("success", role.success);
      setVar("warning", role.warning);
      setVar("destructive", role.destructive);
      root.classList.toggle("dark", resolved === "dark");
    }
  }, [resolved, role]);

  const ctx: Ctx = {
    theme: resolved,
    setTheme: () => {}, // opcional: controlar tema manualmente
    isDark: resolved === "dark",
    tokens: colors,
  };

  return <ThemeCtx.Provider value={ctx}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
};
```

> **Punto clave:** No “pintas” colores hardcoded. Usas **roles** en clases Tailwind (`bg-bg text-fg`) que resuelven a light/dark **en runtime**.

---

## 5) shadcn/ui (web) — cómo mantenerlo “de serie”
- **Nunca** escribas CSS suelto para modificar un componente shadcn: **overridea tokens** o **amplía** clases en un wrapper propio.
- Mantén los componentes shadcn **generados** en `apps/web/components/ui/*` (o en `packages/ui/src/web/*` si monorepo).  
- **Base global** (`globals.css`):
  - `@tailwind base; @tailwind components; @tailwind utilities;`
  - Define custom properties mínimas si el generador lo necesita (`--radius`, etc.), conectándolas con tokens.
- Si cambias un color de marca: hazlo en **tokens** → Tailwind comparte todo automáticamente.
- Si hay que “parchear” el markup de shadcn: crea un **wrapper** en `packages/ui/src/components` con tu API estable y deja el shadcn original intacto.

---

## 6) Native (Expo + NativeWind)
- **No CSS**: solo clases Tailwind vía **NativeWind** (`className` en RN).
- Para UI states complejos usa **tailwind-variants** o **cva** (exports neutrales) y aplícalos en ambos mundos.
- Evita `StyleSheet.create` salvo casos performance críticos; si lo usas, **no** dupliques constantes (usa tokens).

### Babel (native) — recordatorio
```js
// apps/native/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // otros plugins…
      "react-native-reanimated/plugin", // SIEMPRE el último
    ],
  };
};
```

---

## 7) Variantes (cva/tailwind-variants)
Define las variantes **una vez** y úsalas en web/native.

### Ejemplo con `tailwind-variants` (recomendado cross)
```ts
// packages/ui/src/components/button.variants.ts
import {{ tv }} from "tailwind-variants";

export const buttonStyles = tv({
  base: "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-border disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    intent: {
      primary: "bg-primary text-bg hover:opacity-90",
      ghost: "bg-transparent border border-border text-fg hover:bg-muted",
      destructive: "bg-destructive text-bg hover:opacity-90",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});
```

### Uso en web
```tsx
<button className={buttonStyles({ intent: "ghost", size: "sm" })}>…</button>
```

### Uso en native
```tsx
import {{ Pressable, Text }} from "react-native";
import {{ buttonStyles }} from "./button.variants";
import {{ styled }} from "nativewind";

const XPressable = styled(Pressable);
const XText = styled(Text);

export function Button({ intent, size, children, ...rest }) {
  const cls = buttonStyles({ intent, size });
  return (
    <XPressable className={cls} {...rest}>
      <XText>{{children}}</XText>
    </XPressable>
  );
}
```

> **Regla:** No copies clases en cada plataforma. **Usa el mismo generador de variantes**.

---

## 8) Wrapping (envolver componentes)
Objetivo: **API estable** (props limpias), y por dentro decidir la tecnología.

### Patrón
- Crea **primitivas** (`View`, `Text`, `Input`, `Pressable`) **extendidas** en `packages/ui/src/primitives` con soporte `className` (native) y clases (web).
- Encima, crea **componentes** (Button, Card, Sheet…) que usan **las mismas variantes**.
- Si para web tiras de un shadcn concreto, envuélvelo en tu componente y **no exportes** el interno directamente.

**Beneficio**: Cambiar shadcn ↔ propio ↔ RN no rompe el resto del código.

---

## 9) Dónde poner estilos (y dónde no)
- **Sí**: clases Tailwind en componentes, generadas por variantes si hay estados/tamaños.
- **Sí**: tokens → Tailwind theme → variables → clases.
- **Sí** (web): `globals.css` mínimo (reset, utilidades globales que no existan en TW, fuentes).
- **No**: CSS suelto por archivo por componente web (rompe consistencia y el motor de utilidades).
- **No**: valores mágicos hardcoded (usa tokens/variants).
- **No**: duplicar definiciones de colores/espaciados en RN `StyleSheet`.

---

## 10) Rutas y páginas
### Native (Expo Router)
- Estructura de archivos dentro de `apps/native/app/` (grupos como `(public)`, `(protected)`).
- **Login** debe estar **fuera** del `AuthGuard`. No metas `/login` dentro de un guard dinámico.
- Estilos: via `className`. Evita inline salvo casos puntuales.
- Navega con `Link`, `router.push()`.

### Web (Next.js o Expo Web)
- Crea rutas en `app/` (o `pages/` si legacy).
- Usa componentes de `@ui` para no divergir estilos.
- Mantén el layout general con clases utilitarias.

---

## 11) Recetas

### A) Cambiar color de marca
1. Edita `packages/tokens/src/index.ts` → `colors.light.primary` y `colors.dark.primary`.
2. Reinicia dev server.  
3. Verifica botones/intents (deberían heredar).

### B) Añadir espaciado 18
1. `space[4.5] = 18` en tokens.
2. Tailwind shared ya traduce → podrás usar `p-4.5` en ambos mundos.

### C) Crear un nuevo componente con variantes
1. Define `*.variants.ts` con `tv(...)`.
2. Implementa `Component.web.tsx` (si usas shadcn) y `Component.native.tsx` (RN), o uno único cross con primitivas `@ui`.
3. Exporta desde `packages/ui/src/components/index.ts`.

### D) Wrap de un tercero (ej. datepicker web + RNDateTimePicker)
1. Crea `DatePicker.tsx` en `@ui` con API única.
2. Usa `Platform.select` para resolver implementación interna.
3. Estiliza con variantes/clases, no con CSS suelto.

### E) Dark mode
- No hardcodees `#000/#fff`. Usa `bg`, `fg`, `muted`, etc.
- Revisa contrastes en `destructive`, `warning` con `text-bg` vs `text-fg` según caso.

---

## 12) Calidad, lint y DX
- **Prettier + Tailwind plugin**: ordena clases automáticamente.
- **ESLint**: evita estilos inline y valores mágicos.
- **Storybook** (opcional): monta en `packages/ui` para visualizar variantes.
- **Snapshots**: útil para asegurar que clases no cambian accidentalmente.

---

## 13) Gotchas comunes
- **AuthGuard loop**: nunca incluyas `/login` dentro del guard.
- **Reanimated**: plugin **último** en Babel.
- **expo-router/babel**: desde SDK 50 usa `babel-preset-expo` (no el plugin deprecado).
- **Env**: no accedas a variables de entorno en componentes básicos de UI.

---

## 14) Checklist para PRs de UI
- [ ] No hay CSS suelto nuevo (web)
- [ ] No hay `StyleSheet` con colores/espaciados mágicos
- [ ] Variantes definidas/extendidas en un único sitio
- [ ] Tokens actualizados si hace falta (y solo ahí)
- [ ] Funciona en light/dark
- [ ] Funciona en web/native
- [ ] No hay cambios innecesarios en shadcn original (usar wrapper)

---

## 15) FAQ
**¿Puedo usar inline styles?**  
Solo si es temporal o muy puntual. Prefiere siempre variantes/clases.

**¿Cómo añado una fuente nueva?**  
Declárala en tokens → tailwind shared (fontFamily) → `globals.css` (web) + carga en Expo (native).
