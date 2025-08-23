# Onfit — Auditoría de Estilos (shadcn/ui)

**Fecha:** 2025-08-23T10:29:37.327302Z

Este informe documenta los cambios realizados para asegurar que los componentes de **shadcn/ui** se vean con su aspecto **por defecto**, minimizando CSS personalizado que pudiera sobrescribir estilos.

## Resumen
- Archivos CSS/SCSS/LESS editados: **2**
  - apps/web/app/globals.css
  - apps/web/app/styles/utilities.css

## Criterios aplicados
- Se han mantenido intactos los **tokens** y el **global reset** del diseño:
  - `packages/design-system/tokens/**`
  - `packages/design-system/tailwind/global.css`
- En el resto de ficheros CSS/SCSS/LESS:
  - Se conservaron **@tailwind**, **@import** y otras `@rules` técnicas.
  - El resto de reglas se encapsularon en un *scope inactivo*:  
    `:where(html.__unused_overrides__) { ... }`  
    (esto neutraliza los overrides sin borrar el código).

## Hallazgos en CSS
### apps/web/app/globals.css
- Cambiado: **True**
- Selectores sospechosos detectados: `\.btn\b, button\b`

### apps/web/app/styles/utilities.css
- Cambiado: **True**
- Selectores sospechosos detectados: `\.btn\b`


## Hallazgos en código (no modificados)
Se detectaron patrones a considerar para futuras refactorizaciones (sin cambios automáticos):
- apps/native/app/(protected)/admin.tsx: inline `style={{...}}`
- apps/native/app/(protected)/client.tsx: inline `style={{...}}`
- apps/native/app/(protected)/trainer.tsx: inline `style={{...}}`
- apps/native/features/auth/LoginScreen.tsx: inline `style={{...}}`
- apps/native/src/lib/auth-guard.tsx: inline `style={{...}}`
- apps/web/app/(auth)/login/LoginForm.tsx: Tailwind con `[arbitrary]`
- apps/web/app/(protected)/admin/layout-client.tsx: Tailwind con `[arbitrary]`
- apps/web/app/(protected)/admin/users/page.tsx: Tailwind con `[arbitrary]`
- apps/web/app/(protected)/admin/users/edit/page.tsx: Tailwind con `[arbitrary]`
- apps/web/app/(protected)/user/layout.tsx: Tailwind con `[arbitrary]`
- apps/web/app/test-theme/page.tsx: inline `style={{...}}`
- apps/web/src/components/RevenueChart.tsx: Tailwind con `[arbitrary]`
- apps/web/src/components/dashboard/UserSidebar.tsx: Tailwind con `[arbitrary]`
- apps/web/src/components/dashboard/layout/Sidebar.tsx: Tailwind con `[arbitrary]`
- apps/web/src/components/dashboard/layout/Topbar.tsx: inline `style={{...}}`, Tailwind con `[arbitrary]`
- packages/bottom-sheet/router/view.tsx: inline `style={{...}}`
- packages/bottom-sheet/src/provider.tsx: inline `style={{...}}`
- packages/design-system/components/Avatar/index.native.tsx: inline `style={{...}}`
- packages/design-system/components/Checkbox/index.native.tsx: inline `style={{...}}`
- packages/design-system/components/Loader/index.web.tsx: inline `style={{...}}`
- packages/design-system/components/Progress/index.native.tsx: inline `style={{...}}`
- packages/design-system/components/Progress/index.web.tsx: inline `style={{...}}`
- packages/design-system/components/example/Command.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/ContextMenu.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/Form.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/NavigationMenu.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/SidebarDialog.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/Tabs.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/index.tsx: Tailwind con `[arbitrary]`
- packages/design-system/components/example/Drawer/charts.tsx: inline `style={{...}}`, Tailwind con `[arbitrary]`
- packages/design-system/components/example/Drawer/index.web.tsx: inline `style={{...}}`, Tailwind con `[arbitrary]`
- packages/design-system/layout/index.tsx: inline `style={{...}}`
- packages/design-system/providers/index.tsx: inline `style={{...}}`
- packages/design-system/ui/chart.tsx: inline `style={{...}}`, Tailwind con `[arbitrary]`
- packages/design-system/ui/drawer.tsx: Tailwind con `[arbitrary]`
- packages/design-system/ui/marquee.tsx: inline `style={{...}}`
- packages/design-system/ui/navigation-menu.tsx: Tailwind con `[arbitrary]`
- packages/design-system/ui/progress.tsx: inline `style={{...}}`
- packages/design-system/ui/radio-group.tsx: Tailwind con `[arbitrary]`
- packages/design-system/ui/scroll-area.tsx: Tailwind con `[arbitrary]`
- packages/design-system/ui/select.tsx: inline `style={{...}}`
- packages/design-system/ui/sidebar.tsx: inline `style={{...}}`, Tailwind con `[arbitrary]`
- packages/design-system/ui/slider.tsx: Tailwind con `[arbitrary]`
- packages/design-system/ui/calender/index.tsx: inline `style={{...}}`

## Siguientes pasos sugeridos
- Migrar estilos `inline` y `[arbitrary]` a **variantes** y **tokens**.
- Revisar wrappers de componentes para que sólo acepten `className` y variantes, evitando CSS ad-hoc.
- Documentar *Theme Bridge* y convenciones de tokens en la guía de diseño.