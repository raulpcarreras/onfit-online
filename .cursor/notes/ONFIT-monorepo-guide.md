# ONFIT — Manual del Monorepo (PHO + pnpm)

Base: template PHO Monorepo + guías oficiales de Expo para monorepos. Objetivo: trabajar con **Next (web)** y **Expo (native)** compartiendo paquetes y reglas.

## 1) Stack y versiones
- Gestor: **pnpm** (Corepack). No migrar a Yarn/NPM/Bun.
- Node: **20/22**.
- Web: **Next.js 15** + Tailwind 3.
- Native: **Expo SDK 53** (React Native 0.79) + **NativeWind 4** + **Reanimated 3** + **Expo Router**.
- Paquetes compartidos en `packages/*` (p. ej. `@repo/design`).

## 2) Comandos de uso diario
```bash
# Listar workspaces / scripts
pnpm -r ls --depth -1
pnpm --filter web run
pnpm --filter native run

# Web (Next)
pnpm --filter web dev
pnpm --filter web build && pnpm --filter web start

# Native (Expo)
# Expo Go (rápido, sin compilar nativo)
pnpm --filter native exec expo start --go

# Development Build (compilar nativo una vez)
pnpm --filter native run ios      # iOS Simulator
pnpm --filter native run android  # Android Emulator
# Después: pnpm --filter native dev  (o expo start)
```

> Warning de Node `DEP0169 url.parse` (opcional): ejecutar con `NODE_OPTIONS=--no-deprecation` si molesta.

## 3) Estructura del repo (típica)
```
apps/
  web/        # Next.js (App Router)
    app/(auth)/login/page.tsx
    app/layout.tsx     # importa @repo/design/tailwind/global.css
  native/     # Expo + Expo Router
    app/_layout.tsx    # <Stack />
    app/index.tsx
    app/[...missing].tsx
packages/
  design-system/  # Tailwind + UI compartida (web)
tooling/          # eslint, tsconfig, jest, etc.
turbo.json        # tasks (dev, build, lint)
pnpm-workspace.yaml
```

## 4) Web (Next)
- **Layout**: NO dupliques estilos. Usa:
  ```ts
  // apps/web/app/layout.tsx
  import "@repo/design/tailwind/global.css";
  // ...
  <I18nProvider>{children}</I18nProvider>
  ```
- **Login**: pantalla en `app/(auth)/login/page.tsx` (cliente).  
- **Render-props**: si `children` puede ser función:
  ```tsx
  {typeof children === 'function' ? (children as any)() : children}
  ```
- **Accesibilidad**: `<button>`/`<a>` reales con `aria-*`; evita `div` clicables.

## 5) Native (Expo)
- **Rutas** (Expo Router) obligatorias: `_layout.tsx`, `index.tsx`, `[...missing].tsx`.
- **Estilos**: **NativeWind** con `className`; `global.css` con `@tailwind` e import en `_layout.tsx`.
- **Babel**: `['nativewind/babel','react-native-reanimated/plugin']` (Reanimated **al final**).
- **Metro**: `withNativeWind({ input: './global.css' })`.
- **Modos de dev**:
  - **Expo Go** (sin compilar): `pnpm --filter native exec expo start --go`
  - **Dev Client** (compilado con tus módulos): `pnpm --filter native run ios|android` y luego `pnpm --filter native dev`
- Si ves **“Cannot find native module …”** → necesitas **Dev Client**.

## 6) Variables de entorno (.env)
- Usa `.env.development`, `.env.production`, etc. (Expo ya integra dotenv en dev).
- No subas `.env*` al repo.

## 7) Añadir dependencias
```bash
# En un paquete concreto
pnpm --filter web add axios
pnpm --filter native add @react-native-async-storage/async-storage

# Dev-only
pnpm --filter web add -D cross-env

# Paquetes compartidos
pnpm --filter @repo/design add @radix-ui/react-slot
```
> Evita instalar en la raíz si no es tooling global.

## 8) Errores típicos y soluciones
- `DEP0169 url.parse`: warning de Node. Ignorable o `NODE_OPTIONS=--no-deprecation`.
- “No development build installed”: estás en modo Dev Client sin app instalada → `expo start --go` o `expo run:ios/android`.
- “Cannot find native module …”: requiere **Dev Client** (compilar nativo).
- “Route ... missing default export”: cada archivo en `apps/native/app/**` debe exportar por defecto un componente.
- Render de función como `children` (web): ver sección 4.

## 9) Buenas prácticas
- Mantén **pnpm** y `pnpm-lock.yaml` bajo control de versiones.
- No subas React 19 en **native** (Expo 53 usa React 18.x).
- Usa **Conventional Commits**: `feat:`, `fix:`, `chore:`…
- CI/CD: habilita `turbo` + checks de lint/test por app.

## 10) Referencias
- PHO Monorepo (README + releases)
- Expo Docs: Monorepos
- Ejemplo pnpm + Expo (byCedric)
- Turbo + Expo + Next + Clerk + Convex (alternativa)
