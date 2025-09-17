# Guía para Crear Nuevas Variantes de Componentes

**Stack:** Turborepo · Next.js 15 (web) · Expo SDK 53 (native) · Tailwind 3.x · shadcn/ui · ThemeBridge

> Esta guía explica cómo añadir nuevas variantes de componentes (Button, Badge, Alert, etc.) siguiendo la arquitectura establecida del design system.

---

## 🎯 **Qué NO Hacer (Reglas Estrictas)**

### ❌ **NO tocar estos archivos:**

- `packages/design-system/ui/*` (shadcn original)
- `packages/design-system/providers/theme/*` (ThemeBridge base)
- `packages/design-system/tailwind.preset.ts` (configuración Tailwind)
- `apps/*` (aplicaciones)

### ❌ **NO instalar nuevas dependencias:**

- No usar `npx`, `npm install`, `pnpm add`
- Usar solo lo que ya está en el monorepo

---

## ✅ **Qué SÍ Hacer (Arquitectura Correcta)**

### **1. Definir Tokens HSL en CSS**

**Archivo:** `packages/design-system/tokens/index.css`

```css
:root {
    /* Colores base (ya existen) */
    --primary: 38 92% 50%;
    --background: 0 0% 98%;

    /* NUEVA VARIANTE - ejemplo: "brand" */
    --brand: 220 100% 50%;
    --brand-foreground: 0 0% 100%;
}

.dark {
    /* Colores base dark (ya existen) */
    --primary: 38 92% 50%;
    --background: 240 7% 8%;

    /* NUEVA VARIANTE dark */
    --brand: 220 100% 60%;
    --brand-foreground: 0 0% 0%;
}
```

### **2. Extender Tokens JS**

**Archivo:** `packages/design-system/tokens/index.ts`

```typescript
export interface ColorTokens {
    // ... colores base existentes

    // NUEVA VARIANTE
    brand: string;
    "brand-foreground": string;
}

export const tokens: ThemeTokens = {
    light: {
        // ... colores base existentes

        // NUEVA VARIANTE
        brand: "#3b82f6",
        "brand-foreground": "#ffffff",
    },
    dark: {
        // ... colores base existentes

        // NUEVA VARIANTE
        brand: "#60a5fa",
        "brand-foreground": "#000000",
    },
};
```

### **3. Extender ThemeProvider Web**

**Archivo:** `packages/design-system/providers/theme/ThemeProvider.web.tsx`

```typescript
colors: {
  // ... colores base existentes

  // NUEVA VARIANTE
  brand: "hsl(var(--brand))",
  "brand-foreground": "hsl(var(--brand-foreground))",
}
```

**Nota:** ThemeProvider.native.tsx se actualiza automáticamente porque usa `tokens[resolvedMode]`.

---

## 🔧 **Implementación de Variantes por Componente**

### **PASO 1: Crear variants.shared.ts**

**Archivo:** `packages/design-system/components/[ComponentName]/variants.shared.ts`

```typescript
export const EXTRA_VARIANTS = [
    "onfit",
    "premium",
    "social",
    "success",
    "warning",
    "brand", // ← NUEVA VARIANTE
] as const;

export type ExtraVariant = (typeof EXTRA_VARIANTS)[number];

export function isExtraVariant(v?: string): v is ExtraVariant {
    return !!v && (EXTRA_VARIANTS as readonly string[]).includes(v);
}
```

### **PASO 2: Crear variants.web.ts**

**Archivo:** `packages/design-system/components/[ComponentName]/variants.web.ts`

```typescript
import { cva } from "class-variance-authority";

export const extraComponentVariants = cva("", {
    variants: {
        variant: {
            // ... variantes existentes

            // NUEVA VARIANTE
            brand: "bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90",
        },
        size: {
            // ... tamaños existentes
        },
    },
});
```

### **PASO 3: Crear variants.native.ts**

**Archivo:** `packages/design-system/components/[ComponentName]/variants.native.ts`

```typescript
export function getExtraVariantStyles(
    variant: ExtraVariant,
    colors: Record<string, string>,
): { container: ViewStyle; label: TextStyle; extraClasses?: string } {
    switch (variant) {
        // ... variantes existentes

        // NUEVA VARIANTE
        case "brand":
            return {
                container: { backgroundColor: colors["brand"] },
                label: { color: colors["brand-foreground"] },
                extraClasses: "",
            };

        default:
            return { container: {}, label: {} };
    }
}
```

### **PASO 4: Actualizar index.web.tsx**

**Archivo:** `packages/design-system/components/[ComponentName]/index.web.tsx`

```typescript
import { extraComponentVariants, isExtraVariant } from "./variants.web";

export const Component = ({ variant, ...props }) => {
  const isExtra = isExtraVariant(variant);

  // Si es variante extra, aplicar estilos propios
  const extra = isExtra
    ? extraComponentVariants({ variant })
    : "";

  return (
    <UIComponent
      variant={isExtra ? "default" : variant}
      className={cn(extra, className)}
      {...props}
    />
  );
};
```

### **PASO 5: Actualizar index.native.tsx**

**Archivo:** `packages/design-system/components/[ComponentName]/index.native.tsx`

```typescript
import { getExtraVariantStyles, isExtraVariant } from "./variants.native";

export const Component = ({ variant, ...props }) => {
  const { colors } = useThemeBridge();
  const isExtra = isExtraVariant(variant);

  const { container: bgStyle, label: fgStyle, extraClasses } = isExtra
    ? getExtraVariantStyles(variant, colors)
    : getCoreVariantStyles(variant, colors);

  return (
    <Pressable
      className={cn("base-classes", extraClasses)}
      style={bgStyle}
      {...props}
    >
      <Text style={fgStyle}>{children}</Text>
    </Pressable>
  );
};
```

---

## 🧪 **Verificación y Testing**

### **1. Build Web**

```bash
pnpm --filter web build
```

**Debe compilar sin errores de tipos.**

### **2. Verificar en /test-theme**

- Las nuevas variantes deben aparecer automáticamente
- Deben mostrar los colores correctos
- Deben funcionar en light/dark

### **3. Testing en Native**

```bash
pnpm --filter native start
```

- Las nuevas variantes deben funcionar sin errores
- Los colores deben ser coherentes con web

---

## 📋 **Checklist de Implementación**

- [ ] **Tokens CSS**: Variables HSL en `tokens/index.css` (:root y .dark)
- [ ] **Tokens JS**: ColorTokens extendido en `tokens/index.ts`
- [ ] **ThemeProvider Web**: Colores añadidos en objeto `colors`
- [ ] **Variants Shared**: Constantes y helpers en `variants.shared.ts`
- [ ] **Variants Web**: Clases Tailwind en `variants.web.ts`
- [ ] **Variants Native**: Estilos RN en `variants.native.ts`
- [ ] **Wrapper Web**: Integración en `index.web.tsx`
- [ ] **Wrapper Native**: Integración en `index.native.tsx`
- [ ] **Build Web**: Sin errores de tipos
- [ ] **Test Theme**: Variantes visibles en `/test-theme`
- [ ] **Test Native**: Funcionando sin errores

---

## 🚨 **Problemas Comunes y Soluciones**

### **Error: "Property X does not exist on type ColorTokens"**

**Solución:** Añadir la propiedad en `tokens/index.ts` y `ThemeProvider.web.tsx`

### **Error: "Argument type Record<string, string> is not assignable to ColorTokens"**

**Solución:** Usar `Record<string, string>` en `variants.native.ts` (NO tocar ThemeProvider)

### **Variantes no aparecen en /test-theme**

**Solución:** Verificar que estén en `ThemeProvider.web.tsx` y `tokens/index.css`

### **Button nativo falla con nuevas variantes**

**Solución:** Verificar que `getExtraVariantStyles` incluya el case para la nueva variante

---

## 🎯 **Ejemplo Completo: Variante "brand"**

**1. CSS:** `--brand: 220 100% 50%` en `:root` y `.dark`
**2. JS:** `brand: string` en `ColorTokens` interface
**3. ThemeProvider:** `brand: "hsl(var(--brand))"` en web
**4. Shared:** `"brand"` en `EXTRA_VARIANTS` array
**5. Web:** `brand: "bg-[hsl(var(--brand))]..."` en `variants.web.ts`
**6. Native:** `case "brand":` en `getExtraVariantStyles`
**7. Wrapper:** Integración en `index.web.tsx` e `index.native.tsx`

---

## ✨ **Beneficios de Esta Arquitectura**

- **Paridad web/native**: Mismos colores en ambas plataformas
- **Mantenibilidad**: Tokens centralizados, fácil cambiar colores
- **Escalabilidad**: Añadir variantes sin tocar shadcn
- **Consistencia**: Mismo sistema para todos los componentes
- **Testing**: `/test-theme` muestra automáticamente nuevas variantes

---

**¡Sigue esta guía y tendrás variantes extra funcionando en web y native sin romper nada!** 🚀
