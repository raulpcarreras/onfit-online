# Plan de Limpieza Visual + Parches (shadcn por defecto)

_Generado: 2025-08-23T16:59:39Z_

Este documento lista **todos los cambios necesarios** para que **TODOS los componentes shadcn** se vean por defecto, sin CSS invasivo en `apps/**`, y con un uso correcto del **Design System**.

> Nota: se basa en el zip proporcionado (`onfit-src-2025-08-23-wt.zip`) y el informe previo `GRAPHICS_CHANGES_REPORT.md` (detecciones de CSS/inline styles).

---

## 1) Qué vamos a hacer

1. **Eliminar/migrar CSS ajeno al DS** en **apps/web**.
2. **Restringir `globals.css`** a lo mínimo aceptable.
3. **Refactor RN**: sustituir `StyleSheet`/`style={{…}}` por **NativeWind + DS** (al menos en pantallas clave).
4. **Asegurar imports correctos** de tokens + global DS en web.
5. **Reglas de PR y lint** para que no vuelva a ocurrir.

---

## 2) Archivos a modificar (lista exacta)

### Web
- **`apps/web/app/layout.tsx`**
  - Quitar `./styles/utilities.css`
  - Importar solo `@repo/design/tokens/index.css` y `@repo/design/tailwind/global.css`
  - (Opcional) mantener `./globals.css` **si** queda mínimo (ver abajo)
- **`apps/web/app/styles/utilities.css`**
  - **Eliminar** (o vaciar): contiene clases `.btn-*`, `.card`, `.surface`, etc. que rompen shadcn
- **`apps/web/app/globals.css`**
  - **Reducir** a tailwind directives + theme bridge (sin reglas que toquen botones/inputs/links)

### Native (Ejemplos prioritarios)
- **`apps/native/features/auth/LoginScreen.tsx`**
- **`apps/native/app/(protected)/admin.tsx`**
- **`apps/native/app/(protected)/client.tsx`**
- **`apps/native/app/(protected)/trainer.tsx`**

> Hay más archivos con `style={{…}}` detectados en `GRAPHICS_CHANGES_REPORT.md`. Empezamos por los de mayor impacto y patrón repetible.

---

## 3) Parches propuestos (código completo)

### 3.1 `apps/web/app/layout.tsx`

**ANTES (extracto relevante):**
```tsx
import './globals.css'
import '@repo/design/tailwind/global.css'
import './styles/utilities.css'
```

**DESPUÉS (limpio y estable):**
```tsx
import '@repo/design/tokens/index.css'
import '@repo/design/tailwind/global.css'
// (Opcional) Si conservas globals.css, debe ser mínimo
// import './globals.css'

export const metadata = { title: 'onfit', description: 'app' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

---

### 3.2 `apps/web/app/styles/utilities.css`

**Acción:** eliminar el archivo o dejarlo vacío.  
Si alguna clase fuese imprescindible, muévela al **DS** como variante/utility **bien nombrada** _dentro de `packages/design-system`_.

**DESPUÉS (archivo eliminado o vacío):**
```css
/* (intencionadamente vacío) */
```

---

### 3.3 `apps/web/app/globals.css` (mínimo recomendado)

**DESPUÉS (contenido sugerido):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme bridge mínimo */
:root { color-scheme: light; }
.dark { color-scheme: dark; }

/* NO añadir reglas globales de botones, inputs, links, etc. */
```

> Si necesitas resets extra, muévelos a `packages/design-system/tailwind/global.css` para mantener coherencia.

---

### 3.4 `apps/native/features/auth/LoginScreen.tsx`

**ANTES (usaba StyleSheet y colores hardcodeados / locales)**

**DESPUÉS (DS + NativeWind):**
```tsx
import { View, Text } from 'react-native'
import { Button } from '@repo/design/ui/button'
import { Input } from '@repo/design/ui/input'

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <Text className="text-2xl font-semibold text-foreground">Iniciar sesión</Text>
      <View className="w-full gap-3">
        <Input placeholder="Email" className="w-full" keyboardType="email-address" />
        <Input placeholder="Password" className="w-full" secureTextEntry />
        <Button className="w-full mt-2">Entrar</Button>
      </View>
    </View>
  )
}
```

---

### 3.5 `apps/native/app/(protected)/admin.tsx`

**ANTES (extracto):**
```tsx
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  <Text>Admin</Text>
</View>
```

**DESPUÉS (NativeWind):**
```tsx
<View className="flex-1 items-center justify-center bg-background">
  <Text className="text-foreground">Admin</Text>
</View>
```

> Repite el mismo patrón en `client.tsx`, `trainer.tsx`, etc.

---

## 4) Reglas para Cursor (prompt listo para pegar)

**Sistema (siempre activo):**
- “No introduzcas CSS nuevo en `apps/**`. Cualquier cambio visual se hace en `packages/design-system/**` usando tokens, Tailwind y CVA. Mantén shadcn por defecto.”

**Instrucciones concretas:**
1. Elimina el import de `./styles/utilities.css` en `apps/web/app/layout.tsx` y añade `@repo/design/tokens/index.css`.
2. Vacía o elimina `apps/web/app/styles/utilities.css`.
3. Reduce `apps/web/app/globals.css` a las tailwind directives y el theme bridge mínimo (no afectar a botones/inputs/links).
4. Refactoriza `apps/native/features/auth/LoginScreen.tsx` para usar `@repo/design/ui/*` y `className` de NativeWind (según parche).
5. En `apps/native/app/(protected)/*`, reemplaza `style={{…}}` por clases NativeWind y tokens (como en admin.tsx).
6. No toques `packages/design-system/tokens/*` ni `tailwind.config.ts` salvo que se añadan **nuevas** variantes/tokens de forma justificada.
7. Si detectas un estilo global que cambie el aspecto por defecto de shadcn, **elíminalo o muévelo al DS** como variant.

**Validación automática (sugerencias):**
- ESLint rule para bloquear `style={{…}}` en `apps/native/**` (whitelist puntual).
- Finder que falle CI si detecta `.css` fuera de `packages/design-system/**` y `apps/web/app/globals.css`.

---

## 5) ¿Qué NO tocar?

- `packages/design-system/tokens/index.css` e `index.ts` → son la fuente de verdad.
- `packages/design-system/ui/*` → solo ampliar con variants, no overrides rápidos en apps.
- `packages/design-system/tailwind/global.css` → base común web; evita duplicarlo.

---

## 6) Checklist de cierre

- [ ] Web se renderiza con look default de shadcn (sin `.btn-*` artesanales)
- [ ] RN funciona sin `StyleSheet` en pantallas principales
- [ ] `apps/web/app/layout.tsx` importa solo DS + (opcional) globals mínimo
- [ ] CI con reglas anti-regresión activas
- [ ] Documentación de nuevas variants (si se añadieron)

---

## 7) Anexo · Archivos con estilos inline (del informe previo)

Consulta `GRAPHICS_CHANGES_REPORT.md` para el listado completo. Prioriza pantallas de usuario y rutas principales.
