#!/bin/bash

# Script para limpiar chunks de HMR corruptos en Next.js
# Uso: ./scripts/clean-hmr.sh [web|native]

echo "🧹 Limpiando chunks de HMR corruptos..."

if [ "$1" = "web" ]; then
    echo "📱 Limpiando web..."
    cd apps/web
    
    # Parar el servidor si está corriendo
    echo "⏹️  Parando servidor web..."
    pkill -f "next dev" || true
    
    # Limpiar .next
    echo "🗑️  Eliminando .next..."
    rm -rf .next
    
    # Limpiar cache de Next.js
    echo "🧼 Limpiando cache..."
    rm -rf .swc
    
    echo "✅ Web limpiado. Ejecuta 'pnpm --filter web dev' para relanzar."
    
elif [ "$1" = "native" ]; then
    echo "📱 Limpiando native..."
    cd apps/native
    
    # Parar Metro si está corriendo
    echo "⏹️  Parando Metro bundler..."
    pkill -f "expo start" || true
    pkill -f "metro" || true
    
    # Limpiar cache de Metro
    echo "🗑️  Limpiando cache de Metro..."
    rm -rf .expo
    npx expo start --clear
    
    echo "✅ Native limpiado. Ejecuta 'pnpm --filter native dev' para relanzar."
    
else
    echo "❌ Uso: ./scripts/clean-hmr.sh [web|native]"
    echo ""
    echo "Este script limpia los chunks de HMR corruptos que causan:"
    echo "'Cannot find module './XYZ.js'' después de logout/navegación."
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/clean-hmr.sh web     # Limpia Next.js"
    echo "  ./scripts/clean-hmr.sh native  # Limpia Expo/Metro"
    exit 1
fi
