#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Backup original package.json
const originalPackagePath = path.join(__dirname, '../package.json');
const easPackagePath = path.join(__dirname, '../package.json.eas');

if (fs.existsSync(easPackagePath)) {
    // Copy EAS version to package.json
    fs.copyFileSync(easPackagePath, originalPackagePath);
    console.log('✅ Package.json preparado para EAS Build');
} else {
    console.error('❌ package.json.eas no encontrado');
    process.exit(1);
}
