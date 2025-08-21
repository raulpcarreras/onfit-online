#!/usr/bin/env node

/**
 * Script para generar favicons en diferentes tamaños
 * Requiere: sharp (npm install sharp)
 * Uso: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { name: 'favicon-16.png', size: 16, format: 'png' },
  { name: 'favicon-32.png', size: 32, format: 'png' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' }
];

async function generateFavicons() {
  try {
    // Verificar que existe la imagen fuente
    const sourcePath = path.join(__dirname, '../apps/web/public/favicon.png');
    
    if (!fs.existsSync(sourcePath)) {
      console.error('❌ No se encontró favicon.png en apps/web/public/');
      console.log('📁 Por favor, coloca tu imagen de 512x512px en: apps/web/public/favicon.png');
      return;
    }

    console.log('🚀 Generando favicons...');

    for (const { name, size, format } of sizes) {
      const outputPath = path.join(__dirname, '../apps/web/public', name);
      
      await sharp(sourcePath)
        .resize(size, size)
        .toFormat(format)
        .toFile(outputPath);
      
      console.log(`✅ Generado: ${name} (${size}x${size})`);
    }

    // Crear favicon.ico manualmente (copia del 32x32)
    const favicon32Path = path.join(__dirname, '../apps/web/public/favicon-32.png');
    const faviconIcoPath = path.join(__dirname, '../apps/web/public/favicon.ico');
    
    if (fs.existsSync(favicon32Path)) {
      fs.copyFileSync(favicon32Path, faviconIcoPath);
      console.log('✅ Generado: favicon.ico (copia de 32x32)');
    }

    console.log('\n🎉 ¡Favicons generados exitosamente!');
    console.log('📁 Archivos creados en: apps/web/public/');
    console.log('\n💡 Para crear un ICO real, puedes usar herramientas online como:');
    console.log('   - https://favicon.io/favicon-converter/');
    console.log('   - https://www.favicon-generator.org/');
    
  } catch (error) {
    console.error('❌ Error generando favicons:', error.message);
    console.log('\n💡 Solución:');
    console.log('1. Asegúrate de que favicon.png esté en apps/web/public/');
    console.log('2. Instala sharp: npm install sharp');
    console.log('3. Ejecuta: node scripts/generate-favicons.js');
  }
}

generateFavicons();
