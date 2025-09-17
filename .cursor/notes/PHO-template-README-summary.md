# PHO Monorepo — Resumen para ONFIT

> **Plantilla base**: PHO Monorepo (Expo + Next)  
> **Fuente**: https://github.com/divineniiquaye/pho-monorepo

## ¿Qué trae?

- Next.js 15 (web) + Expo SDK 53 (native) con **Turborepo** y **pnpm**.
- TypeScript, TailwindCSS/NativeWind, Expo Router, React Query, React Hook Form, i18n.
- Estructura limpia de `apps/` y `packages/` + tooling (ESLint/Jest/TypeScript).

## Crear un proyecto nuevo (comando original)

```bash
npx pho-monorepo@latest init my-app
```

> Nota: en ONFIT ya partimos de esta base, por lo que no es necesario volver a ejecutar el init.

## Estructura típica

```
apps/
  web/        # Next.js (App Router)
  native/     # Expo (Expo Router)
packages/
  design-system/   # UI compartida (web)
  ...              # libs/utilidades compartidas
tooling/           # eslint, jest, tsconfig, etc.
turbo.json         # tareas (dev, build, lint)
pnpm-workspace.yaml
```

## Comandos útiles (pnpm)

```bash
# Listar paquetes / scripts
pnpm -r ls --depth -1
pnpm --filter web run
pnpm --filter native run

# Web
pnpm --filter web dev
pnpm --filter web build && pnpm --filter web start

# Native
# Expo Go (sin compilar nativo)
pnpm --filter native exec expo start --go

# Dev Client (compilar nativo una vez)
pnpm --filter native run ios
pnpm --filter native run android
# después: pnpm --filter native dev
```

## Consejos rápidos

- **No cambies** de gestor (mantén **pnpm**). Commitea `pnpm-lock.yaml`.
- En **native**, mantén **React 18.x** (Expo 53). No fuerces React 19.
- Si ves _“Cannot find native module …”_, instala Dev Client (`expo run:ios|android`).
- Si aparece el warning `DEP0169 url.parse`, puedes ignorarlo o ejecutar con `NODE_OPTIONS=--no-deprecation`.

---

Para detalles completos (features, librerías y roadmap), consulta el README original del repositorio.
