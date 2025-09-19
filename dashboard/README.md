# 📊 Dashboard CI/CD - ONFIT13

Este dashboard proporciona métricas en tiempo real del pipeline CI/CD del proyecto ONFIT13.

## 🚀 Acceso al Dashboard

**URL del Dashboard:** https://raulpcarreras.github.io/onfit/dashboard/

## 📊 Métricas Disponibles

### 📈 Métricas Generales
- **Builds Exitosos** - Porcentaje de builds exitosos
- **Tiempo Promedio** - Tiempo promedio de ejecución
- **Último Build** - Fecha y hora del último build
- **Estado Pipeline** - Estado actual del pipeline

### 🔒 Seguridad
- **Vulnerabilidades** - Número de vulnerabilidades detectadas
- **Dependencias Obsoletas** - Dependencias que necesitan actualización
- **Última Auditoría** - Fecha de la última auditoría de seguridad
- **Estado Seguridad** - Estado general de seguridad

### 🧪 Testing
- **Cobertura Total** - Porcentaje de cobertura de tests
- **Tests Pasando** - Número de tests que pasan
- **Tests Fallando** - Número de tests que fallan
- **Último Test** - Fecha del último test ejecutado

### 🚀 Deployments
- **Web (Vercel)** - Estado del deployment web
- **Native (EAS)** - Estado del deployment nativo
- **Último Deploy** - Fecha del último deployment
- **Versión Actual** - Versión actual del proyecto

### ⚡ Performance
- **Build Web** - Tiempo de build de la aplicación web
- **Build Native** - Tiempo de build de la aplicación nativa
- **Tamaño Web** - Tamaño del build web
- **Tamaño Native** - Tamaño del build nativo

## 🔄 Actualización Automática

El dashboard se actualiza automáticamente:
- **Cada hora** - Actualización programada
- **En cada push** - Actualización en tiempo real
- **Manual** - Actualización bajo demanda

## 🛠️ Configuración

### Requisitos
- Node.js 20+
- pnpm 10.12.4+
- GitHub CLI (opcional)

### Comandos Útiles

```bash
# Generar métricas manualmente
node scripts/generate-metrics.js

# Configurar secrets
./scripts/configure-secrets.sh

# Verificar estado del pipeline
gh workflow run "Dashboard CI/CD - ONFIT13"
```

## 📱 Acceso Móvil

El dashboard es completamente responsive y se puede acceder desde dispositivos móviles.

## 🔧 Troubleshooting

### Problemas Comunes

1. **Dashboard no se actualiza**
   - Verificar que el workflow esté ejecutándose
   - Revisar logs en GitHub Actions

2. **Métricas incorrectas**
   - Ejecutar `node scripts/generate-metrics.js` manualmente
   - Verificar configuración de GitHub CLI

3. **Error de permisos**
   - Verificar que GitHub Pages esté habilitado
   - Revisar configuración de secrets

## 📚 Documentación Adicional

- [Pipeline CI/CD](../ci-cd-pipeline.md)
- [Configuración de Secrets](../configure-secrets.md)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Última actualización:** $(date)  
**Versión del dashboard:** 1.0
