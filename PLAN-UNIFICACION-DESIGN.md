# Plan de Unificación de Diseño — ONFIT

## Objetivo
Unificar tema (tokens) y consumo de componentes para que **web** y **native** compartan un mismo **Design System**.

## Entregables incluidos
- `packages/design-system/styles.css`: variables CSS (light/dark).
- `packages/design-system/tailwind.preset.ts`: preset con nombres canónicos (background, card, etc.).
- `packages/design-system/components/*`: wrappers `Button` y `Card` (web + native).
- `packages/design-system/utils/cn.ts`: util de clases.
- `apps-web-tailwind.config.example.ts`: ejemplo de configuración usando el preset.

## Pasos
1. **Instalar preset y estilos**
   - Importa en `apps/web/app/layout.tsx`: `import "@repo/design/styles.css";`
   - Cambia `apps/web/tailwind.config.ts` para usar `presets: [preset]` e **elimina** duplicados de colores.
2. **Empezar migración por capas**
   - Reemplaza HTML suelto por `<Card>` y `<Button>` en: login, topbar, sidebar, `/admin`, `/user`, `/trainer`.
   - Usa clases semánticas (`bg-card`, `text-foreground`, `border-border`).
3. **Refactor progresivo**
   - Mueve componentes locales a `@repo/design/components` cuando tengan uso transversal.
   - Evita hex/rgb hardcodeado: todo pasa por tokens HSL.
4. **QA**
   - Prueba light/dark/system, estados hover/focus/disabled, y responsive.
