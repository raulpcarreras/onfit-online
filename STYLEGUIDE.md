# Sistema de Estilos ONFIT - Guía Completa

## 🎯 Visión General

ONFIT utiliza un **sistema de design tokens unificado** que funciona tanto en **web (Next.js + Tailwind)** como en **nativo (Expo + NativeWind)**. Este sistema garantiza coherencia visual, facilita cambios de tema y mantiene la consistencia entre plataformas.

---

## 🏗️ Arquitectura del Sistema

### 1. **Design Tokens Compartidos**
**Archivo:** `packages/design-system/tokens.ts`

```typescript
export const tokens = {
  light: {
    bg: "0 0% 98%",           // #fafafa
    card: "0 0% 100%",        // #ffffff
    text: "222.2 47.4% 11.2%", // #0b0b0c
    primary: "38 92% 50%",    // #F59E0B (amber-500)
    // ... más tokens
  },
  dark: {
    bg: "0 0% 5%",            // #0a0a0a
    card: "0 0% 9%",          // #171717
    text: "0 0% 90%",         // #e5e5e5
    primary: "38 92% 50%",    // #F59E0B (amber-500)
    // ... más tokens
  }
}
```

**Características:**
- ✅ **Un solo origen de verdad** para colores
- ✅ **Valores HSL** para flexibilidad
- ✅ **Temas light/dark** predefinidos
- ✅ **Exportable** para web y nativo

### 2. **CSS Variables (Web)**
**Archivo:** `apps/web/app/globals.css`

```css
:root {
  --bg: 0 0% 98%;
  --card: 0 0% 100%;
  --text: 222.2 47.4% 11.2%;
  --primary: 38 92% 50%;
  --primary-fg: 0 0% 100%;
  /* ... más variables */
}

.dark {
  --bg: 0 0% 5%;
  --card: 0 0% 9%;
  --text: 0 0% 90%;
  --primary: 38 92% 50%;
  --primary-fg: 0 0% 5%;
  /* ... más variables */
}
```

**Características:**
- ✅ **Mapeo directo** de tokens a CSS variables
- ✅ **Cambio automático** con `next-themes`
- ✅ **Soporte para HSL** en Tailwind

### 3. **Configuración de Tailwind**
**Archivo:** `apps/web/tailwind.config.ts`

```typescript
theme: {
  extend: {
    colors: {
      bg: "hsl(var(--bg))",
      card: "hsl(var(--card))",
      text: "hsl(var(--text))",
      primary: "hsl(var(--primary))",
      primaryFg: "hsl(var(--primary-fg))",
      // ... más colores
    }
  }
}
```

**Características:**
- ✅ **Mapeo automático** a `hsl(var(--token))`
- ✅ **Clases semánticas** como `bg-primary`, `text-card`
- ✅ **Soporte completo** para temas light/dark

---

## 🎨 Uso de Colores

### **Clases Principales**
```tsx
// Fondos
className="bg-bg"           // Fondo principal
className="bg-card"         // Fondo de tarjetas
className="bg-primary"      // Fondo naranja/ámbar

// Texto
className="text-text"       // Texto principal
className="text-primary"    // Texto naranja/ámbar
className="text-muted"      // Texto atenuado

// Bordes
className="border-border"   // Bordes del tema
className="border-primary"  // Bordes naranjas

// Estados
className="hover:bg-secondary"    // Hover sutil
className="focus:ring-primary"    // Focus naranja
```

### **Ejemplos Prácticos**
```tsx
// Botón primario
<button className="bg-primary text-primary-fg hover:bg-primary/90">
  Acción Principal
</button>

// Tarjeta
<div className="bg-card text-text border border-border rounded-lg p-4">
  Contenido de la tarjeta
</div>

// Input
<input className="bg-bg text-text border border-border focus:ring-2 focus:ring-primary" />
```

---

## 🌓 Sistema de Temas

### **Configuración**
**Archivo:** `apps/web/src/providers/theme.tsx`

```tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="system" 
  enableSystem
  disableTransitionOnChange={false}
  storageKey="onfit-theme"
>
```

### **Cambio de Tema**
```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();

// Cambiar tema
setTheme("light");    // Tema claro
setTheme("dark");     // Tema oscuro
setTheme("system");   // Tema del sistema
```

### **Clases CSS Automáticas**
- **Tema claro:** Sin clase especial
- **Tema oscuro:** Clase `.dark` en `<html>`
- **Transiciones:** Automáticas entre temas

---

## 📱 Componentes del Dashboard

### **Topbar**
**Archivo:** `apps/web/src/components/dashboard/Topbar.tsx`

**Características:**
- ✅ **Brand:** Icono + "ONFIT Admin" (Admin en naranja)
- ✅ **Breadcrumb:** Navegación contextual
- ✅ **Buscador:** Centrado y funcional
- ✅ **Selector de tema:** Dropdown funcional
- ✅ **Usuario:** Avatar y información

**Estructura:**
```tsx
<div className="h-14 border-b border-border bg-background/80 backdrop-blur">
  {/* Brand + Breadcrumb */}
  {/* Buscador centrado */}
  {/* Tema + Notificaciones + Usuario */}
</div>
```

### **Sidebar**
**Archivo:** `apps/web/src/components/dashboard/Sidebar.tsx`

**Características:**
- ✅ **Etiqueta "MENU":** Estilo programador
- ✅ **Navegación:** Dashboard, Usuarios, Pagos, Ajustes
- ✅ **Cerrar sesión:** Integrado en el menú
- ✅ **Hover effects:** Consistentes con el tema

### **Layout Admin**
**Archivo:** `apps/web/app/admin/layout.tsx`

**Estructura:**
```tsx
<div className="min-h-screen bg-bg">
  <Topbar onOpenMenu={onOpenMenu} />
  <Sidebar isOpen={isOpen} onClose={onClose} />
  <main className="lg:ml-64 pt-14">
    {children}
  </main>
</div>
```

---

## 🔧 Troubleshooting

### **Problemas Comunes**

#### **1. Colores no se aplican**
```bash
# Verificar que las variables CSS estén cargadas
# En DevTools > Elements > :root
# Deberías ver --primary, --bg, etc.

# Si no están, verificar orden de importación en layout.tsx
import "./globals.css";  // Debe ir ANTES de Tailwind
```

#### **2. Tema no cambia**
```bash
# Verificar que next-themes esté funcionando
# En DevTools > Elements > <html>
# Debería tener clase "dark" en modo oscuro

# Si no funciona, limpiar localStorage
localStorage.removeItem('onfit-theme');
```

#### **3. Hover effects no funcionan**
```bash
# Verificar que no haya conflictos de CSS
# Usar clases como hover:bg-secondary
# Evitar !important innecesarios
```

### **Comandos de Limpieza**
```bash
# Limpiar cache de Next.js
rm -rf apps/web/.next
rm -rf apps/web/.turbo

# Reiniciar servidor
pnpm --filter web dev
```

---

## 📋 Checklist de Implementación

### **Para Nuevos Componentes**
- [ ] **Usar tokens del sistema:** `bg-primary`, `text-card`
- [ ] **Evitar colores hardcoded:** No `bg-red-500`, usar `bg-destructive`
- [ ] **Soporte para temas:** Funcionar en light y dark
- [ ] **Hover states:** Incluir `hover:bg-secondary` o similar
- [ ] **Consistencia:** Seguir patrones del dashboard

### **Para Modificaciones**
- [ ] **Actualizar tokens** si se añaden nuevos colores
- [ ] **Verificar CSS variables** en `globals.css`
- [ ] **Actualizar Tailwind config** si se añaden nuevos tokens
- [ ] **Probar en ambos temas** antes de commit

---

## 🚀 Próximos Pasos

### **Mejoras Planificadas**
- [ ] **Más variantes de botones** en el design system
- [ ] **Animaciones** consistentes entre temas
- [ ] **Iconos personalizados** para ONFIT
- [ ] **Componentes nativos** usando tokens compartidos

### **Mantenimiento**
- [ ] **Revisar tokens** mensualmente
- [ ] **Actualizar documentación** con nuevos componentes
- [ ] **Auditoría de colores** para accesibilidad
- [ ] **Performance** de CSS variables

---

## 📚 Referencias

- **Design Tokens:** [Figma Design Tokens](https://www.figma.com/community/file/888409328500312931)
- **CSS Variables:** [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- **Tailwind CSS:** [Documentación oficial](https://tailwindcss.com/docs)
- **Next Themes:** [GitHub next-themes](https://github.com/pacocoursey/next-themes)

---

*Última actualización: $(date)*
*Versión del sistema: 1.0.0*
