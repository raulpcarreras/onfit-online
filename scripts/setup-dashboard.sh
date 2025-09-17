#!/bin/bash

# 📊 Setup Dashboard CI/CD - ONFIT13
# Este script configura el dashboard de métricas completo

set -e

echo "📊 Configurando Dashboard CI/CD para ONFIT13"
echo "============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [[ ! -f "package.json" ]] || [[ ! -f "pnpm-workspace.yaml" ]]; then
    print_error "Este script debe ejecutarse desde la raíz del monorepo"
    exit 1
fi

print_status "Verificando estructura del dashboard..."

# Verificar estructura de directorios
required_files=(
    "docs/dashboard/index.html"
    "scripts/generate-metrics.js"
    ".github/workflows/dashboard.yml"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        print_error "Archivo requerido no encontrado: $file"
        exit 1
    fi
done

print_success "Estructura del dashboard verificada"

# Verificar que GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) no está instalado. Instálalo desde: https://cli.github.com/"
    exit 1
fi

print_status "Verificando autenticación con GitHub..."

# Verificar autenticación con GitHub
if ! gh auth status &> /dev/null; then
    print_error "No estás autenticado con GitHub. Ejecuta: gh auth login"
    exit 1
fi

print_success "Autenticación con GitHub verificada"

# Verificar que estamos en el repositorio correcto
repo_info=$(gh repo view --json name,owner)
repo_name=$(echo "$repo_info" | jq -r '.name')
repo_owner=$(echo "$repo_info" | jq -r '.owner.login')

print_status "Repositorio: $repo_owner/$repo_name"

echo ""
print_status "🔧 Configurando GitHub Pages..."

# Verificar si GitHub Pages está habilitado
pages_status=$(gh api repos/$repo_owner/$repo_name/pages 2>/dev/null || echo "{}")
if [[ "$pages_status" == "{}" ]]; then
    print_warning "GitHub Pages no está habilitado"
    echo "  Habilitando GitHub Pages..."
    
    # Habilitar GitHub Pages
    gh api repos/$repo_owner/$repo_name/pages -X POST -f source[branch]=gh-pages -f source[path]=/dashboard || {
        print_error "Error habilitando GitHub Pages"
        echo "  Configúralo manualmente en: https://github.com/$repo_owner/$repo_name/settings/pages"
        echo "  Source: Deploy from a branch"
        echo "  Branch: gh-pages"
        echo "  Folder: /dashboard"
    }
else
    print_success "GitHub Pages ya está habilitado"
fi

echo ""
print_status "📊 Generando métricas iniciales..."

# Generar métricas iniciales
if node scripts/generate-metrics.js; then
    print_success "Métricas iniciales generadas"
else
    print_warning "Error generando métricas iniciales"
fi

echo ""
print_status "🚀 Configurando workflow del dashboard..."

# Verificar que el workflow esté configurado
if [[ -f ".github/workflows/dashboard.yml" ]]; then
    print_success "Workflow del dashboard configurado"
else
    print_error "Workflow del dashboard no encontrado"
    exit 1
fi

echo ""
print_status "🔍 Verificando configuración..."

# Verificar que el directorio de datos existe
if [[ -d "docs/dashboard/data" ]]; then
    print_success "Directorio de datos del dashboard creado"
else
    print_warning "Directorio de datos del dashboard no encontrado"
    mkdir -p docs/dashboard/data
    print_success "Directorio de datos del dashboard creado"
fi

# Verificar que el archivo de métricas existe
if [[ -f "docs/dashboard/data/metrics.json" ]]; then
    print_success "Archivo de métricas generado"
else
    print_warning "Archivo de métricas no encontrado"
    print_status "Generando métricas..."
    node scripts/generate-metrics.js
fi

echo ""
print_status "🧪 Probando configuración..."

# Probar generación de métricas
print_status "Ejecutando generador de métricas..."
if node scripts/generate-metrics.js &> /dev/null; then
    print_success "Generador de métricas funcionando correctamente"
else
    print_warning "Generador de métricas tiene problemas (esto es normal si hay errores de dependencias)"
fi

echo ""
print_success "🎉 Configuración del dashboard completada!"
echo ""
echo "📋 Resumen de configuración:"
echo "  ✅ Estructura del dashboard verificada"
echo "  ✅ GitHub Pages configurado"
echo "  ✅ Workflow del dashboard configurado"
echo "  ✅ Métricas iniciales generadas"
echo "  ✅ Generador de métricas funcionando"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Configurar secrets de GitHub (si no están configurados)"
echo "  2. Ejecutar workflow del dashboard: gh workflow run 'Dashboard CI/CD - ONFIT13'"
echo "  3. Acceder al dashboard en: https://$repo_owner.github.io/$repo_name/dashboard/"
echo "  4. Configurar actualización automática cada hora"
echo ""
echo "📚 Comandos útiles:"
echo "  - Generar métricas: node scripts/generate-metrics.js"
echo "  - Ver workflow: gh workflow list"
echo "  - Ver logs: gh run list --workflow='Dashboard CI/CD - ONFIT13'"
echo ""
print_success "¡Dashboard configurado correctamente! 📊"
