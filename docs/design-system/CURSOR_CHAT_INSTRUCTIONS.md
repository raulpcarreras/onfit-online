# Onfit — Instrucciones para Cursor Chat (IA del IDE)
*Última revisión: 2025-08-23T09:59:55.371298 UTC*

> Este documento te indica **cómo modificar UI** en este monorepo sin romper el sistema.
> Léelo **antes de tocar estilos**.

## Principios de oro
1. **Nunca** introducir CSS suelto nuevo en web. Usa clases **Tailwind** o wrappers.
2. **Nunca** hardcodear colores/espaciados: usa **tokens**/roles (`bg`, `fg`, `primary`, etc.).
3. **Una sola definición de variantes** por componente (usa `tailwind-variants`/`cva`).
4. **No** modificar componentes shadcn generados salvo bugfixes mínimos. Crea **wrappers**.
5. El **Theme Bridge** manda: clases con roles resuelven light/dark en runtime.

## Rutas y directorios clave
- Tokens: `packages/tokens/src/index.ts`
- Tailwind shared: `packages/tailwind-config/tailwind.shared.ts`
- UI (wrappers + variantes): `packages/ui/src/**`
- Web app: `apps/web/**`
- Native app: `apps/native/**`

## Cambiar un color de marca
- Editar **solo** en `packages/tokens/src/index.ts` → `colors.light.primary` y `colors.dark.primary`.
- No tocar `globals.css` para esto.
- No tocar clases individuales en los componentes.

## Crear/editar variantes de un componente
- Archivo `packages/ui/src/components/<name>.variants.ts` con `tv(...)` o `cva(...)`.
- No dupliques clases en web/native. Ambos importan **la misma función** de variantes.
- Ejemplo base: `button.variants.ts` ya definido.

## Crear un nuevo componente UI
1. Define variantes (`*.variants.ts`).
2. Implementa el componente en `packages/ui/src/components/<Name>.tsx`.
   - Si necesitas distinto por plataforma, usa `*.web.tsx` y `*.native.tsx`.
   - En RN usa `nativewind` (`className`), en web usa `<div className="...">`.
3. Exporta en `packages/ui/src/components/index.ts`.
4. Consúmelo en apps (`apps/web` y/o `apps/native`).

## Añadir espaciados/radii
- Cambia tokens: `space` o `radii` en `packages/tokens/src/index.ts`.
- Tailwind shared traduce a theme. Ya puedes usar `p-4.5` (ejemplo) si está en tokens.

## Crear páginas/pantallas
- **Native**: `apps/native/app/` (expo-router); **no** metas `/login` dentro de un AuthGuard.
- **Web**: `apps/web/app/` (Next.js app router) o `pages/` legacy.
- Estilos **siempre** con clases (no CSS suelto).

## Evitar errores conocidos
- Reanimated: plugin **último** en Babel (native).
- `expo-router/babel` deprecado en SDK 50 → usa `babel-preset-expo`.
- No acceder a ENV desde componentes UI (hazlo en capa de servicios).

## Ejemplo rápido (botón con intent “ghost” y size “sm”)
```tsx
import { Button } from "@ui/components";

<Button intent="ghost" size="sm">Cancelar</Button>
```

## Ejemplo rápido (nueva variante “link” en Button)
1. Edita `packages/ui/src/components/button.variants.ts`:
```ts
intent: {
  primary: "...",
  ghost: "...",
  link: "bg-transparent underline text-primary hover:opacity-80",
}
```
2. No toques nada más. Usa `<Button intent="link">...</Button>`.

## Test / checklist antes de commit
- [ ] No CSS suelto nuevo
- [ ] Sin hardcodes (colores/spacing)
- [ ] Variantes en un solo sitio
- [ ] Light/dark OK
- [ ] Web + native OK
- [ ] shadcn intacto (si aplica)
