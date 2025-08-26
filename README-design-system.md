# Onfit Design System — Guía de Implementación y Mantenimiento
**Stack relevante:** Turborepo (monorepo) · Next.js 15 (web) · Expo SDK 53 (native) · Tailwind 3.x · nativewind (sin Babel) · shadcn/ui (web) · Supabase

> Esta guía resume decisiones, convenciones y "gotchas" que detectamos juntos. Es el documento de referencia para mantener **coherente** el diseño en web y native sin romper el monorepo.

---

## 0) Decisiones clave (estado actual)
- **Tokens (HSL) en el package:** `packages/design-system/tokens/index.css` define las variables CSS. **SÍ** se importan desde la app web.
- **CSS del design-system:** `packages/design-system/tailwind/global.css` **NO** contiene @tailwind ni @layer base. Solo comentarios explicativos.
- **CSS de la app web:** `apps/web/app/globals.css` es el **único punto de entrada** que importa tokens y carga Tailwind.
- **Theme class:** `class="dark"` en `<html>` controlada por Next Themes (web). En native, Theme Bridge expone colores a RN (no CSS).
- **shadcn "de serie":** código en `packages/design-system/ui` queda intacto. No se tocan variantes base.
- **Wrappers propios:** en `packages/design-system/components` adaptamos props mínimas (p. ej. `onPress → onClick` en web) y mapeos ligeros (p. ej. `md → default` para compatibilidad).
- **Variants extra (opcional):** si se necesitan variantes **no estándar**, crear `variants.ts` por componente y **extender** las de shadcn, nunca duplicarlas.
- **Sin barrels problemáticos:** no exportar archivos `index.ts` que re-importan el propio barrel. Evitamos dependencias circulares.
- **NativeWind sin Babel:** usamos `className` en RN donde sea posible; estilos RN críticos se aplican con props/StyleSheet si es estrictamente necesario.
- **Función cn() unificada:** solo `packages/design-system/lib/utils.ts` con clsx + tailwind-merge. NO usar `lib/cn.ts`.

---

## 1) Dónde vive cada cosa

### 1.1 Web (Next.js)
```
apps/web/
  app/
    globals.css        ← ÚNICO punto de entrada CSS (tokens + @tailwind + @layer base)
    layout.tsx         ← importa SOLO globals.css (nada más)
  tailwind.config.ts   ← usa el preset del design-system
```
- `globals.css` **SÍ** contiene `@tailwind base/components/utilities` y **SÍ** importa tokens (HSL).
- **Orden OBLIGATORIO en `globals.css`:**
  1) `@import "@repo/design/tokens/index.css";`
  2) `@tailwind base;`
  3) `@tailwind components;`
  4) `@tailwind utilities;`
  5) `@layer base { * { @apply border-border } body { @apply bg-background text-foreground } }`
  6) `:root { color-scheme: light } .dark { color-scheme: dark }`

> **Motivo:** Los tokens se cargan PRIMERO, luego Tailwind los "conoce", y finalmente se aplican en `@layer base` con máxima claridad. Esto evita conflictos de cascada.

### 1.2 Design System (package)
```
packages/design-system/
  tokens/             ← index.css (variables HSL/roles, SÍ se importan desde apps)
  tailwind.preset.ts  ← preset compartido (colors = hsl(var(--X)))
  tailwind/global.css ← SOLO comentarios explicativos (NO @tailwind, NO @layer)
  ui/                 ← shadcn "de serie" (sin modificar)
  components/         ← wrappers web/native (mínimos, con mapeos ligeros)
  providers/
    theme/            ← Theme Bridge (web/native), API estable
  lib/
    utils.ts          ← ÚNICA función cn() (clsx + tailwind-merge)
```
- *Regla de oro:* **NO** declarar `@tailwind` ni `@layer base` en CSS del package.
- `tailwind.preset.ts` es la única fuente de verdad para el `theme.colors` que delega en `hsl(var(--…))`.
- **IMPORTANTE:** Solo `lib/utils.ts` tiene la función `cn()`. NO usar `lib/cn.ts`.

### 1.3 Native (Expo)
```
apps/native/
  app/
  tailwind.config.js  ← preset compartido del design-system + nativewind
```
- Theme Bridge provee un mapa `colors` derivado de tokens (parcialmente) para RN.
- `className` de nativewind soportado (sin Babel plugin). Para casos extremos, usar `StyleSheet` local.

---

## 2) Importación de CSS sin conflicto
**SÍ** importa `@repo/design/tokens/index.css` desde `apps/web/app/globals.css`.  
**NO** importes `@repo/design/tailwind/global.css` desde `apps/web/app/layout.tsx` (o desde páginas).  
**SÍ** céntrate en `apps/web/app/globals.css` como **punto único** de entrada de CSS.

**Ejemplo correcto (`apps/web/app/layout.tsx`):**
```tsx
// ✔️ Solo uno
import "./globals.css";
```

**Ejemplo correcto (`apps/web/app/globals.css`):**
```css
/* 1. Importar tokens HSL del design system */
@import "@repo/design/tokens/index.css";

/* 2. Cargar Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 3. Aplicar tokens en la capa base */
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

/* 4. Configuración de tema (opcional) */
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

> **Si activas @tailwind en `packages/design-system/tailwind/global.css`, volverán los conflictos** (líneas blancas, etc.). Mantén ese archivo solo con comentarios.

---

## 3) Tokens HSL (web) vs Theme Bridge (native)

### 3.1 Web (CSS Variables)
- **Ubicación:** `packages/design-system/tokens/index.css`
- **Importación:** `@import "@repo/design/tokens/index.css";` en `globals.css`
- `:root { --background: 0 0% 100%; … }`
- `.dark { --background: 240 10% 4%; … }`
- Tailwind preset define: `colors: { background: "hsl(var(--background))", … }`
- Componentes usan utilidades como `bg-background`, `text-foreground`, `border-border`, etc.

### 3.2 Native (JS Theme Bridge)
- No hay CSS variables en RN. Exponemos un objeto `colors` (p. ej. `{ background: "#0b0b0c" }`).
- Hooks/Context del `ThemeProvider.native` para leer colores en RN cuando no podamos usar `className`.
- Objetivo: **NO** duplicar código. Donde se pueda, usar `className` con nativewind.

---

## 4) shadcn "de serie" + wrappers

### 4.1 Regla
- `packages/design-system/ui/*` permanece **igual** a como lo entrega shadcn.
- `packages/design-system/components/*` encapsula y adapta:
  - Props (p. ej., **web**: `onPress → onClick`)
  - Mapeos ligeros (`md → default` para compatibilidad)
  - Re-export de `buttonVariants` (opcional)

### 4.2 Variants extra (opcional)
- Si necesitas variantes nuevas que **NO** existen en shadcn, crea `variants.ts` en la carpeta del componente:
  - **Extiende** la base de shadcn (no la reemplaces)
  - Añade solo lo que te falte (`onfit`, `xl`, etc.)
- En web y native, **usa** esas variantes extra sin tocar `ui/*`.

> Beneficio: puedes actualizar shadcn sin merge hell; tu capa de personalización vive aparte.

---

## 5) Button sizing y eventos

- **Tamaños shadcn:** `sm | default | lg | icon`
- Si tu código usa `size="md"`, mapea a `default` **en el wrapper web** y a la clase adecuada en RN.
- **Eventos:**
  - Web: prop pública `onPress` que internamente hace `onClick={onPress}` (no rompes a quien ya usa `onPress`)
  - Native: `onPress` de RN tal cual

> Esto permite que el **mismo JSX** funcione en las dos plataformas.

---

## 6) Exports / barrels

**Problema habitual:** `index.ts` que re-exporta de un archivo que **a su vez** importa de `index.ts` → **circular**.

**Reglas:**
- Cada subcarpeta de componente puede tener **un barrel simple** que haga **solo**:
  - `export * from "./index.web";` (en web)
  - `export * from "./index.native";` (en native)
  - o un `Button.ts` que exporte ambos con nombres distintos si necesitas.
- **Nunca** mezcles imports desde el propio barrel dentro de los entry files del componente.

**Checklist rápido:**
- "Attempted import error: X is not exported…" → revisa barrel y paths relativos
- "Element type is invalid: got undefined" → export default/named mal alineado o ciclo

---

## 7) Limpieza de CSS y clases

- **NO CSS suelto en páginas**. Todo estilo debe venir de:
  1) utilidades Tailwind
  2) variantes (CVA)
  3) tokens HSL
- Si un componente necesita CSS adicional, que sea **en su propia carpeta** y **sin redefinir tokens**.
- Evita `StyleSheet` salvo en casos necesarios en RN; prioriza `className` de nativewind.

---

## 8) Native: detalles importantes

- **Sin Babel plugin** de nativewind: está bien; `className` funciona.
- Para Pressable/Text: aplica `className` y estilos de texto con props o pequeñas utilidades.
- Si un wrapper web expone `onPress`, el native debe **compartir** esa API.
- Theme Bridge: sigue proporcionado por `providers/theme` y **NO** depende de CSS.

---

## 9) Checks/Debug rápidos

1) **Líneas blancas en dark:** inspecciona `--border` en DevTools. Si vale lo correcto y **aun así** ves blanco, hay **otro CSS** sobreescribiendo `border-color` → revisa el **orden** de imports y elimina duplicados del package.
2) **Botones con tamaño raro:** confirmar mapping `md → default` en wrapper web y RN.
3) **onPress "Unknown prop" en web:** tu wrapper debe mapear internamente a `onClick`.
4) **"useTheme no es function" o exports raros:** revisa **exactamente** lo que exporta `providers/theme/index.ts` y cómo lo importas.
5) **PostCSS en package:** **NO** es necesario. Tailwind se procesa en la app. El editor puede marcar `@tailwind` como "unknown at rule" en el package; ignóralo o no uses `@tailwind` allí.
6) **Función cn() no encontrada:** asegúrate de importar desde `../../lib/utils`, NO desde `../../lib/cn`.

---

## 10) Preguntas frecuentes

**¿Puedo mover tokens al package y que se apliquen solos?**  
**SÍ, es lo correcto**. Los tokens viven en `packages/design-system/tokens/index.css` y se importan desde `apps/web/app/globals.css`. Esto evita conflictos.

**¿Y si necesito un CSS común desde el package?**  
Que **NO** redefina tokens ni `@tailwind`. Úsalo para utilidades extra o resets muy puntuales.

**¿Por qué no un "postcss.config" en el package?**  
Porque no lo procesamos de forma independiente. El procesamiento ocurre en la app web.

**¿Cómo actualizo shadcn?**  
Actualizas `packages/design-system/ui/*` y tus wrappers siguen funcionando (no los tocamos).

**¿Por qué hay dos funciones cn()?**  
**NO debe haber dos**. Solo usa `packages/design-system/lib/utils.ts` con clsx + tailwind-merge. Elimina cualquier `lib/cn.ts`.

---

## 11) Roadmap sugerido (si quieres ir más allá)

1. **Añadir `variants.ts` solo para extras** en los componentes que lo necesiten (Button, Badge, Alert…)  
2. **Unificar mapping de tamaños** (documentar `md` → `default`) en wrappers
3. **Revisar barrels** en `components/*` para eliminar cualquier import circular
4. **Añadir tests visuales** (Storybook web) con tokens light/dark y snapshots básicos

---

## 12) Mini checklist PR

- [ ] `globals.css` (web) es la **única** entrada de CSS
- [ ] `@repo/design/tokens/index.css` se importa desde `globals.css`
- [ ] `packages/design-system/tailwind/global.css` **NO** contiene @tailwind
- [ ] `@tailwind` y `@layer base` **SÍ** están en `globals.css` de la app
- [ ] Tokens HSL en `globals.css` y `@layer base` aplicando `bg/text/border`
- [ ] `ui/*` (shadcn) **sin tocar**
- [ ] Wrappers en `components/*` con APIs estables (`onPress` web→`onClick`, RN→`onPress`)
- [ ] `variants.ts` solo para **extras**
- [ ] Barrels sin ciclos
- [ ] **Solo** `lib/utils.ts` tiene función `cn()` (clsx + tailwind-merge)

---

### Apéndice A — Razón de las "líneas blancas"
Ocurría cuando los tokens se inyectaban **desde el package** (o en múltiples sitios) y competían en la cascada con los tokens del app. El valor de `--border` era correcto, pero otro CSS ganaba en especificidad/orden. La **solución estable** fue consolidar toda la carga de tokens en `apps/web/app/globals.css` y no reinyectarlos desde el package.

---

**Si necesitas ejemplos concretos de un componente (Button, Table, Input) pídemelos y te los paso ya con las APIs mapeadas (web/native) y un `variants.ts` de extras.**
