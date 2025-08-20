#!/bin/bash

# Script para reiniciar limpiamente el servidor de desarrollo de Next.js
# Este script elimina la caché de Next.js y reinicia el servidor

echo "🧹 Limpiando caché de Next.js..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

echo "✅ Caché eliminada"
echo "🔄 Reiniciando servidor de desarrollo..."

# Usar este comando si estás dentro de apps/web
# pnpm dev

# Usar este comando si estás en la raíz del monorepo
pnpm --filter web dev
