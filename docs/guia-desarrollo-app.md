# 🚀 Guía de Desarrollo - ONFIT App

> **IMPORTANTE**: Esta guía es OBLIGATORIA para cualquier desarrollo en la aplicación. Léela completa antes de empezar.

---

## 📋 INFORMACIÓN DEL PROYECTO

### **Stack Tecnológico:**
- **Monorepo**: pnpm + Turbo
- **Web**: Next.js 15 + Tailwind CSS 3
- **Native**: Expo SDK 53 + NativeWind 4 + Reanimated 3
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Gestión de estado**: React Context + Providers

### **Estructura del Monorepo:**
```
onfit/
├── apps/
│   ├── web/          # Next.js 15 (aplicación web)
│   └── native/       # Expo SDK 53 (aplicación móvil)
├── packages/
│   └── design-system/ # Sistema de diseño compartido
└── supabase/         # Migraciones y configuración
```

---

## 🎨 SISTEMA DE DISEÑO - REGLAS DURAS

### **❌ PROHIBIDO ABSOLUTAMENTE:**
1. **NO componentes NATIVOS** en implementaciones WEB
2. **NO CSS hardcodeado** ni colores inventados
3. **NO estilos ad-hoc** por página
4. **NO componentes** que no estén en el sistema de diseño
5. **NO colores** que no estén en el tema existente
6. **NO botones feos** o inconsistentes

### **✅ OBLIGATORIO:**
1. **Usar SOLO** componentes de `@repo/design-system`
2. **Seguir** el tema y estilos existentes
3. **Mantener consistencia** visual con el resto de la app
4. **Reutilizar** componentes existentes
5. **Usar** el sistema de colores del tema

---

## 🏗️ ARQUITECTURA DE LA APLICACIÓN

### **Estructura de Rutas (Next.js App Router):**
```
apps/web/app/
├── (auth)/           # Rutas de autenticación
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (protected)/      # Rutas protegidas
│   ├── admin/        # Panel de administración
│   ├── trainer/      # Panel de entrenador
│   └── user/         # Panel de usuario
└── api/              # API routes
```

### **Componentes de Layout:**
- **`Sidebar.tsx`**: Navegación lateral
- **`Topbar.tsx`**: Barra superior con notificaciones y selector de tema
- **`UserSidebar.tsx`**: Sidebar específico para usuarios

---

## 🔧 COMPONENTES DISPONIBLES

### **Ubicación del Sistema de Diseño:**
```
packages/design-system/
├── components/       # Componentes base
├── ui/              # Componentes de interfaz
├── icons/           # Iconos del sistema
└── tokens.ts        # Tokens de diseño
```

### **Componentes Principales:**
- **`Button`**: Botones del sistema (web/native)
- **`Input`**: Campos de entrada
- **`Card`**: Tarjetas contenedoras
- **`Dialog`**: Modales y diálogos
- **`Table`**: Tablas de datos
- **`Text`**: Componentes de texto tipografiado

### **Importación Correcta:**
```typescript
// ✅ CORRECTO - Usar componentes del sistema
import { Button } from '@repo/design-system/components/Button';
import { Card } from '@repo/design-system/components/Card';

// ❌ INCORRECTO - No usar componentes nativos en web
import { Button } from '@repo/design-system/components/Button/index.native';
```

---

## 🎯 PATRONES DE DISEÑO

### **Botones del Sistema:**
- **Estilo**: Igual que campana de notificación y selector de tema
- **Colores**: Del tema existente (NO inventar)
- **Tamaños**: Consistentes con el resto de la app
- **Estados**: Hover, active, disabled

### **Layout de Páginas:**
- **Header**: Título de página + acciones principales
- **Content**: Contenido principal con padding consistente
- **Cards**: Usar clase `card` para contenedores
- **Espaciado**: Seguir el sistema de espaciado del tema

### **Tablas de Datos:**
- **Componente**: `@repo/design-system/components/Table`
- **Estilo**: Consistente con `/admin/users`
- **Paginación**: Si es necesario
- **Acciones**: Botones inline con el sistema de diseño

---

## 🚫 ERRORES COMUNES A EVITAR

### **Errores de Diseño:**
1. **Botones feos**: Usar siempre componentes del sistema
2. **Colores inventados**: Seguir el tema existente
3. **Layout inconsistente**: Mantener estructura similar a páginas existentes
4. **Componentes nativos en web**: Verificar imports

### **Errores de Arquitectura:**
1. **CSS hardcodeado**: Usar clases de Tailwind del tema
2. **Estilos inline**: Evitar `style={{}}`
3. **Componentes duplicados**: Reutilizar componentes existentes
4. **Importaciones incorrectas**: Verificar rutas de importación

---

## 🔍 VERIFICACIÓN DE CALIDAD

### **Checklist Antes de Entregar:**
- [ ] **¿Usa SOLO componentes del sistema de diseño?**
- [ ] **¿Mantiene consistencia visual con el resto de la app?**
- [ ] **¿No tiene CSS hardcodeado ni colores inventados?**
- [ ] **¿Sigue el patrón de layout de páginas similares?**
- [ ] **¿Los botones tienen el mismo estilo que los existentes?**
- [ ] **¿No hay componentes nativos en implementación web?**

### **Comandos de Verificación:**
```bash
# Verificar que la app compila
pnpm web:dev

# Verificar linting
pnpm web:lint

# Verificar tipos TypeScript
pnpm web:type-check
```

---

## 📚 EJEMPLOS DE IMPLEMENTACIÓN

### **Página de Administración (Referencia):**
```typescript
// apps/web/app/(protected)/admin/users/page.tsx
// ✅ Ejemplo de implementación correcta
// ✅ Usa componentes del sistema
// ✅ Mantiene consistencia visual
// ✅ No tiene CSS hardcodeado
```

### **Componente de Botón (Referencia):**
```typescript
// packages/design-system/components/Button/index.web.tsx
// ✅ Componente base del sistema
// ✅ Estilos del tema
// ✅ Props consistentes
```

---

## 🚀 FLUJO DE DESARROLLO RECOMENDADO

### **Paso 1: Análisis**
1. **Revisar** páginas similares existentes
2. **Identificar** componentes del sistema a usar
3. **Planificar** estructura de la página

### **Paso 2: Implementación**
1. **Crear** estructura básica de la página
2. **Implementar** usando componentes del sistema
3. **Mantener** consistencia visual

### **Paso 3: Verificación**
1. **Revisar** checklist de calidad
2. **Probar** en diferentes tamaños de pantalla
3. **Verificar** que no hay regresiones visuales

---

## 📞 SOPORTE Y REFERENCIAS

### **Archivos de Referencia:**
- **`docs/sistema-estilos.md`**: Documentación detallada del sistema de estilos
- **`docs/seguridad-supabase.md`**: Arquitectura de seguridad y Supabase
- **`packages/design-system/`**: Código fuente del sistema de diseño

### **Páginas de Ejemplo:**
- **`/admin/users`**: Gestión de usuarios (referencia principal)
- **`/admin/dashboard`**: Dashboard de administración
- **`/trainer`**: Panel de entrenador

---

## ⚠️ ADVERTENCIA FINAL

**NO INVENTES NADA. NO CREES COMPONENTES NUEVOS. NO USES COLORES QUE NO EXISTAN.**

**SIGUE EXACTAMENTE EL SISTEMA EXISTENTE. SI NO ESTÁS SEGURO, PREGUNTA ANTES DE IMPLEMENTAR.**

**LA CONSISTENCIA VISUAL ES MÁS IMPORTANTE QUE LA CREATIVIDAD.**

---

*Última actualización: 2025-08-22*
*Versión: 1.0*
