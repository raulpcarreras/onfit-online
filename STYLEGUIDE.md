# Sistema de estilos y layout – ONFIT (Web)

## TL;DR
- Estandarizamos estilos en utilidades (`apps/web/app/styles/utilities.css`) y variables (`apps/web/app/theme.css`).
- Usa SIEMPRE utilidades/tokens en vez de clases neutrales sueltas.
- Layout Admin: Topbar fija (viewport) + Sidebar fijo bajo la topbar. El contenido se desplaza con `lg:ml-64` y respeta la topbar con `pt-14`.
- Si un cambio de CSS no se refleja: recarga dura o reinicia el dev server (HMR puede quedarse atascado con `@layer`).

---

## 1) Estructura de layout (Admin)

Archivo: `apps/web/app/admin/layout.tsx`

- Grid simplificada: en escritorio el sidebar es fijo y el contenido se desplaza.
- Sidebar (escritorio):
  - `fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)] z-30` (queda pegado bajo la topbar)
- Topbar: componente `Topbar` (fijo en viewport) con:
  - `fixed top-0 left-0 right-0 lg:left-64 lg:right-0 z-30 h-14`
  - En escritorio ocupa exactamente desde el borde derecho del sidebar hasta el borde derecho de la ventana.
- Contenido:
  - En escritorio: `lg:ml-64` para no solapar el menú
  - Respeta topbar: `pt-14` bajo la barra para evitar recortes

Resultado: topbar y sidebar no se pisan y permanecen visibles; el contenido scrollea bajo ambos offsets.

---

## 2) Sistema de estilos

### 2.1 Variables de tema (`apps/web/app/theme.css`)
- Variables HSL para color de marca y tokens de diseño:
  - `--accent`, `--primary`, `--ring` (derivan de la marca)
  - Modo oscuro con valores específicos.
- Evita tocar colores hard‑coded en vistas; usa variables.

### 2.2 Utilidades (`apps/web/app/styles/utilities.css`)
Utilidades principales (via `@layer components`):
- `surface-card`: fondo/borde de tarjetas conforme al tema
- `surface-popover`: fondo/borde de popovers/cabeceras de tabla
- `input-base`: estilos de inputs (borde, focus, fondo)
- `icon-btn`: botón tipo outline con hover gris coherente
- `icon-ghost`: botón fantasma sin borde; hover sutil claro/oscuro
- `accent-icon`: fuerza `color` y `stroke` al color de acento (útil para Lucide)
- `icon-muted`: icono atenuado (grises coherentes)
- `link-muted`: enlaces discretos con hover
- `divider-muted`: separador suave con borde del tema

Reglas prácticas:
- Sustituye clases `neutral-*` por estas utilidades.
- Para iconos Lucide, si el color no aplica, usa `accent-icon` (controla `stroke`) o eleva especificidad.

### 2.3 Design System (botones)
Archivo: `packages/design-system/ui/button.tsx`
- Variantes relevantes:
  - `iconGhost`: botón de icono fantasma
  - `iconGhostAccent`: fantasma con color de acento
  - `iconGhostAuto`: fantasma que muestra acento en claro y blanco en oscuro

Usa estas variantes en Topbar/acciones para comportamiento coherente en ambos temas.

---

## 3) Patrones UI (ejemplos aplicados)

### 3.1 Buscador en Topbar
Componente: `apps/web/src/components/dashboard/Topbar.tsx`
- Lupa correctamente alineada y deshabilitada a eventos:

```tsx
<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 icon-muted" />
<input className="w-full h-10 pl-14 pr-3 rounded-xl input-base text-sm placeholder:text-muted-foreground" />
```

- `pl-14` evita solape y mantiene el placeholder alineado.

### 3.2 Brand en Topbar
- Bloque brand (mancuerna + texto) a la izquierda del buscador.
- Mantener `shrink-0` si fuera necesario para evitar que el input lo colapse.

### 3.3 Sidebar
Componente: `apps/web/src/components/dashboard/Sidebar.tsx`
- Etiqueta “MENU” discreta: `text-xs text-muted-foreground`
- Ítems: botones con `hover:bg-muted/40`
- “Cerrar sesión” como ítem adicional del menú (sin footer separado) para mayor previsibilidad.

---

## 4) Prioridad y troubleshooting

- Prioridad de estilos
  - Utilidades en `utilities.css` (capa components) suelen ganar a clases sueltas.
  - Para iconos Lucide: además de `color`, debes afectar `stroke` (usa `accent-icon`).
- HMR/Cache
  - Cambios a `@layer` o CSS global pueden requerir recarga dura (Cmd+Shift+R) o reiniciar `pnpm --filter web dev`.
  - Si persiste, borra `apps/web/.next`.
- Duplicidad de render
  - Evita incluir Topbar/Sidebar dentro de páginas si ya existen en el layout (provoca “parpadeos” y estilos que parecen ignorarse).

---

## 5) Checklist para tocar estilos
- [ ] ¿Usas utilidades del sistema y no `neutral-*`?
- [ ] ¿El cambio está en layout o en página (evitar duplicados)?
- [ ] ¿Has comprobado claro/oscuro y hover/focus?
- [ ] ¿Recarga dura o restart del dev server si tocaste `@layer`?
- [ ] ¿Iconos Lucide con `stroke` (usa `accent-icon`) si necesitas forzar color?

---

## 6) Comandos útiles
- Dev web: `pnpm --filter web dev`
- Build web: `pnpm --filter web build`
- Limpiar caché de Next: `rm -rf apps/web/.next`

---

## 7) Notas finales
- Prioriza siempre tokens/variables y utilidades compartidas. Inline sólo para depurar y luego vuelve a utilidades.
- Si algo “no responde”, revisa el orden de carga (`theme.css` y `utilities.css` van en `app/layout.tsx`) y que el componente que editas sea el que realmente se renderiza en esa ruta.

---

## 8) Cheat sheet de tokens y utilidades (Web)

- Fondos y texto
  - `bg-background`, `text-foreground`
  - Tarjetas/Popovers: `surface-card`, `surface-popover`
- Bordes y separadores
  - `border border-border`, `divider-muted`
- Inputs
  - Base: `input-base`
- Iconos
  - Acento forzado: `accent-icon`
  - Atenuado: `icon-muted`
  - Icon button ghost (color acento claro / blanco oscuro): `iconGhostAuto` + `btn-ghost-icon`
- Hovers coherentes
  - Elementos de lista: `hover:bg-muted/40`
  - Botones con borde: `hover:border-neutral-300 dark:hover:border-neutral-600`

Sustituciones típicas:
- `bg-neutral-950` → `bg-background`
- `text-white` → `text-foreground`
- `hover:bg-neutral-900` → `hover:bg-muted/40`
- `border-neutral-*` → `border-border`

---

## 9) Equivalencias y pautas en Native (Expo + NativeWind)

- Principios
  - Prioriza componentes del Design System (`@repo/design/ui/*`) y sus `variant`/`size` antes que clases sueltas.
  - Evita colores hard‑coded. En iconos, usa variantes (p.ej. botones `iconGhostAuto`).
- Iconos (lucide)
  - Si usas `lucide-react-native` y hay interop para `className`, aplica utilidades como `accent-icon`. Si no, pasa `color`/`stroke` desde el tema del DS.
  - En botones de icono ghost, usa el propio `Button` con `variant="iconGhostAuto"` y coloca el icono sin color explícito cuando sea posible.
- Estilos coherentes
  - Inputs: utiliza los del DS. Evita `View` + `TextInput` caseros para no romper el look.
  - Superficies: reaprovecha contenedores del DS o `surface-card` cuando estés en web; en native, usa las variantes DS equivalentes.
- Navegación/FOUC
  - Mantén loaders de pantalla completa (componente reutilizable) mientras confirmas sesión/rol.
- Dev Native
  - Arranque Expo Go: `pnpm --filter native exec expo start --go`
  - Dev Client: `pnpm --filter native run ios|android` (una vez) y luego `pnpm --filter native dev`

---

## 10) Ejemplos rápidos

- Botón icono ghost (Topbar/acciones):
  - Web: `<Button variant="iconGhostAuto" className="p-2 h-auto btn-ghost-icon">...` 
  - Icono dentro sin `text-*`: deja que herede color; si no aplica, usa `btn-ghost-icon`.
- CTA primario (login/signup):
  - `bg-primary text-primary-foreground hover:brightness-95 disabled:opacity-60`
- Item de menú (Sidebar):
  - `px-3 py-2 rounded-lg hover:bg-muted/40` con icono `icon-muted`
