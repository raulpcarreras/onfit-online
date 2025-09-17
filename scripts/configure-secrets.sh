#!/bin/bash

# 🔐 Configure Secrets for CI/CD Pipeline - ONFIT13
# Este script ayuda a configurar todos los secrets necesarios para el pipeline

set -e

echo "🔐 Configurando Secrets para CI/CD Pipeline - ONFIT13"
echo "====================================================="

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

# Verificar que GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) no está instalado. Instálalo desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación con GitHub
if ! gh auth status &> /dev/null; then
    print_error "No estás autenticado con GitHub. Ejecuta: gh auth login"
    exit 1
fi

print_success "Autenticación con GitHub verificada"

echo ""
print_status "🔑 Configurando Secrets de GitHub..."
echo ""

# 1. EXPO_TOKEN
print_status "1. Configurando EXPO_TOKEN..."
echo "   📱 Necesitas un token de Expo para builds nativos"
echo "   🔗 Obtén tu token desde: https://expo.dev/settings/access-tokens"
echo "   💡 Crea un token con permisos de 'Build' y 'Project'"
echo ""

read -p "   ¿Tienes tu EXPO_TOKEN? (y/n): " has_expo_token
if [[ "$has_expo_token" == "y" || "$has_expo_token" == "Y" ]]; then
    read -s -p "   Ingresa tu EXPO_TOKEN: " expo_token
    echo ""
    if [[ -n "$expo_token" ]]; then
        gh secret set EXPO_TOKEN --body "$expo_token"
        print_success "EXPO_TOKEN configurado correctamente"
    else
        print_warning "EXPO_TOKEN vacío, saltando..."
    fi
else
    print_warning "EXPO_TOKEN no configurado. Configúralo manualmente con:"
    echo "   gh secret set EXPO_TOKEN"
fi

echo ""

# 2. VERCEL_TOKEN
print_status "2. Configurando VERCEL_TOKEN..."
echo "   🌐 Necesitas un token de Vercel para deploy automático"
echo "   🔗 Obtén tu token desde: https://vercel.com/account/tokens"
echo "   💡 Crea un token con permisos de 'Deploy' y 'Project'"
echo ""

read -p "   ¿Tienes tu VERCEL_TOKEN? (y/n): " has_vercel_token
if [[ "$has_vercel_token" == "y" || "$has_vercel_token" == "Y" ]]; then
    read -s -p "   Ingresa tu VERCEL_TOKEN: " vercel_token
    echo ""
    if [[ -n "$vercel_token" ]]; then
        gh secret set VERCEL_TOKEN --body "$vercel_token"
        print_success "VERCEL_TOKEN configurado correctamente"
    else
        print_warning "VERCEL_TOKEN vacío, saltando..."
    fi
else
    print_warning "VERCEL_TOKEN no configurado. Configúralo manualmente con:"
    echo "   gh secret set VERCEL_TOKEN"
fi

echo ""

# 3. GH_TOKEN
print_status "3. Configurando GH_TOKEN..."
echo "   🔧 Necesitas un token de GitHub para automatización"
echo "   🔗 Obtén tu token desde: https://github.com/settings/tokens"
echo "   💡 Crea un token con permisos de 'repo', 'workflow', 'write:packages'"
echo ""

read -p "   ¿Tienes tu GH_TOKEN? (y/n): " has_gh_token
if [[ "$has_gh_token" == "y" || "$has_gh_token" == "Y" ]]; then
    read -s -p "   Ingresa tu GH_TOKEN: " gh_token
    echo ""
    if [[ -n "$gh_token" ]]; then
        gh secret set GH_TOKEN --body "$gh_token"
        print_success "GH_TOKEN configurado correctamente"
    else
        print_warning "GH_TOKEN vacío, saltando..."
    fi
else
    print_warning "GH_TOKEN no configurado. Configúralo manualmente con:"
    echo "   gh secret set GH_TOKEN"
fi

echo ""

# 4. SLACK_TOKEN (opcional)
print_status "4. Configurando SLACK_TOKEN (opcional)..."
echo "   💬 Token opcional para notificaciones en Slack"
echo "   🔗 Obtén tu token desde: https://api.slack.com/apps"
echo "   💡 Crea una app con permisos de 'chat:write' y 'channels:read'"
echo ""

read -p "   ¿Quieres configurar SLACK_TOKEN? (y/n): " has_slack_token
if [[ "$has_slack_token" == "y" || "$has_slack_token" == "Y" ]]; then
    read -s -p "   Ingresa tu SLACK_TOKEN: " slack_token
    echo ""
    if [[ -n "$slack_token" ]]; then
        gh secret set SLACK_TOKEN --body "$slack_token"
        print_success "SLACK_TOKEN configurado correctamente"
    else
        print_warning "SLACK_TOKEN vacío, saltando..."
    fi
else
    print_status "SLACK_TOKEN omitido (opcional)"
fi

echo ""
print_status "📊 Configurando Variables de GitHub..."
echo ""

# Variables de GitHub
variables=(
    "EAS_PROJECT_ID:c4764e6d-a9cd-4ff9-a110-8e85a6554e26"
    "EXPO_ACCOUNT_OWNER:raulpcarreras"
    "NATIVE_BUILD_NUMBER:10"
)

for variable in "${variables[@]}"; do
    var_name=$(echo "$variable" | cut -d: -f1)
    var_value=$(echo "$variable" | cut -d: -f2)
    
    print_status "Configurando variable: $var_name"
    gh variable set "$var_name" --body "$var_value"
    print_success "Variable $var_name configurada con valor: $var_value"
done

echo ""
print_status "🔍 Verificando configuración..."

# Verificar secrets configurados
echo ""
print_status "Secrets configurados:"
gh secret list

echo ""
print_status "Variables configuradas:"
gh variable list

echo ""
print_success "🎉 Configuración de secrets completada!"
echo ""
echo "📋 Resumen de configuración:"
echo "  ✅ Secrets de GitHub configurados"
echo "  ✅ Variables de GitHub configuradas"
echo "  ✅ Pipeline CI/CD listo para usar"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Probar el pipeline con: gh workflow run 'CI/CD Pipeline - ONFIT13'"
echo "  2. Verificar builds en: https://github.com/raulpcarreras/onfit/actions"
echo "  3. Configurar dashboard de métricas (siguiente paso)"
echo ""
print_success "¡Secrets configurados correctamente! 🔐"
