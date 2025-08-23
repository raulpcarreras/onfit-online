# ONFIT Design System — Wrappers & Patterns Guide

> **Objetivo:** que cualquier persona (o Cursor) pueda crear, migrar y mantener componentes **cross‑platform** (Web + Native) con una **API única**, manteniendo **consistencia visual** desde tokens y evitando anti‑patrones.

---

## 1) Capas del sistema

```
packages/design-system/
├─ tokens/                      # Fuente de verdad del diseño
│  ├─ css-variables.css         # Variables CSS (web)
│  └─ native.ts                 # Tokens para RN (native)
├─ ui/                          # Base canónica por plataforma
│  ├─ button.tsx                # shadcn (web) / rn-primitives bridge (web/native)
│  ├─ input.tsx
│  ├─ select.tsx
│  ├─ table.tsx
│  └─ …
└─ components/                  # Wrappers de API unificada
   ├─ Button/
   │  ├─ index.web.tsx          # DOM + Tailwind/CSS vars (web)
   │  ├─ index.native.tsx       # RN (Pressable/Text) (native)
   │  └─ index.ts               # Barrel export
   ├─ Input/
   ├─ Select/
   └─ …
```

**Roles:**
- **`tokens/`** → nombres canónicos (`--primary`, `--accent`, etc.) y sus valores.
- **`ui/`** → implementaciones base (shadcn/ui en web, rn‑primitives en ambos).
- **`components/`** → **API única** para la app (`onPress`, `variant`, `size`, etc.).

> En **apps/** (web/native) **NUNCA** se usa HTML/RN crudo: siempre importar desde `@repo/design/components/*`.

---

## 2) Reglas duras (obligatorias)

1. **Web wrapper = DOM** (HTML semántico) + clases Tailwind + variables CSS.
2. **Native wrapper = React Native puro** (Pressable, Text, View). **Sin** HTML, **sin** Tailwind.
3. **Evento único:** `onPress` en todos los wrappers.  
   - Web: mapear `onClick={onPress}`.
   - Native: `onPress` del `Pressable`.
4. **Props compartidas:** `variant`, `size`, `disabled`, `className` (web), `style` (native), etc.
5. **`"use client"`:** en **cualquier** wrapper que:
   - Renderice DOM **interactivo**,
   - Use hooks de React,
   - Reexporte un `ui/*` que ya es cliente.
6. **Tokens siempre:** colores/espaciados **no** se hardcodean en Native; se leen de `tokens/native.ts`.
7. **Sin HTML crudo en apps:** prohibido `<button>`, `<input>`, etc. Usar componentes del design system.
8. **Texto:**
   - **Web (app):** HTML semántico (`h1`, `p`, `span`, etc.).
   - **Native (wrappers):** `<Text>` de RN. Nunca text nodes sueltos dentro de `<View>`.

---

## 3) Patrones base (esqueletos)

### 3.1 Button (API unificada)

**`components/Button/index.web.tsx`**
```tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "bg-transparent hover:bg-accent",
        link: "bg-transparent underline-offset-4 hover:underline text-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

type DOMProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export type ButtonProps = DOMProps &
  VariantProps<typeof buttonVariants> & {
    onPress?: React.MouseEventHandler<HTMLButtonElement>;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onPress, variant, size, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      onClick={onPress}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

**`components/Button/index.native.tsx`**
```tsx
import * as React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { tokens } from "../../tokens/native"; // colores/espaciados

type Size = "sm" | "md" | "lg" | "icon";
type Variant = "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";

export type ButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
};

export const Button = ({
  onPress,
  disabled,
  variant = "default",
  size = "md",
  style,
  textStyle,
  children,
}: ButtonProps) => {
  const background = tokens.button.bg[variant];
  const color = tokens.button.fg[variant];
  const pad = tokens.button.px[size];
  const height = tokens.button.h[size];

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        { backgroundColor: background, height, paddingHorizontal: pad, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, { color }, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
});
```

**`components/Button/index.ts`**
```ts
export * from "./index.web"; // Next/SSR resolverá el .web en web y .native en RN mediante alias/bundler
```

> **Nota:** Si usas Metro/Expo, añade aliases para resolver `.native.tsx` en mobile.

---

### 3.2 Select (adaptador string ⇄ Option)

**Problema:** la base `ui/select.tsx` trabaja con `Option = { value, label }` pero la app quiere `string-in/string-out`.

**Solución wrapper (web):**
```tsx
"use client";

import * as React from "react";
import {
  Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@repo/design/ui/select";

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({ value, onChange, options, placeholder="Selecciona…", disabled, className }: SelectProps) {
  return (
    <UISelect
      value={value}
      onValueChange={(v) => onChange?.(v)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
}
```

**Native:** igual concepto, pero con `@rn-primitives/select` + `Text`.

---

## 4) Tabla (web) y el error “Unexpected text node”

Ese error aparece cuando se inyecta texto directamente dentro de un `<View>` de **React Native**. En **web**, usa la familia de `ui/table.tsx`:

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/design/ui/table";

<Table className="w-full">
  <TableHeader>
    <TableRow>
      <TableHead>Usuario</TableHead>
      <TableHead>Rol</TableHead>
      <TableHead>Estado</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Juan</TableCell>
      <TableCell>admin</TableCell>
      <TableCell>Activo</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

> **No** metas strings sueltos en un `<View>` de RN; en Native, wrapea siempre con `<Text>`.

---

## 5) Temas y tokens

- **Web:** consume colores con `hsl(var(--primary))` desde `css-variables.css`.  
- **Native:** consume desde `tokens/native.ts` (mismo naming: `tokens.color.primary`).
- **Tailwind:** mapea en `tailwind.config.ts`:
  ```ts
  colors: { primary: "hsl(var(--primary))", /* … */ }
  ```
- **No dupliques** paletas en `apps/web/app/globals.css`. Importa las variables del design system o mantenlas sincronizadas.

---

## 6) `use client` — ¿dónde?

- **Sí** en: `components/*/index.web.tsx` si el wrapper es interactivo, usa hooks o reexporta `ui/*` que es cliente.
- **Sí** en: `ui/*` interactivos (p. ej. `ui/select.tsx`, `ui/table.tsx`).
- **No** en: `components/*/index.ts` (barrels), `tokens/*`, utilidades puras.

---

## 7) ESLint anti‑regresión (web)

Bloquea `<button>` y `onClick` en apps web (debe venir de wrappers/`onPress`).

```js
// .eslintrc.cjs (apps/web)
rules: {
  "no-restricted-syntax": [
    "error",
    { selector: "JSXOpeningElement[name.name='button']", message: "Usa @repo/design/components/Button" },
  ],
  "no-restricted-properties": [
    "error",
    { object: "props", property: "onClick", message: "Usa onPress en wrappers" },
  ],
}
```

---

## 8) Checklist al crear un wrapper

- [ ] ¿API unificada? (`onPress`, `variant`, `size`, `disabled`)
- [ ] **Web** usa DOM + Tailwind + vars CSS (no RN)
- [ ] **Native** usa RN + tokens JS (no HTML/CSS)
- [ ] `use client` donde toque
- [ ] Sin hardcode de colores (usa tokens)
- [ ] Barrel `index.ts` exportando el wrapper
- [ ] Story/test mínimo (opcional, recomendado)

---

## 9) Pitfalls comunes

- **Texto suelto en `<View>` (RN)** → wrapear con `<Text>` o usa los sub‑componentes correctos del `ui/`.
- **`onClick` en app web** → debe ser `onPress` en wrapper.
- **Doble fuente de colores** → unifica en tokens.
- **Imports equivocados**: `@repo/design` es el package; no mezclar `design-system` como alias.
- **Tailwind content globs**: no coincidas todo `node_modules`. Usa patrones explícitos.

---

## 10) FAQ

**Q:** ¿Puedo usar `<button>` directamente en web?  
**A:** No. Usa `@repo/design/components/Button` para mantener API y estilos.

**Q:** ¿Puedo poner Tailwind en Native?  
**A:** No. En Native usa `StyleSheet`/objetos JS con tokens.

**Q:** ¿Dónde añado una variante nueva de `Button`?  
**A:** En el wrapper correspondiente (web: `cva` → clases; native: calcular estilos desde `tokens`).

**Q:** ¿Select quiere objetos y mi app quiere strings?  
**A:** Usa el **adaptador** del wrapper (string ↔ Option).

---

## 11) Ejemplo de PR (resumen)

1. Crear `components/Badge/index.web.tsx` y `index.native.tsx` con API unificada.
2. Añadir `export * from "./Badge"` al barrel `components/index.ts`.
3. Reemplazar imports en app: `@repo/design/components/Badge`.
4. Probar en web y native.
5. Añadir historia de Storybook (opcional) y snapshot (opcional).

---

**Listo.** Con esta guía Cursor puede crear/migrar wrappers de forma consistente, sin romper Web/Native, y con el design language centralizado en **tokens**.