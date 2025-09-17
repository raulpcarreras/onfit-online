#!/usr/bin/env node

/**
 * 📊 Generador de Métricas CI/CD - ONFIT13
 * Este script genera métricas del pipeline y las guarda en formato JSON
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const CONFIG = {
    repo: 'raulpcarreras/onfit',
    outputDir: 'docs/dashboard/data',
    metricsFile: 'metrics.json'
};

// Colores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para ejecutar comandos
function runCommand(command, options = {}) {
    try {
        const result = execSync(command, { 
            encoding: 'utf8', 
            stdio: 'pipe',
            ...options 
        });
        return result.trim();
    } catch (error) {
        log(`Error ejecutando comando: ${command}`, 'red');
        return null;
    }
}

// Función para obtener información de Git
function getGitInfo() {
    log('📊 Obteniendo información de Git...', 'blue');
    
    const branch = runCommand('git branch --show-current');
    const lastCommit = runCommand('git log -1 --pretty=format:"%h %s"');
    const commitDate = runCommand('git log -1 --pretty=format:"%ci"');
    const totalCommits = runCommand('git rev-list --count HEAD');
    
    return {
        branch: branch || 'unknown',
        lastCommit: lastCommit || 'unknown',
        commitDate: commitDate || 'unknown',
        totalCommits: parseInt(totalCommits) || 0
    };
}

// Función para obtener información de pnpm
function getPnpmInfo() {
    log('📦 Obteniendo información de dependencias...', 'blue');
    
    const outdated = runCommand('pnpm outdated --json');
    const audit = runCommand('pnpm audit --json');
    
    let outdatedCount = 0;
    let vulnerabilities = 0;
    
    try {
        if (outdated) {
            const outdatedData = JSON.parse(outdated);
            outdatedCount = Object.keys(outdatedData).length;
        }
    } catch (e) {
        // Ignorar errores de parsing
    }
    
    try {
        if (audit) {
            const auditData = JSON.parse(audit);
            vulnerabilities = auditData.metadata?.vulnerabilities?.total || 0;
        }
    } catch (e) {
        // Ignorar errores de parsing
    }
    
    return {
        outdatedCount,
        vulnerabilities
    };
}

// Función para obtener información de tests
function getTestInfo() {
    log('🧪 Obteniendo información de tests...', 'blue');
    
    let coverage = 0;
    let testsPassing = 0;
    let testsFailing = 0;
    
    try {
        // Ejecutar tests del design system
        const testResult = runCommand('pnpm test:design:coverage', { 
            cwd: process.cwd(),
            stdio: 'pipe'
        });
        
        // Intentar extraer información de coverage
        if (testResult && testResult.includes('All files')) {
            const coverageMatch = testResult.match(/All files\s+\|\s+(\d+)/);
            if (coverageMatch) {
                coverage = parseInt(coverageMatch[1]);
            }
        }
        
        // Contar tests pasando/fallando
        const passingMatch = testResult?.match(/(\d+) passing/);
        const failingMatch = testResult?.match(/(\d+) failing/);
        
        if (passingMatch) testsPassing = parseInt(passingMatch[1]);
        if (failingMatch) testsFailing = parseInt(failingMatch[1]);
        
    } catch (error) {
        log('Error ejecutando tests, usando datos por defecto', 'yellow');
    }
    
    return {
        coverage,
        testsPassing,
        testsFailing
    };
}

// Función para obtener información de builds
function getBuildInfo() {
    log('🏗 Obteniendo información de builds...', 'blue');
    
    let webBuildTime = '-';
    let nativeBuildTime = '-';
    let webSize = '-';
    let nativeSize = '-';
    
    try {
        // Verificar si existe build de web
        if (fs.existsSync('apps/web/.next')) {
            const webStats = fs.statSync('apps/web/.next');
            webBuildTime = new Date(webStats.mtime).toLocaleString('es-ES');
            
            // Calcular tamaño
            const webSizeBytes = runCommand('du -sb apps/web/.next | cut -f1');
            if (webSizeBytes) {
                webSize = `${(parseInt(webSizeBytes) / 1024 / 1024).toFixed(1)} MB`;
            }
        }
        
        // Verificar si existe build de native
        if (fs.existsSync('apps/native/android') || fs.existsSync('apps/native/ios')) {
            const nativeStats = fs.statSync('apps/native/android' || 'apps/native/ios');
            nativeBuildTime = new Date(nativeStats.mtime).toLocaleString('es-ES');
            
            // Calcular tamaño
            const nativeSizeBytes = runCommand('du -sb apps/native/android apps/native/ios 2>/dev/null | awk \'{sum+=$1} END {print sum}\'');
            if (nativeSizeBytes) {
                nativeSize = `${(parseInt(nativeSizeBytes) / 1024 / 1024).toFixed(1)} MB`;
            }
        }
        
    } catch (error) {
        log('Error obteniendo información de builds', 'yellow');
    }
    
    return {
        webBuildTime,
        nativeBuildTime,
        webSize,
        nativeSize
    };
}

// Función para obtener información de GitHub Actions
function getGitHubActionsInfo() {
    log('🔧 Obteniendo información de GitHub Actions...', 'blue');
    
    let totalRuns = 0;
    let successfulRuns = 0;
    let failedRuns = 0;
    let lastBuild = 'Nunca';
    
    try {
        // Verificar si GitHub CLI está disponible
        const ghVersion = runCommand('gh --version');
        if (!ghVersion) {
            log('GitHub CLI no disponible, usando datos por defecto', 'yellow');
            return { totalRuns, successfulRuns, failedRuns, lastBuild };
        }
        
        // Obtener información de workflows
        const workflows = runCommand('gh run list --limit 20 --json status,conclusion,createdAt');
        
        if (workflows) {
            const runs = JSON.parse(workflows);
            totalRuns = runs.length;
            
            runs.forEach(run => {
                if (run.conclusion === 'success') {
                    successfulRuns++;
                } else if (run.conclusion === 'failure') {
                    failedRuns++;
                }
            });
            
            if (runs.length > 0) {
                lastBuild = new Date(runs[0].createdAt).toLocaleString('es-ES');
            }
        }
        
    } catch (error) {
        log('Error obteniendo información de GitHub Actions', 'yellow');
    }
    
    return {
        totalRuns,
        successfulRuns,
        failedRuns,
        lastBuild
    };
}

// Función para calcular métricas generales
function calculateGeneralMetrics(data) {
    const successRate = data.githubActions.totalRuns > 0 
        ? Math.round((data.githubActions.successfulRuns / data.githubActions.totalRuns) * 100)
        : 0;
    
    const pipelineStatus = data.githubActions.totalRuns > 0 ? '✅ Activo' : '⚠️ Inactivo';
    const securityStatus = data.pnpm.vulnerabilities === 0 ? '✅ Seguro' : '⚠️ Vulnerabilidades';
    
    return {
        successRate: `${successRate}%`,
        pipelineStatus,
        securityStatus,
        currentVersion: 'v0.2.18',
        lastUpdated: new Date().toISOString()
    };
}

// Función principal
async function generateMetrics() {
    log('🚀 Generando métricas del pipeline CI/CD...', 'bright');
    log('===============================================', 'bright');
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    // Recopilar datos
    const gitInfo = getGitInfo();
    const pnpmInfo = getPnpmInfo();
    const testInfo = getTestInfo();
    const buildInfo = getBuildInfo();
    const githubActionsInfo = getGitHubActionsInfo();
    
    // Calcular métricas generales
    const generalMetrics = calculateGeneralMetrics({
        githubActions: githubActionsInfo,
        pnpm: pnpmInfo
    });
    
    // Crear objeto de métricas
    const metrics = {
        timestamp: new Date().toISOString(),
        general: generalMetrics,
        git: gitInfo,
        pnpm: pnpmInfo,
        tests: testInfo,
        builds: buildInfo,
        githubActions: githubActionsInfo,
        summary: {
            totalCommits: gitInfo.totalCommits,
            successRate: generalMetrics.successRate,
            vulnerabilities: pnpmInfo.vulnerabilities,
            outdatedDeps: pnpmInfo.outdatedCount,
            testCoverage: `${testInfo.coverage}%`,
            pipelineStatus: generalMetrics.pipelineStatus
        }
    };
    
    // Guardar métricas
    const outputPath = path.join(CONFIG.outputDir, CONFIG.metricsFile);
    fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));
    
    log('✅ Métricas generadas exitosamente!', 'green');
    log(`📁 Archivo guardado en: ${outputPath}`, 'cyan');
    
    // Mostrar resumen
    log('\n📊 Resumen de Métricas:', 'bright');
    log(`   Commits totales: ${metrics.summary.totalCommits}`, 'blue');
    log(`   Tasa de éxito: ${metrics.summary.successRate}`, 'blue');
    log(`   Vulnerabilidades: ${metrics.summary.vulnerabilities}`, 'blue');
    log(`   Dependencias obsoletas: ${metrics.summary.outdatedDeps}`, 'blue');
    log(`   Cobertura de tests: ${metrics.summary.testCoverage}`, 'blue');
    log(`   Estado del pipeline: ${metrics.summary.pipelineStatus}`, 'blue');
    
    return metrics;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    generateMetrics().catch(error => {
        log(`❌ Error generando métricas: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { generateMetrics };
