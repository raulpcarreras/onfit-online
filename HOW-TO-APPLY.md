# Cómo aplicar estos cambios

## 1) Copia los stubs del design system
En la raíz del repo:
```bash
unzip design-unify-stubs-20250822.zip -d .
```

## 2) Importa los estilos globales
Edita `apps/web/app/layout.tsx` y añade:
```ts
import "@repo/design/styles.css";
```

## 3) Usa el preset de Tailwind
Sustituye tu `apps/web/tailwind.config.ts` por el ejemplo o aplica el patch:
```bash
git apply PATCH-examples/01-web-tailwind-config.patch || true
git apply PATCH-examples/02-app-layout-import-styles.patch || true
```

## 4) Refactor de pantalla (ejemplo)
Admin Dashboard:
```bash
git apply PATCH-examples/03-admin-dashboard-page.patch || true
```

Topbar:
```bash
git apply PATCH-examples/04-topbar-button.patch || true
```

> Si un patch falla por contexto, abre el archivo y replica el cambio a mano (los diffs son pequeños y comentados).

## 5) Instala deps necesarias (si no las tienes)
```bash
pnpm add -w clsx tailwind-merge tailwindcss-animate
```

## 6) Build & test
```bash
pnpm web:dev
pnpm web:build
```
