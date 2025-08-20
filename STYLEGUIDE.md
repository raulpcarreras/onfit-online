# Sistema de Estilos ONFIT - Guía Completa v3.0

## 🎯 Visión General

ONFIT utiliza un **sistema de design tokens unificado y canónico** que sigue los estándares de shadcn/ui, implementado con **componentes plataforma-específicos** para garantizar la máxima compatibilidad entre web y nativo.

---

## 🏗️ Arquitectura del Sistema

### 1. **Componentes Plataforma-Específicos**
**Estructura:** `packages/design-system/components/`

```
packages/design-system/
├── components/
│   ├── Button/
│   │   ├── index.web.tsx      # Web: reexporta shadcn/ui
│   │   └── index.native.tsx   # Native: React Native puro
│   ├── Input/
│   │   ├── index.web.tsx      # Web: reexporta shadcn/ui
│   │   └── index.native.tsx   # Native: React Native puro
│   ├── Card/
│   │   ├── index.web.tsx      # Web: reexporta shadcn/ui
│   │   └── index.native.tsx   # Native: stub RN
│   └── ... (otros componentes)
├── ui/                        # shadcn/ui components (solo web)
└── index.ts                   # Exporta desde components/
```

**Características:**
- ✅ **API unificada** - mismo import en web y nativo
- ✅ **Implementación específica** - web usa shadcn/ui, nativo usa RN
- ✅ **Resolución automática** - Next.js usa `.web.tsx`, Metro usa `.native.tsx`
- ✅ **Tipado compartido** - mismas props y tipos en ambas plataformas

### 2. **Design Tokens Canónicos**
**Archivo:** `packages/design-system/tokens.ts`

```typescript
export const tokens = {
  light: {
    background: "0 0% 98%",           // #fafafa
    foreground: "222.2 47.4% 11.2%", // #0b0b0c
    card: "0 0% 100%",               // #ffffff
    "card-foreground": "222.2 47.4% 11.2%",
    popover: "0 0% 100%",            // #ffffff
    "popover-foreground": "222.2 47.4% 11.2%",
    primary: "38 92% 50%",           // #F59E0B (amber-500)
    "primary-foreground": "24 10% 8%",
    // ... más tokens canónicos
  },
  dark: {
    background: "240 7% 8%",         // #0a0a0a
    foreground: "0 0% 96%",          // #f5f5f5
    card: "240 6% 10%",              // #171717
    "card-foreground": "0 0% 96%",
    // ... más tokens canónicos
  }
}
```

**Características:**
- ✅ **Nombres canónicos** de shadcn/ui (`--background`, `--foreground`)
- ✅ **Un solo origen de verdad** para colores
- ✅ **Valores HSL** para flexibilidad
- ✅ **Temas light/dark** predefinidos
- ✅ **Exportable** para web y nativo

### 3. **CSS Variables (Web)**
**Archivo:** `apps/web/app/globals.css`

```css
:root {
  --background: 0 0% 98%;
  --foreground: 222.2 47.4% 11.2%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;
  --primary: 38 92% 50%;
  --primary-foreground: 24 10% 8%;
  /* ... más variables canónicas */
}

.dark {
  --background: 240 7% 8%;
  --foreground: 0 0% 96%;
  --card: 240 6% 10%;
  --card-foreground: 0 0% 96%;
  /* ... más variables canónicas */
}
```

**Características:**
- ✅ **Mapeo directo** de tokens a CSS variables
- ✅ **Cambio automático** con `next-themes`
- ✅ **Soporte para HSL** en Tailwind
- ✅ **Orden de carga correcto** (antes que Tailwind)

### 4. **Configuración de Tailwind**
**Archivo:** `apps/web/tailwind.config.ts`

```typescript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      "card-foreground": "hsl(var(--card-foreground))",
      popover: "hsl(var(--popover))",
      "popover-foreground": "hsl(var(--popover-foreground))",
      primary: "hsl(var(--primary))",
      "primary-foreground": "hsl(var(--primary-foreground))",
      // ... más colores canónicos
    },
    borderRadius: {
      lg: "12px",
      md: "10px",
      sm: "8px",
    },
  },
}
```

**Características:**
- ✅ **Mapeo automático** a `hsl(var(--token))`
- ✅ **Clases semánticas** como `bg-background`, `text-card`
- ✅ **Soporte completo** para temas light/dark
- ✅ **Border radius estándar** de shadcn

---

## 🎨 Uso de Colores

### **Clases Principales**
```tsx
// Fondos
className="bg-background"           // Fondo principal
className="bg-card"                 // Fondo de tarjetas
className="bg-popover"              // Fondo de popovers/dropdowns
className="bg-primary"              // Fondo naranja/ámbar

// Texto
className="text-foreground"         // Texto principal
className="text-card-foreground"    // Texto en tarjetas
className="text-popover-foreground" // Texto en popovers
className="text-primary"            // Texto naranja/ámbar
className="text-muted-foreground"   // Texto atenuado

// Bordes
className="border border-border"    // Bordes del tema
className="border-primary"          // Bordes naranjas

// Estados
className="hover:bg-secondary"      // Hover sutil
className="hover:bg-accent"         // Hover de acento
className="focus:ring-primary"      // Focus naranja
```

### **Ejemplos Prácticos**
```tsx
// Botón primario
<Button variant="default" size="lg" className="w-full">
  Acción Principal
</Button>

// Tarjeta
<Card className="p-4">
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
</Card>

// Input
<Input variant="outline" size="md">
  <InputField placeholder="Tu texto aquí" />
</Input>
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
- ✅ **Selector de tema:** **Botón personalizado** (no dropdown shadcn)
- ✅ **Usuario:** Avatar y información

**Selector de Tema:**
```tsx
// Botón personalizado que cicla entre temas
<button 
  onClick={() => setTheme(themeSetting === "light" ? "dark" : 
                         themeSetting === "dark" ? "system" : "light")}
  className="p-2 rounded-lg hover:bg-secondary transition-colors"
>
  {/* Icono dinámico según tema */}
  {themeSetting === "light" ? <Sun /> : 
   themeSetting === "dark" ? <Moon /> : <Monitor />}
</button>
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
<div className="min-h-screen bg-background text-foreground">
  <Topbar onOpenMenu={onOpenMenu} />
  <Sidebar isOpen={isOpen} onClose={onClose} />
  <main className="pt-14 lg:ml-52">
    {children}
  </main>
</div>
```

**Overlay Móvil:**
```tsx
{/* Overlay oscuro apropiado */}
<div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
```

---

## 🔧 Troubleshooting

### **Problemas Comunes**

#### **1. Colores no se aplican**
```bash
# Verificar orden de importación en layout.tsx
import "./globals.css";           // ✅ PRIMERO - Nuestras variables CSS
import "@repo/design/tailwind/global.css";  // ✅ SEGUNDO - Tailwind
import "./styles/utilities.css";  // ✅ ÚLTIMO - Utilidades personalizadas
```

#### **2. Tema no cambia**
```bash
# Verificar que next-themes esté funcionando
# En DevTools > Elements > <html>
# Debería tener clase "dark" en modo oscuro

# Si no funciona, limpiar localStorage
localStorage.removeItem('onfit-theme');
```

#### **3. Componentes shadcn transparentes**
```bash
# Verificar que las variables CSS estén cargadas
# En DevTools > Elements > :root
# Deberías ver --background, --popover, etc.

# Si persiste, usar selector personalizado como en Topbar
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
- [ ] **Usar tokens canónicos:** `bg-background`, `text-card`
- [ ] **Evitar colores hardcoded:** No `bg-red-500`, usar `bg-destructive`
- [ ] **Soporte para temas:** Funcionar en light y dark
- [ ] **Hover states:** Incluir `hover:bg-secondary` o `hover:bg-accent`
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
- **Shadcn/ui:** [Documentación oficial](https://ui.shadcn.com/)

---

## 🎯 **IMPORTANTE: Orden de Importación CSS**

**CRÍTICO:** El orden de importación en `layout.tsx` debe ser:

```tsx
import "./globals.css";           // ✅ PRIMERO - Nuestras variables CSS
import "@repo/design/tailwind/global.css";  // ✅ SEGUNDO - Tailwind
import "./styles/utilities.css";  // ✅ TERCERO - Utilidades personalizadas
```

**¿Por qué?** Tailwind necesita que las variables CSS estén disponibles **antes** de generar las clases.

---

*Última actualización: $(date)*
*Versión del sistema: 3.0.0 - Componentes Plataforma-Específicos*
*Commit: e3215ca - Sistema unificado implementado*
