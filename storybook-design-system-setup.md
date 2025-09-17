# 📚 Storybook en `packages/design-system` — Guía de instalación segura (Web)

> **Objetivo:** Montar **Storybook** _solo_ dentro de `packages/design-system` para documentar y testear los componentes web (wrappers y/o `ui` shadcn) **sin tocar** las apps ni romper el monorepo.  
> **Compatibilidad:** PNPM workspaces, Next.js 15, Tailwind 3, tokens HSL, React 19, Expo SDK 53 (Native **fuera de alcance** de este setup).

---

## ✅ Qué hace / Qué no hace

**Hace**

- Renderiza componentes del **design-system** (web) en aislamiento.
- Usa **Tailwind** y **tokens HSL** de tu DS (respetando `tailwind.preset.ts` y `tokens/index.css`).
- No cambia nada en `apps/web` ni `apps/native`.
- Provee **controles**, **docs**, **a11y** y **testing de interacciones**.

**No hace**

- No añade un editor de variantes en tiempo real (es documentación + preview).
- No procesa Native/Expo (puede hacerse luego con Storybook RN en otra fase).
- No toca la arquitectura de ThemeBridge ni tokens.

---

## 🧩 Requisitos previos (asumidos)

- Monorepo PNPM funcionando.
- Paquete `@repo/design` en `packages/design-system`.
- Tailwind preset en `packages/design-system/tailwind.preset.ts`.
- Tokens HSL en `packages/design-system/tokens/index.css`.
- Node 18+ / 20+, PNPM 9+.

> ⚠️ **No** añadimos PostCSS/Tailwind globales al package salvo **para Storybook** (dev-only). Esto **no** afecta a la build de producción.

---

## 🛠️ Instalación (dentro de `packages/design-system`)

Ejecuta **desde la raíz** del monorepo:

```bash
# 1) Instala Storybook y builder Vite en el package del DS
pnpm --filter @repo/design add -D \
  @storybook/react-vite@8 \
  @storybook/addon-essentials@8 \
  @storybook/addon-interactions@8 \
  @storybook/addon-a11y@8 \
  @storybook/addon-styling@3 \
  @storybook/test@8 \
  vite@5

# 2) Tailwind + PostCSS SOLO para Storybook (dev)
pnpm --filter @repo/design add -D tailwindcss@3 postcss autoprefixer
```

> Si el nombre del package no es `@repo/design`, usa el path:  
> `pnpm --filter ./packages/design-system add -D <deps...>`

---

## 📁 Estructura de archivos que vamos a crear

```
packages/design-system/
├─ .storybook/
│  ├─ main.ts
│  ├─ preview.ts
│  └─ preview.css
├─ stories/
│  └─ Button.stories.tsx       # ejemplo
├─ postcss.config.cjs          # solo para Storybook
├─ tailwind.config.ts          # solo para Storybook
└─ package.json                # scripts storybook
```

---

## ⚙️ Configuración de Storybook

### 1) `.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    stories: [
        // Stories del propio package
        "../stories/**/*.stories.@(ts|tsx)",
        // (Opcional) stories junto a componentes
        "../{components,ui}/**/*.stories.@(ts|tsx)",
    ],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
        {
            name: "@storybook/addon-styling",
            options: {
                postCss: true,
            },
        },
    ],
    docs: {
        autodocs: "tag",
    },
    core: {
        disableTelemetry: true,
    },
    viteFinal: async (config, { configType }) => {
        // Ajustes útiles en monorepos
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.include = [
            ...(config.optimizeDeps.include || []),
            "react",
            "react-dom",
            "clsx",
            "tailwind-merge",
        ];

        // Asegura resolución TS en pnpm workspaces
        config.resolve = config.resolve || {};
        config.resolve.dedupe = ["react", "react-dom"];

        return config;
    },
};
export default config;
```

### 2) `.storybook/preview.ts`

```ts
import type { Preview } from "@storybook/react";
import "../.storybook/preview.css"; // Tailwind + tokens HSL

const preview: Preview = {
    parameters: {
        controls: { expanded: true },
        layout: "padded",
        backgrounds: {
            default: "app",
            values: [
                { name: "app", value: "hsl(0 0% 100%)" },
                { name: "dark", value: "hsl(240 3% 7%)" },
            ],
        },
    },
};

export default preview;
```

### 3) `.storybook/preview.css`

> Esta hoja **sí** declara `@tailwind ...` y **también** importa tus tokens HSL. Es **local** a Storybook; no afecta a la app.

```css
@import "../tokens/index.css"; /* Tus variables HSL */

/* Tailwind solo dentro de SB */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base mínima para simular la app */
@layer base {
    * {
        @apply border-border;
    }
    body {
        @apply bg-background text-foreground;
    }
}
```

---

## 🎨 Tailwind para Storybook (solo DS)

### `tailwind.config.ts` (en `packages/design-system/`)

```ts
import type { Config } from "tailwindcss";
import preset from "./tailwind.preset";

export default {
    presets: [preset],
    content: [
        "./{components,ui,stories}/**/*.{ts,tsx}",
        "./.storybook/**/*.{ts,tsx,css}",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
} satisfies Config;
```

> Usamos **tu preset** del DS para mantener colores/spacing/typography.

### `postcss.config.cjs` (en `packages/design-system/`)

```cjs
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

> **Nota:** Este PostCSS es **solo** para Storybook. No afecta a las apps.

---

## 🧪 Story de ejemplo

### `stories/Button.stories.tsx`

> Elige si documentas el **wrapper** (`components/Button/index.web`) o el shadcn `ui/button`. Recomendado: **wrapper** si existe.

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button"; // o '../ui/button' si prefieres

const meta = {
    title: "Components/Button",
    component: Button as any,
    tags: ["autodocs"],
    args: {
        children: "Button",
        variant: "default",
        size: "default",
    },
    argTypes: {
        onClick: { action: "click" },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap">
            <Button {...args} variant="default">
                Default
            </Button>
            <Button {...args} variant="secondary">
                Secondary
            </Button>
            <Button {...args} variant="outline">
                Outline
            </Button>
            <Button {...args} variant="ghost">
                Ghost
            </Button>
            <Button {...args} variant="link">
                Link
            </Button>
            {/* Si añadiste variantes extra en /components/Button/variants.ts */}
            <Button {...args} variant="onfit">
                Onfit
            </Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-3 items-center">
            <Button {...args} size="sm">
                sm
            </Button>
            <Button {...args} size="default">
                default
            </Button>
            <Button {...args} size="lg">
                lg
            </Button>
            <Button {...args} size="icon" aria-label="icon button">
                👍
            </Button>
        </div>
    ),
};
```

---

## 📜 Scripts en `packages/design-system/package.json`

```jsonc
{
    "scripts": {
        "storybook": "storybook dev -p 6006",
        "build-storybook": "storybook build",
    },
}
```

> Correr desde la raíz del monorepo:
>
> ```bash
> pnpm --filter @repo/design storybook
> # o
> pnpm --filter ./packages/design-system storybook
> ```

---

## ✅ Verificación rápida (checklist)

1. `pnpm --filter @repo/design storybook` arranca en `http://localhost:6006` ✔️
2. Ves `Components/Button` con variantes y tamaños ✔️
3. El fondo cambia correctamente entre light/dark en **Backgrounds** ✔️
4. No aparecen errores de `Unknown at rule @tailwind` (Storybook procesa PostCSS) ✔️

---

## 🧯 Troubleshooting

**❌ `Unknown at rule @tailwind`**  
➡️ Falta `postcss.config.cjs` o addon-styling. Revisa que `@storybook/addon-styling` esté en `addons` **con** `postCss: true` y que `postcss` + `autoprefixer` estén instalados.

**❌ Clases Tailwind no aplican en Stories**  
➡️ Verifica `tailwind.config.ts` (`presets: [preset]`) y `content` incluye `stories`, `components`, `ui`, `.storybook`.

**❌ Colores salen blancos/negros**  
➡️ Asegura que `preview.css` **importa** `../tokens/index.css` (fuente de las variables HSL).

**❌ Duplicación de React / Hooks inválidos**  
➡️ En `viteFinal`, dedupe `react` y `react-dom` como se muestra arriba.

**❌ Import paths rotos**  
➡️ Importa **relativo** dentro del package (`../components/...`). Evita `@repo/design` para no resolver a tu propio package publicado.

**❌ Performance lenta en arranque**  
➡️ Ajusta `optimizeDeps.include` en `viteFinal` con libs usadas en tus componentes (`clsx`, `tailwind-merge`, etc.).

---

## 🔁 Rollback seguro

Para desinstalar Storybook de forma limpia:

```bash
pnpm --filter @repo/design remove \
  @storybook/react-vite @storybook/addon-essentials @storybook/addon-interactions \
  @storybook/addon-a11y @storybook/addon-styling @storybook/test vite \
  tailwindcss postcss autoprefixer

rm -rf packages/design-system/.storybook packages/design-system/stories \
       packages/design-system/postcss.config.cjs packages/design-system/tailwind.config.ts
```

---

## 🧭 Roadmap opcional (futuro)

- **Storybook RN on-device** para `apps/native` (separado, otra instancia).
- Docs automáticas leyendo `variants.ts` (si las tienes por componente).
- Visual regression testing (Chromatic / Loki).
- Integración CI con Vercel Preview (deploy de Storybook estático).

---

## 🟢 Estado final esperado

- Storybook corre solo en `packages/design-system`.
- Tailwind y tokens HSL funcionan en Stories.
- No se ha tocado `apps/web` ni `apps/native`.
- Fácil de iterar y documentar **variantes** sin romper la app.

---

**Listo.** Pásale este archivo a Cursor tal cual. Si aparece cualquier error, dime el mensaje exacto y lo corrijo sobre la marcha sin tocar el resto del monorepo.
