
# ONFIT — Guía Extendida del Monorepo (PHO + pnpm + Next 15 + Expo 53)

Este documento amplía el README resumido e incluye detalles de **Turbo**, **EAS**, estructura de **packages** y problemas comunes.

---

## 0) Stack
- **Gestor:** pnpm (Corepack).
- **Node:** 20/22.
- **Web:** Next.js 15 (App Router) + Tailwind 3.
- **Native:** Expo SDK 53 (RN 0.79) + NativeWind 4 + Reanimated 3 + Expo Router.
- **Tooling:** Turborepo, TypeScript, ESLint/Jest (según template).

---

## 1) Estructura recomendada
```
apps/
  web/                      # Next.js
    app/(auth)/login/page.tsx
    app/layout.tsx          # importa @repo/design/tailwind/global.css
  native/                   # Expo + Expo Router
    app/_layout.tsx         # <Stack />
    app/index.tsx
    app/[...missing].tsx
packages/
  design-system/            # UI compartida (web). Evita dependencias de react-native aquí
  sdk/                      # lógica TS pura: modelos, zod, utils, mappers (opcional)
  api-client/               # cliente HTTP (fetch/axios), endpoints compartidos (opcional)
tooling/
  eslint/ jest/ typescript/ i18n/ ...
turbo.json                  # tasks de Turbo
pnpm-workspace.yaml
```

**Consejo de dependencia:**  
- **web-only** → metelo en `apps/web` o en `packages/design-system` (si es UI web).  
- **native-only** → metelo en `apps/native`.  
- **compartido (lógica)** → `packages/sdk` (TypeScript puro, sin React/DOM/RN).

---

## 2) Comandos de uso (pnpm)
```bash
# Workspaces y scripts
pnpm -r ls --depth -1
pnpm --filter web run
pnpm --filter native run

# Web (Next)
pnpm --filter web dev
pnpm --filter web build && pnpm --filter web start

# Native (Expo)
# Expo Go (sin compilar nativo)
pnpm --filter native exec expo start --go

# Development Build (compilar nativo una vez, instala módulos nativos)
pnpm --filter native run ios         # iOS Simulator
pnpm --filter native run android     # Android Emulator
# Después: pnpm --filter native dev  (o expo start)

# Limpiar caches (cuando algo huele raro)
pnpm -r run clean || true
watchman watch-del . && watchman watch-project .  # macOS (si tienes watchman)
```

> **Warning Node DEP0169**: puedes ignorarlo o arrancar con `NODE_OPTIONS=--no-deprecation`.

---

## 3) Turbo (tareas y filtros)
`turbo.json` define tareas estándar, ej.:

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "build/**", "dist/**"]
    },
    "lint": { "outputs": [] },
    "test": { "outputs": ["coverage/**", "junit.xml"] }
  }
}
```

**Uso:**
```bash
# Ejecutar dev solo en web
pnpm turbo run dev --filter=web

# Ejecutar build en todo (respetando dependencias)
pnpm turbo run build

# Lint en todo
pnpm turbo run lint
```

**Filtros útiles:** `--filter=web`, `--filter=@repo/design`, `--filter=./apps/native`.

---

## 4) Expo: Go vs Development Build vs EAS
- **Expo Go** → rapidez, sin compilar nativo. **No** soporta módulos nativos externos.
- **Development Build (Dev Client)** → compilas una vez (`expo run:ios/android`), ya tienes tus módulos nativos disponibles en dev.
- **EAS Build** → genera **IPA/AAB** para distribución. Config en `eas.json`.

**Ejemplo `eas.json`:**
```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  },
  "submit": { "production": {} }
}
```

**Comandos:**
```bash
# Configurar EAS en el repo
pnpm dlx eas-cli@latest build:configure

# Builds
eas build -p ios --profile development
eas build -p android --profile development
```

---

## 5) Config clave (Native)
- **babel.config.js**:
```js
module.exports = function(api){
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel','react-native-reanimated/plugin'], // Reanimated SIEMPRE el último
  };
};
```
- **tailwind.config.js (CommonJS)**:
```js
const { preset } = require('nativewind/preset');
module.exports = {
  presets: [preset],
  content: ['./app/**/*.{ts,tsx}','./App.tsx'],
  theme: { extend: {} },
  plugins: [],
};
```
- **metro.config.js**:
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```
- **Expo Router obligatorio**: `_layout.tsx`, `index.tsx`, `[...missing].tsx` con **default export**.

---

## 6) Config clave (Web)
- **layout** importa `@repo/design/tailwind/global.css` (no dupliques `globals.css`).  
- Evita render-props sin invocar; si `children` puede ser función:
```tsx
{typeof children === 'function' ? (children as any)() : children}
```
- `pointerEvents` en DOM → usa `style={{ pointerEvents: 'none' }}`.

---

## 7) Variables de entorno
- Usa `.env.development`, `.env.production`, etc. **No** las subas a Git.
- Expo ya integra dotenv en dev (ver logs).  
- En Next, carga con `process.env.MI_VAR` (recuerda exponer públicas con `NEXT_PUBLIC_...`).

---

## 8) Añadir dependencias
```bash
# Paquete web
pnpm --filter web add @tanstack/react-query

# Paquete native
pnpm --filter native add react-native-gesture-handler

# Paquete compartido
pnpm --filter @repo/design add @radix-ui/react-slot

# Dev-only
pnpm --filter web add -D cross-env
```

**Regla de oro:** instala en **el paquete** donde se usa. Evita instalar en la raíz salvo tooling global.

---

## 9) Tests, Lint, Formats
- Ejecuta `pnpm turbo run lint` y `pnpm turbo run test`.
- Asegura que `eslint` ignora archivos generados, y que `tsconfig` referencia `tooling/typescript` si aplica.

---

## 10) CI/CD (GitHub Actions ejemplo)
`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint test build --cache-dir=.turbo-cache
```

Para EAS, usa **EAS GitHub Actions** o ejecuta EAS desde tu propia máquina/CI con variables seguras.

---

## 11) Versionado/Release (opcional)
- Puedes usar **Changesets** para versionar `packages/*` y publicar en GPR/NPM si hiciera falta.
- Para apps (`apps/*`), versionado normal por tag y changelog.

---

## 12) Troubleshooting (rápido)
- **Node `DEP0169 url.parse`** → warning deprecado; opcionalmente `NODE_OPTIONS=--no-deprecation`.
- **“No development build installed”** → estás en Dev Client sin app instalada → `expo start --go` o `expo run:ios/android`.
- **“Cannot find native module …”** → necesitas Dev Client (compilar).
- **“Route ... missing default export”** (Expo Router) → cada archivo en `app/**` debe exportar por defecto un componente.
- **Watchman recrawl** →
  ```bash
  watchman watch-del . && watchman watch-project .
  ```
- **iOS Pods lentos** → `sudo gem install cocoapods -N` y `pod repo update` si hace falta.

---

## 13) Reglas rápidas a recordar
- Mantén **pnpm** (no cambies de PM).
- **React 18** en native (Expo 53). No fuerces React 19.
- Compartir **lógica** en `packages/sdk` (TS puro). UI nativa y web separadas.
- Commits tipo **Conventional**: `feat:`, `fix:`, `chore:`…
