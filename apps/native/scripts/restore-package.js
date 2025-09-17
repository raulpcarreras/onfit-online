#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Restore original package.json
const originalPackagePath = path.join(__dirname, '../package.json');
const backupPackagePath = path.join(__dirname, '../package.json.backup');

if (fs.existsSync(backupPackagePath)) {
    // Copy backup to package.json
    fs.copyFileSync(backupPackagePath, originalPackagePath);
    console.log('✅ Package.json restaurado para desarrollo local');
} else {
    console.error('❌ package.json.backup no encontrado');
    process.exit(1);
}
