
# ONFIT — Checklist de Pull Request

## General
- [ ] El PR tiene título **Conventional Commit** (`feat:`, `fix:`, `chore:`…).
- [ ] Se limita a un objetivo (sin “megapack” de cambios).
- [ ] Incluye descripción clara, screenshots si hay UI.

## Web (Next)
- [ ] No se ha duplicado import de estilos globales (usar `@repo/design/tailwind/global.css`).
- [ ] No se usan `div` clicables cuando corresponde `button`/`a` + `aria-*`.
- [ ] Si `children` puede ser función, se **invoca** correctamente.
- [ ] Tailwind 3: clases coherentes y sin duplicación innecesaria.
- [ ] Sin errores/avisos en consola (Next overlay).

## Native (Expo)
- [ ] `_layout.tsx`, `index.tsx`, `[...missing].tsx` exportan **por defecto**.
- [ ] `babel.config.js`: `react-native-reanimated/plugin` está **al final**.
- [ ] `tailwind.config.js` CommonJS con `presets: [require('nativewind/preset')]` y `content` correcto.
- [ ] Sin imports web-only (DOM) en código nativo.
- [ ] Si se añadieron módulos nativos → probado con **Dev Client** (`expo run:ios/android`).

## Packages compartidos
- [ ] Código compartido en `packages/sdk` es **TS puro** (sin React/DOM/RN).
- [ ] `design-system` no introduce dependencias RN (si es web-only).

## Tests / Lint / Types
- [ ] Pasa `pnpm turbo run lint` y `pnpm turbo run test` (si aplica).
- [ ] TS sin `any` innecesarios; tipos públicos estables.
- [ ] No credenciales ni `.env*` en cambios.

## Performance/ DX
- [ ] No `console.log` ruidosos; logs útiles y filtrables.
- [ ] Dependencias instaladas **en el paquete correcto** (no en raíz por defecto).
- [ ] Documentación mínima en el PR si hay decisiones de arquitectura.
