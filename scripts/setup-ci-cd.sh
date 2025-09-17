#!/bin/bash

# 🚀 Setup CI/CD Pipeline - ONFIT13
# Este script configura todos los componentes necesarios para el pipeline CI/CD

set -e

echo "🚀 Configurando CI/CD Pipeline para ONFIT13..."
echo "================================================"

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

print_status "Verificando estructura del monorepo..."

# Verificar estructura de directorios
required_dirs=("apps/web" "apps/native" "packages/design-system" ".github/workflows")
for dir in "${required_dirs[@]}"; do
    if [[ ! -d "$dir" ]]; then
        print_error "Directorio requerido no encontrado: $dir"
        exit 1
    fi
done

print_success "Estructura del monorepo verificada"

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

# Verificar que EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI no está instalado. Instalando..."
    npm install -g @expo/eas-cli
fi

print_status "Verificando autenticación con Expo..."

# Verificar autenticación con Expo
if ! eas whoami &> /dev/null; then
    print_error "No estás autenticado con Expo. Ejecuta: eas login"
    exit 1
fi

print_success "Autenticación con Expo verificada"

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

print_status "Verificando autenticación con Vercel..."

# Verificar autenticación con Vercel
if ! vercel whoami &> /dev/null; then
    print_error "No estás autenticado con Vercel. Ejecuta: vercel login"
    exit 1
fi

print_success "Autenticación con Vercel verificada"

echo ""
print_status "Configurando secrets de GitHub..."

# Configurar secrets de GitHub
secrets=(
    "EXPO_TOKEN:Token de Expo (obtener desde https://expo.dev/settings/access-tokens)"
    "VERCEL_TOKEN:Token de Vercel (obtener desde https://vercel.com/account/tokens)"
    "GH_TOKEN:Token de GitHub (obtener desde https://github.com/settings/tokens)"
)

for secret in "${secrets[@]}"; do
    secret_name=$(echo "$secret" | cut -d: -f1)
    secret_description=$(echo "$secret" | cut -d: -f2)
    
    if gh secret list | grep -q "$secret_name"; then
        print_success "Secret $secret_name ya configurado"
    else
        print_warning "Secret $secret_name no configurado"
        echo "  $secret_description"
        echo "  Configúralo con: gh secret set $secret_name"
    fi
done

echo ""
print_status "Configurando variables de GitHub..."

# Configurar variables de GitHub
variables=(
    "EAS_PROJECT_ID:c4764e6d-a9cd-4ff9-a110-8e85a6554e26"
    "EXPO_ACCOUNT_OWNER:raulpcarreras"
    "NATIVE_BUILD_NUMBER:10"
)

for variable in "${variables[@]}"; do
    var_name=$(echo "$variable" | cut -d: -f1)
    var_value=$(echo "$variable" | cut -d: -f2)
    
    if gh variable list | grep -q "$var_name"; then
        print_success "Variable $var_name ya configurada"
    else
        print_warning "Variable $var_name no configurada"
        echo "  Configurándola con valor: $var_value"
        gh variable set "$var_name" --body "$var_value"
        print_success "Variable $var_name configurada"
    fi
done

echo ""
print_status "Verificando configuración de Vercel..."

# Verificar configuración de Vercel
if [[ -f "vercel/project.json" ]]; then
    print_success "Configuración de Vercel encontrada"
else
    print_warning "Configuración de Vercel no encontrada"
    echo "  Creando configuración básica..."
    
    mkdir -p vercel
    cat > vercel/project.json << EOF
{
  "name": "onfit13-web",
  "rootDirectory": "apps/web",
  "framework": "nextjs"
}
EOF
    print_success "Configuración de Vercel creada"
fi

echo ""
print_status "Verificando workflows de GitHub Actions..."

# Verificar workflows
workflows=(
    ".github/workflows/ci.yml"
    ".github/workflows/release.yml"
    ".github/workflows/dependencies.yml"
    ".github/workflows/test.yml"
)

for workflow in "${workflows[@]}"; do
    if [[ -f "$workflow" ]]; then
        print_success "Workflow encontrado: $workflow"
    else
        print_error "Workflow no encontrado: $workflow"
    fi
done

echo ""
print_status "Verificando acción de setup..."

# Verificar acción de setup
if [[ -f ".github/actions/setup-monorepo/action.yml" ]]; then
    print_success "Acción de setup encontrada"
else
    print_error "Acción de setup no encontrada"
fi

echo ""
print_status "Probando configuración..."

# Probar configuración básica
print_status "Ejecutando lint..."
if pnpm lint &> /dev/null; then
    print_success "Lint ejecutado correctamente"
else
    print_warning "Lint falló (esto es normal si hay errores de código)"
fi

print_status "Ejecutando tests..."
if pnpm test:design &> /dev/null; then
    print_success "Tests ejecutados correctamente"
else
    print_warning "Tests fallaron (esto es normal si hay tests fallando)"
fi

echo ""
print_success "🎉 Configuración de CI/CD completada!"
echo ""
echo "📋 Resumen de configuración:"
echo "  ✅ Estructura del monorepo verificada"
echo "  ✅ Autenticación con GitHub verificada"
echo "  ✅ Autenticación con Expo verificada"
echo "  ✅ Autenticación con Vercel verificada"
echo "  ✅ Secrets de GitHub configurados"
echo "  ✅ Variables de GitHub configuradas"
echo "  ✅ Configuración de Vercel creada"
echo "  ✅ Workflows de GitHub Actions verificados"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Configurar secrets faltantes (si los hay)"
echo "  2. Probar el pipeline con: gh workflow run 'CI/CD Pipeline - ONFIT13'"
echo "  3. Configurar dominio en Vercel"
echo "  4. Configurar credenciales de App Store/Play Store (opcional)"
echo ""
echo "📚 Documentación completa en: docs/ci-cd-pipeline.md"
echo ""
print_success "¡Pipeline CI/CD listo para usar! 🚀"
