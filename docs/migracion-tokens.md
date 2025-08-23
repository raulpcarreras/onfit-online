# Migración a Tokens + Wrappers del Design System (ONFIT)

**Objetivo:** Unificar estilos y APIs de UI en web (Next.js) usando **CSS tokens** centrales y **wrappers cross‑platform** (web/native) que exponen una API consistente (`onPress`, `variant`, etc.).  
**Ámbito de esta fase:** **Web primero** (Next.js). La parte **Native/Expo** se aborda en una fase 2.

---

## 0) Resultado esperado

- **Una sola fuente de verdad** para colores, tipografía y radii: `packages/design-system/tokens/index.css`.
- **Tailwind** leyendo **variables CSS** (HSL) desde los tokens.
- **Wrappers** en `packages/design-system/components/*` con API unificada:
  - `Button` → siempre `onPress`, `variant`, `size`.
  - `Input`  → coherente (errores, disabled, etc.).
  - `Select` → **string-in / string-out** (adaptador a `Option` interno).
- **shadcn/ui** sigue existiendo en `packages/design-system/ui/*`, pero **no se importa directamente** desde las apps; se usa a través de los wrappers.
- **Reglas anti‑regresión**: ESLint prohíbe `<button>` y `onClick` en apps; codemod aplicado.

---

## 1) Estructura objetivo

```
packages/design-system/
├─ tokens/
│  └─ index.css                # ← CSS Variables (tokens) Light/Dark
├─ ui/                         # shadcn/ui canónico (no tocar en apps)
│  ├─ button.tsx
│  ├─ input.tsx
│  └─ select.tsx
├─ components/                 # Wrappers cross-platform
│  ├─ Button/
│  │  ├─ index.web.tsx
│  │  ├─ index.native.tsx      # (stub/pendiente si aún no existe)
│  │  └─ index.ts              # Barrel
│  ├─ Input/
│  │  ├─ index.web.tsx
│  │  ├─ index.native.tsx
│  │  └─ index.ts
│  ├─ Select/
│  │  ├─ Select.web.tsx
│  │  ├─ Select.native.tsx
│  │  └─ index.ts
│  └─ index.ts                 # Re-export de todos los wrappers
└─ index.ts                    # Re-export raíz del package
```

> **Nota:** Si ya tenéis parte de esta estructura, reutilizad lo existente. El objetivo es **centralizar tokens** y **forzar el uso de wrappers** desde las apps.

---

## 2) Tokens CSS (única fuente de verdad)

**Crear** `packages/design-system/tokens/index.css`:

```css
:root {
  /* Base */
  --radius: 0.5rem;

  /* Light theme */
  --background: 0 0% 98%;
  --foreground: 222.2 47.4% 11.2%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;

  --primary: 38 92% 50%;
  --primary-foreground: 0 0% 100%;

  --secondary: 240 5% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 240 5% 96%;
  --muted-foreground: 215 16% 47%;

  --accent: 38 92% 50%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 215 20.2% 65.1%;
}

.dark {
  /* Dark theme */
  --background: 240 7% 8%;
  --foreground: 0 0% 96%;

  --card: 240 6% 10%;
  --card-foreground: 0 0% 96%;

  --popover: 240 6% 10%;
  --popover-foreground: 0 0% 96%;

  --primary: 38 92% 50%;
  --primary-foreground: 0 0% 0%;

  --secondary: 240 3% 15%;
  --secondary-foreground: 0 0% 96%;

  --muted: 240 3% 15%;
  --muted-foreground: 215 16% 72%;

  --accent: 38 92% 50%;
  --accent-foreground: 240 10% 3.9%;

  --destructive: 0 72% 44%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 217.2 32.6% 17.5%;
}
```

### 2.1 Importar tokens en la web

En `apps/web/app/globals.css`, **al principio**, añadid:

```css
@import "@repo/design/tokens/index.css";
```

> Luego **eliminad** cualquier duplicado de variables que tengáis en `globals.css`. Las variables “canónicas” deben venir **solo** desde `tokens/index.css`.

---

## 3) Tailwind: mapear a variables

Aseguraos de que el `tailwind.config.ts` de **apps/web** (y si procede, de `packages/design-system`) mapea los colores a CSS vars HSL:

```ts
// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/design-system/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

> **Nota rendimiento:** revisad que `content` **no** matchee todo `node_modules`. La ruta `../../packages/design-system/**/*.{ts,tsx}` es correcta.

---

## 4) Wrappers del Design System (web)

### 4.1 `Button` (unificado con `onPress`)

`packages/design-system/components/Button/index.web.tsx`:

```tsx
import * as React from "react";
import { cn } from "@repo/design/ui/utils"; // si tenéis util cn
import { buttonVariants as base } from "@repo/design/ui/button"; // estilos base shadcn
import type { VariantProps } from "class-variance-authority";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof base> & {
    onPress?: React.MouseEventHandler<HTMLButtonElement>;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, onPress, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base({ variant, size }), className)}
        onClick={onPress ?? onClick}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

`packages/design-system/components/Button/index.ts`:

```ts
export * from "./index.web";
```

> En native, `index.native.tsx` debe exponer la **misma API** pero usando `Pressable` y mapeando `onPress` nativo.

---

### 4.2 `Input` (web)

`packages/design-system/components/Input/index.web.tsx`:

```tsx
import * as React from "react";
import { Input as UIInput } from "@repo/design/ui/input";

export type InputProps = React.ComponentProps<typeof UIInput>;

export function Input(props: InputProps) {
  return <UIInput {...props} />;
}
```

`packages/design-system/components/Input/index.ts`:

```ts
export * from "./index.web";
```

---

### 4.3 `Select` (web) — **adaptador string ⇄ Option**

Supongamos que `@repo/design/ui/select` usa `Option = { value: string; label: string }` y `Root` espera `value?: Option` y `onValueChange?: (opt: Option) => void`.

`packages/design-system/components/Select/Select.web.tsx`:

```tsx
import * as React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/ui/select";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  disabled,
  className,
}: SelectProps) {
  const selected = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [value, options]
  );

  return (
    <UISelect
      // @ts-expect-error: UISelect espera Option|null
      value={selected}
      // UISelect devuelve Option → devolvemos string al consumidor
      onValueChange={(opt: any) => onChange?.(opt?.value ?? "")}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          // @ts-expect-error: SelectItem espera Option
          <SelectItem key={opt.value} value={opt} disabled={opt.disabled}>
            {({ pressed }: any) => <span>{opt.label}</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
}
```

`packages/design-system/components/Select/index.ts`:

```ts
export * from "./Select.web";
```

> **Importante:** Ese `({ pressed }) => ...` evita el error de tipos cuando `SelectItem` usa `Pressable` bajo el capó y soporta “render prop”. Si vuestra implementación acepta `children` directos `string`, podéis simplificar a `{opt.label}`.

---

### 4.4 Re-export central de wrappers

`packages/design-system/components/index.ts`:

```ts
export * from "./Button";
export * from "./Input";
export * from "./Select";
```

`packages/design-system/index.ts` (raíz del package):

```ts
export * from "./components";
// Si necesitáis exponer utilidades comunes, exportadlas aquí también.
```

> **Regla de oro:** En **apps**, importad **solo** desde `@repo/design/components` (o `@repo/design` si re‑exportáis arriba), **nunca** desde `@repo/design/ui/*`.

---

## 5) Anti‑regresión

### 5.1 ESLint (web): prohibir `<button>` y `onClick`

`.eslintrc.cjs` (apps/web):

```js
module.exports = {
  // ...
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: 'JSXOpeningElement[name.name="button"]',
        message: "Usa <Button/> del design system, no <button>.",
      },
      {
        selector:
          'JSXAttribute[name.name="onClick"]',
        message:
          "Usa onPress en el Button del design system; en otros componentes maneja el wrapper correspondiente.",
      },
    ],
  },
};
```

### 5.2 Codemod (opcional, para acelerar migración)

```bash
# onClick -> onPress en Button
npx jscodeshift -t ./codemods/onClick-to-onPress.js apps/web

# imports ui/* -> components/*
npx jscodeshift -t ./codemods/design-ui-to-components.js apps/web
```

> Puedes mantener estos codemods en `tooling/codemods/`. Si no quieres codemods, hazlo con una búsqueda/replace controlada.

---

## 6) Sustitución por pantallas (propuesta)

1) **Auth** (`/login`, `/register`, `/forgot-password`, `/reset-password`)  
2) **Admin** (Topbar/Sidebar, `/admin/users`)  
3) **User** (dashboard widgets principales)  
4) **Shared pages** (settings, profile)  

En cada pantalla: sustituir `<button>`, `<input>`, selects nativos, y clases pegadas por wrappers + variantes.

---

## 7) Pruebas

- **Lint:** `pnpm --filter web lint`
- **Types:** `pnpm --filter web typecheck` (o `tsc --noEmit`)
- **Dev:** `pnpm --filter web dev`
- **Build:** `pnpm --filter web build`

### Casos a validar
- Tema claro/oscuro (tokens aplican).
- `Button`: `variant`, `size`, `disabled`, `onPress`.
- `Input`: estados (focus, error si procede).
- `Select`: cambio de valor, disabled, opciones dinámicas.

---

## 8) Rollback rápido

- Eliminar import de tokens en `globals.css` y restaurar variables antiguas (si hiciste copia).
- Revertir wrapper imports a `@repo/design/ui/*` o HTML **solo si es imprescindible** (no recomendado).
- Revertir ESLint temporalmente si bloquea el dev.

> Recomendación: trabaja en ramas pequeñas por pantalla para que el rollback sea trivial (git revert o descartar PR).

---

## 9) FAQ

**¿Por qué tokens en CSS y no JS?**  
Para web, CSS vars + Tailwind es el camino más directo y performante. Para native, se puede exponer un espejo en JS en la fase 2.

**¿Qué pasa con Expo/Native?**  
En fase 1 no tocamos nada. En fase 2 crearemos `index.native.tsx` coherentes y, si hace falta, un `theme.ts` en JS con los mismos valores.

**¿Puedo seguir usando shadcn/ui?**  
Sí, pero **solo dentro** de los wrappers del design system. Las apps no deberían importar `@repo/design/ui/*` directamente.

---

## 10) Checklist de PR

- [ ] `tokens/index.css` creado e importado en `globals.css` (web).
- [ ] Tailwind mapeado a variables (sin duplicados en `globals.css`).
- [ ] `Button`, `Input`, `Select` wrappers creados y exportados.
- [ ] Apps usan **solo** `@repo/design/components/*`.
- [ ] ESLint anti‑regresión activo y pasa.
- [ ] Dev y Build OK.
- [ ] Screens migradas (auth/admin/user) con pruebas manuales.
- [ ] Docs (este archivo) enlazado en el PR.

---

## 11) Próximos pasos (fase 2 – Native)

- Añadir `index.native.tsx` equivalentes para `Button`, `Input`, `Select` con `Pressable`/`TextInput`/picker nativo.
- Exponer un `theme.ts` (JS) con los mismos tokens para RN.
- Ajustar `tailwind.config` de NativeWind con una paleta equivalente.

---

**Fin de la guía.**  
Pásale este archivo a Cursor y que siga los pasos en orden. Si algo no cuadra con vuestro árbol real, adaptad rutas pero **mantened los principios**: **tokens únicos** + **wrappers únicos** + **apps consumen wrappers**.
