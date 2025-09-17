# Guía Definitiva del Sistema de Diseño · onfit

_Generado: 2025-08-23T16:59:39Z_

Esta guía explica **cómo está montado el sistema de diseño**, **dónde va cada cosa**, y **cómo mantenerlo sano** en **web (Next.js)** y **native (Expo/React Native + NativeWind)**. Incluye reglas de oro, estructura, tokens, variantes (CVA), theme bridge, y un “never-do list”.

---

## 0) Principios

1. **Fuente única de verdad** para estilos:
    - **Tokens** (`packages/design-system/tokens/…`)
    - **Tailwind preset + config** (`packages/design-system/tailwind/…`)
    - **Componentes del DS** (`packages/design-system/components/**` y `packages/design-system/ui/**`)
2. **Nada de CSS ad-hoc en apps** (web/native). En web, solo se permite:
    - `@tailwind base; @tailwind components; @tailwind utilities;`
    - Importar **tokens** y (opcional) **global.css** del DS.
    - Reglas mínimas de _theme bridge_ (color-scheme y helpers).
3. **En React Native**
    - Usa **NativeWind** (`className`) + **componentes del DS**.
    - Evita `StyleSheet` y `style={{…}}` salvo casos MUY puntuales (performance o APIs nativas).
4. **shadcn/ui look por defecto**
    - No sobreescribas estilos base de shadcn.
    - Cualquier personalización debe hacerse con **variants (CVA)** en el componente del DS, nunca con CSS suelto.

---

## 1) Estructura

```
packages/
  design-system/
    components/              # Componentes cross-platform y/o específicos por plataforma
      Button/
        index.tsx            # Native/shared
        index.web.tsx        # Web-only (si aplica)
      …
    ui/                      # Wrappers shadcn + cva (plataforma-aware)
      button.tsx
      input.tsx
      …
    providers/
      theme/ThemeProvider.*  # Proveedor de tema (web/native)
    tailwind/
      tailwind.config.ts     # Config común
      module.mjs             # Compat con NativeWind
      global.css             # (web) base + resets mínimos
    tokens/
      index.css              # Variables CSS (web) y mapa de tokens
      index.ts               # Export JS/TS para RN
  bottom-sheet/              # (otro paquete)
apps/
  web/
    app/
      layout.tsx             # Importar tokens y global del DS
      globals.css            # (opcional, mínimo)
      styles/utilities.css   # ❌ NO usar (mover a DS o eliminar)
  native/
    app/**                   # Rutas expo-router
    features/**              # Pantallas/feature (usa DS)
```

---

## 2) Tokens

- **Web (CSS variables)**: `packages/design-system/tokens/index.css`
- **Native (TS export)**: `packages/design-system/tokens/index.ts`

### Buen uso

- En web: utilízalos vía **Tailwind** (clases generadas) o como `var(--token)` si hace falta.
- En native: accede a tokens vía helpers del DS o usa clases de NativeWind que ya mapean a tokens.

### Nunca

- No hardcodees colores/espaciados en apps. Siempre pasa por **tokens + DS**.

---

## 3) Tailwind y NativeWind

- Config: `packages/design-system/tailwind/tailwind.config.ts`
- Bridge NativeWind: `packages/design-system/tailwind/module.mjs`
- **Clases “platform-aware”** en los componentes del DS: `web:`, `native:` ya preparados en CVA.

### Regla

- **Apps** no definen su propio tailwind config con overrides visuales. Importan el del DS.

---

## 4) Variants (CVA)

- Patrón central para variantes en `ui/*` y `components/*` (web/native).
- Añadir variantes → siempre en el **componente del DS**, nunca en la app.

### Ejemplo (resumen conceptual)

```ts
const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground",
                ghost: "bg-transparent",
            },
            size: { sm: "h-8 px-3", md: "h-10 px-4" },
        },
        defaultVariants: { variant: "default", size: "md" },
    },
);
```

---

## 5) Theme Provider & Theme Bridge

- **Web**: `ThemeProvider.web.tsx` + `tokens/index.css`
    - Usa `:root { … }` y `.dark { … }` para **color-scheme** y variables.
- **Native**: `ThemeProvider.native.tsx`
    - Expone el mismo **contrato de tokens** para RN, y NativeWind aplica clases mapeadas.

> Objetivo: **mismo aspecto** (shadcn por defecto) y **mismos nombres** (tokens/variants) en ambas plataformas.

---

## 6) Dónde va cada cosa

- **Estilos base (web)**: `packages/design-system/tailwind/global.css`
- **Tokens**: `packages/design-system/tokens/**`
- **Componentes UI**: `packages/design-system/ui/**`
- **Componentes más complejos/feature**: `packages/design-system/components/**`
- **CUALQUIER** override visual → en el **DS**, nunca en `apps/**`.

---

## 7) Dónde NO escribir CSS

- `apps/web/app/styles/utilities.css` → ❌ **Eliminar/Migrar** (rompe defaults shadcn)
- `apps/web/app/globals.css` → ✅ mantener **mínimo** (tailwind directives + theme bridge)
- RN: nunca `.css`. Usar **NativeWind** + DS. Evitar `StyleSheet`.

---

## 8) “Never-do list”

- ❌ Clases genéricas tipo `.btn-primary`, `.card`, `.surface` en `apps/web`.
- ❌ Reglas globales que afecten a `.btn`, `a`, `input`… en `apps/web`.
- ❌ `style={{ color: "#123456" }}` o `StyleSheet.create({ padding: 17 })` en apps (usa tokens + DS).
- ❌ Duplicar componentes UI en apps. Extiende el DS mediante variants.
- ❌ Añadir nuevos colores fuera de tokens.

---

## 9) “Sí-hazlo”

- ✅ Importar **solo** `@repo/design/tokens/index.css` y `@repo/design/tailwind/global.css` en web.
- ✅ Componer pantallas con **componentes del DS**.
- ✅ Variantes nuevas → en el DS con **CVA**.
- ✅ Si hace falta un util class, añadirlo al DS (no a `apps/web`).

---

## 10) Flujo para añadir/editar un componente

1. Diseñar API (props, variants, states) en `packages/design-system/ui/…`
2. Implementar CVA + platform-aware classes (`web:` / `native:`)
3. Exponer tokens necesarios (si es nuevo)
4. Escribir ejemplos en `packages/design-system/components/example/…`
5. Reemplazar usos en `apps/**` para quitar estilos ad-hoc

---

## 11) Mantenimiento sano

- **Lint rules** (sugerido): bloquear `style={{…}}` salvo whitelist y detectar `.css` fuera del DS.
- **PR checklist**:
    - ¿Se tocan estilos? → Debe ser en **DS**.
    - ¿Se añadió variante? → Está en CVA + documentación.
    - ¿Se tocó `apps/web/globals.css`? → Solo tailwind directives + theme bridge.
- **Snapshot visual** por cada componente UI.

---

## 12) FAQ

**¿Cómo cambio un color global?** → Edita el token en `packages/design-system/tokens/*`.  
**¿Cómo agrego un tamaño al Button?** → Añade `size` en su CVA dentro del DS.  
**¿Cómo pinto una pantalla RN?** → Usa `className` con NativeWind y componentes del DS; nada de StyleSheet.

---

## 13) Ejemplo mínimo de layout web

```tsx
// apps/web/app/layout.tsx
import "@repo/design/tokens/index.css";
import "@repo/design/tailwind/global.css"; // base y resets mínimos DS
// (Opcional) './globals.css' solo si está mínimo (ver abajo)

export default function RootLayout({ children }) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
```

```css
/* apps/web/app/globals.css — OPCIONAL (mínimo) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme bridge adicional si lo necesitas */
:root {
    color-scheme: light;
}
.dark {
    color-scheme: dark;
}
```

---

## 14) Ejemplo mínimo de pantalla RN

```tsx
// apps/native/features/auth/LoginScreen.tsx (ejemplo conceptual)
import { View, Text } from "react-native";
import { Button } from "@repo/design/ui/button";
import { Input } from "@repo/design/ui/input";

export default function LoginScreen() {
    return (
        <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
            <Text className="text-2xl font-semibold text-foreground">Iniciar sesión</Text>
            <View className="w-full gap-3">
                <Input
                    placeholder="Email"
                    className="w-full"
                    keyboardType="email-address"
                />
                <Input placeholder="Password" className="w-full" secureTextEntry />
                <Button className="w-full mt-2">Entrar</Button>
            </View>
        </View>
    );
}
```

---

## 15) Apéndice · Archivos clave

- `packages/design-system/tokens/index.css` — tokens (web)
- `packages/design-system/tokens/index.ts` — tokens (native)
- `packages/design-system/tailwind/global.css` — base y resets DS (web)
- `packages/design-system/tailwind/tailwind.config.ts` — config
- `packages/design-system/ui/*` — shadcn wrappers + CVA
- `packages/design-system/components/*` — compuestos
- `apps/web/app/layout.tsx` — importa tokens + global DS
- `apps/web/app/globals.css` — opcional, mínimo
- `apps/web/app/styles/utilities.css` — ❌ eliminar/migrar
- `apps/native/features/**` — pantallas: **solo** DS + NativeWind

---

_Fin._
