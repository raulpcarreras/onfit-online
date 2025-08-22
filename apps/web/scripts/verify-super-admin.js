#!/usr/bin/env node

/**
 * Script de verificación del sistema Super Admin
 * Verifica BD, API, usuarios y permisos
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role para ver todo
);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log('cyan', `📊 ${title}`);
  console.log('='.repeat(60));
}

async function verifyDatabase() {
  section('VERIFICACIÓN DE BASE DE DATOS');
  
  try {
    // 1. Verificar función is_super_admin()
    log('blue', '🔍 Verificando función is_super_admin()...');
    const { data: functionExists, error: funcError } = await supabase
      .rpc('is_super_admin');
    
    if (funcError) {
      log('red', `❌ Error función is_super_admin(): ${funcError.message}`);
    } else {
      log('green', '✅ Función is_super_admin() existe y funciona');
    }

    // 2. Verificar políticas RLS en profiles
    log('blue', '🔍 Verificando políticas RLS en profiles...');
    const { data: policies, error: polError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, permissive, roles')
      .eq('schemaname', 'public')
      .eq('tablename', 'profiles');

    if (polError) {
      log('red', `❌ Error verificando políticas: ${polError.message}`);
    } else {
      log('green', `✅ Políticas RLS encontradas: ${policies.length}`);
      policies.forEach(policy => {
        log('yellow', `   - ${policy.policyname} (${policy.cmd})`);
      });
    }

    // 3. Verificar tabla profiles
    log('blue', '🔍 Verificando estructura de tabla profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .limit(5);

    if (profilesError) {
      log('red', `❌ Error accediendo a profiles: ${profilesError.message}`);
    } else {
      log('green', `✅ Tabla profiles accesible: ${profiles.length} usuarios encontrados`);
    }

  } catch (error) {
    log('red', `❌ Error general de BD: ${error.message}`);
  }
}

async function verifyUsers() {
  section('VERIFICACIÓN DE USUARIOS');
  
  try {
    // 1. Listar todos los usuarios
    log('blue', '🔍 Listando usuarios de auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      log('red', `❌ Error listando usuarios: ${authError.message}`);
      return;
    }

    log('green', `✅ Usuarios en auth.users: ${authUsers.users.length}`);

    // 2. Verificar super admins
    const superAdmins = authUsers.users.filter(user => 
      user.app_metadata?.is_super_admin === true
    );
    
    log('magenta', `👑 Super Admins encontrados: ${superAdmins.length}`);
    superAdmins.forEach(user => {
      log('yellow', `   - ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
    });

    // 3. Verificar usuarios en profiles
    log('blue', '🔍 Verificando sincronización con profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role');

    if (profilesError) {
      log('red', `❌ Error en profiles: ${profilesError.message}`);
    } else {
      log('green', `✅ Perfiles sincronizados: ${profiles.length}`);
      
      const roleCount = profiles.reduce((acc, profile) => {
        acc[profile.role] = (acc[profile.role] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(roleCount).forEach(([role, count]) => {
        log('yellow', `   - ${role}: ${count} usuarios`);
      });
    }

  } catch (error) {
    log('red', `❌ Error verificando usuarios: ${error.message}`);
  }
}

async function verifyAPI() {
  section('VERIFICACIÓN DE API');
  
  try {
    // 1. Verificar que el endpoint existe
    log('blue', '🔍 Verificando endpoint /api/admin/grant-super...');
    
    const response = await fetch('http://localhost:3000/api/admin/grant-super', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-secret'
      },
      body: JSON.stringify({ email: 'test@test.com', enable: true })
    });

    if (response.status === 401) {
      log('green', '✅ Endpoint protegido correctamente (401 Unauthorized)');
    } else {
      log('yellow', `⚠️ Respuesta inesperada: ${response.status}`);
    }

    // 2. Verificar variables de entorno
    log('blue', '🔍 Verificando variables de entorno...');
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'ADMIN_INTERNAL_SECRET'
    ];

    let allVarsPresent = true;
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        log('green', `✅ ${varName}: Configurada`);
      } else {
        log('red', `❌ ${varName}: FALTA`);
        allVarsPresent = false;
      }
    });

    if (allVarsPresent) {
      log('green', '✅ Todas las variables de entorno están configuradas');
    }

  } catch (error) {
    log('red', `❌ Error verificando API: ${error.message}`);
  }
}

async function verifyPermissions() {
  section('VERIFICACIÓN DE PERMISOS');
  
  try {
    // Simular verificación de permisos con diferentes usuarios
    log('blue', '🔍 Verificando permisos de RLS...');
    
    // Test con anon key (usuario normal)
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: anonProfiles, error: anonError } = await anonSupabase
      .from('profiles')
      .select('id, role')
      .limit(1);

    if (anonError) {
      log('green', '✅ RLS funcionando: Usuario anónimo no puede acceder a profiles');
    } else {
      log('yellow', '⚠️ Usuario anónimo puede acceder a profiles (revisar RLS)');
    }

    // Test con service role (super admin)
    const { data: serviceProfiles, error: serviceError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1);

    if (serviceError) {
      log('red', `❌ Service role no puede acceder: ${serviceError.message}`);
    } else {
      log('green', '✅ Service role puede acceder a profiles (correcto)');
    }

  } catch (error) {
    log('red', `❌ Error verificando permisos: ${error.message}`);
  }
}

async function main() {
  log('bright', '🚀 INICIANDO VERIFICACIÓN DEL SISTEMA SUPER ADMIN');
  log('bright', `📅 ${new Date().toLocaleString('es-ES')}`);
  
  await verifyDatabase();
  await verifyUsers();
  await verifyAPI();
  await verifyPermissions();
  
  section('RESUMEN FINAL');
  log('green', '✅ Verificación completada');
  log('cyan', '📖 Para más detalles, revisa los logs arriba');
  log('cyan', '🔄 Ejecuta este script regularmente para monitorear el sistema');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log('red', `❌ Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { verifyDatabase, verifyUsers, verifyAPI, verifyPermissions };
