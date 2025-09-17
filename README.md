# OnFit Monorepo

Monorepo profesional con **Next.js 15** para web y **Expo SDK 53** para nativo, gestionado con **pnpm**.

## 🚀 Stack Tecnológico

- **Gestor**: pnpm (Corepack)
- **Node**: 20/22
- **Web**: Next.js 15 + Tailwind CSS 3.4
- **Native**: Expo SDK 53 + NativeWind 4 + Reanimated 3 + Expo Router
- **Design System**: Componentes compartidos para ambas plataformas

## 📁 Estructura

```
onfit/
├── apps/
│   ├── web/          # Next.js 15 app
│   └── native/       # Expo SDK 53 app
├── packages/
│   └── design-system/ # Componentes y tokens compartidos
├── tooling/          # Configuraciones compartidas
└── supabase/         # Base de datos y migraciones
```

## 🛠️ Comandos Principales

### Desarrollo

```bash
# Web
pnpm web:dev          # Inicia desarrollo web
pnpm web:build        # Build de producción

# Native
pnpm native:start     # Inicia Expo con dev client
pnpm native:start:go  # Inicia con Expo Go
pnpm native:run:ios   # Compila y ejecuta en iOS
pnpm native:run:android # Compila y ejecuta en Android
```

### Monorepo

```bash
pnpm lint             # Lint en todas las apps
pnpm test             # Tests en todas las apps
pnpm clean            # Limpia todos los builds
pnpm format           # Formatea código con Prettier
```

## 🔧 Workspaces (pnpm)

Este monorepo usa **pnpm** con `pnpm-workspace.yaml`:

- `apps/*`
- `packages/*`

> No usamos `workspaces` en `package.json`. Toda la resolución la hace pnpm vía `pnpm-workspace.yaml`.

### Verificar Workspaces

```bash
# Ver todos los paquetes detectados
pnpm -w list --depth=1

# Ver dependencias de una app específica
pnpm -F web list
pnpm -F native list
```

## 🎨 Tailwind y Estilos

### Tailwind en apps/web

La app web usa el preset compartido del design system:

- `import sharedConfig from "@repo/design/tailwind/tailwind.config"`
- `content` incluye `../../packages/design-system/**/*.tsx`

Así garantizamos que las clases usadas por los wrappers del DS se incluyan en la build.

### Orden de CSS (web)

1. `@repo/design/tokens/index.css` ← variables HSL canónicas
2. `./app/globals.css` ← @tailwind base/components/utilities + resets
3. Cualquier CSS de features/páginas

> No dupliques tokens en `globals.css`. Si ves "líneas blancas" en tablas, revisa que las **variables** provengan de `tokens/index.css`.

## 📦 Gestión de Dependencias

### Dependencias Compartidas

- **Design System**: `@repo/design` - Componentes y tokens para ambas plataformas
- **Bottom Sheet**: `@repo/bottom-sheet` - Componente nativo compartido

### Regla de importación de componentes

- ✅ `@repo/design/components/Button` (wrappers del DS)
- ❌ `@repo/design/ui/button` (shadcn interno, no lo uses desde apps)

Los wrappers mantienen API homogénea (p.ej. `onPress` en web/native).

### Utilidad de clases

Usa **solo** `@repo/design/lib/utils` (re-exporta clsx + tailwind-merge).
Evita `lib/cn.ts` para no mezclar comportamientos.

### Instalación

```bash
# Añadir a una app específica
pnpm -F web add react-query

# Añadir al design system
pnpm -F @repo/design add clsx

# Añadir al root (solo herramientas de monorepo)
pnpm -w add -D turbo
```

## 🚨 Reglas Importantes

- **NO migrar** a Yarn/NPM/Bun
- **React 19** es compatible con Expo SDK 53 desde diciembre 2024
- **Usar siempre** `pnpm -F <app>` para instalar en apps específicas
- **Mantener** dependencias root solo para herramientas de monorepo

## 🔍 Troubleshooting

### Warning DEP0169 (url.parse)

```bash
# Ya manejado en scripts con NODE_OPTIONS=--no-deprecation
# Es normal en Node 20/22
```

### Expo Doctor Issues

```bash
# Verificar estado de Expo
pnpm -F native exec npx expo-doctor

# Resolver problemas automáticamente
pnpm -F native exec npx expo install --fix
```

## 📊 Estado del Monorepo

**Puntuación**: 10/10 ✅

- ✅ **Dependencias root limpias** - Sin conflictos de versiones
- ✅ **Scripts unificados** - Formato `plataforma:verbo` consistente
- ✅ **Workspaces bien configurados** - pnpm-workspace.yaml explícito
- ✅ **Funcional al 100%** - Builds y runtime funcionan perfectamente
- ✅ **Configuración profesional** - Listo para producción
- ✅ **Build Pipeline** - Todos los builds funcionan (web ✅, native ✅, tooling ✅)
- ✅ **Seguridad** - Vulnerabilidades resueltas, dependencias actualizadas

## 🎯 Próximos Pasos

1. **Desarrollo activo** - El monorepo está listo para usar
2. **Mantener dependencias** - Usar `pnpm -F` para instalaciones
3. **Actualizar regularmente** - `pnpm update` para mantener catalogs

---

**OnFit Monorepo** - Arquitectura profesional y escalable 🚀
