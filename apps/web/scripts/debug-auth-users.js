#!/usr/bin/env node

/**
 * Script para debug directo de auth.users
 * Se conecta directamente a Supabase y verifica la tabla auth.users
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables de entorno faltantes:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function debugAuthUsers() {
  console.log('🔍 [DEBUG-AUTH-USERS] Iniciando debug de auth.users...\n');

  try {
    // 1. Listar TODOS los usuarios de auth.users
    console.log('👥 [DEBUG-AUTH-USERS] 1. Todos los usuarios en auth.users:');
    const { data: allUsers, error: allError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    
    if (allError) {
      console.log('❌ [DEBUG-AUTH-USERS] Error listando usuarios:', allError.message);
      return;
    }
    
    console.log('✅ [DEBUG-AUTH-USERS] Usuarios encontrados:', allUsers.users.length);
    allUsers.users.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}`);
      console.log(`     Email: "${user.email}" (tipo: ${typeof user.email})`);
      console.log(`     Email confirmado: ${user.email_confirmed_at ? '✅' : '❌'}`);
      console.log(`     Creado: ${user.created_at}`);
      console.log(`     Último sign in: ${user.last_sign_in_at || 'Nunca'}`);
      console.log(`     App metadata:`, user.app_metadata);
      console.log(`     User metadata:`, user.user_metadata);
      console.log('');
    });

    // 2. Búsqueda específica del email problemático
    const problemEmail = 'onfit13-1@onfit.dev';
    console.log(`🔍 [DEBUG-AUTH-USERS] 2. Búsqueda específica de: "${problemEmail}"`);
    
    const matchingUsers = allUsers.users.filter(user => 
      user.email === problemEmail
    );
    
    if (matchingUsers.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS] Usuarios encontrados con ese email:', matchingUsers.length);
      matchingUsers.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Creado:', user.created_at);
        console.log('    App metadata:', user.app_metadata);
      });
    } else {
      console.log('❌ [DEBUG-AUTH-USERS] NO se encontró ningún usuario con ese email');
    }

    // 3. Verificar si hay emails similares
    console.log(`\n🔍 [DEBUG-AUTH-USERS] 3. Emails similares a "${problemEmail}":`);
    const similarEmails = allUsers.users.filter(user => 
      user.email && (
        user.email.includes('onfit13-1') ||
        user.email.includes('onfit.dev') ||
        user.email.includes('onfit13')
      )
    );
    
    if (similarEmails.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS] Emails similares encontrados:', similarEmails.length);
      similarEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Creado:', user.created_at);
      });
    } else {
      console.log('ℹ️ [DEBUG-AUTH-USERS] No se encontraron emails similares');
    }

    // 4. Verificar si hay usuarios sin perfil
    console.log('\n🔍 [DEBUG-AUTH-USERS] 4. Verificando usuarios sin perfil:');
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');
    
    if (profilesError) {
      console.log('❌ [DEBUG-AUTH-USERS] Error obteniendo perfiles:', profilesError.message);
    } else {
      const profileIds = new Set(allProfiles.map(p => p.id));
      const usersWithoutProfile = allUsers.users.filter(user => !profileIds.has(user.id));
      
      if (usersWithoutProfile.length > 0) {
        console.log('⚠️ [DEBUG-AUTH-USERS] Usuarios SIN perfil encontrados:', usersWithoutProfile.length);
        usersWithoutProfile.forEach(user => {
          console.log('  - ID:', user.id);
          console.log('    Email:', `"${user.email}"`);
          console.log('    Creado:', user.created_at);
        });
      } else {
        console.log('✅ [DEBUG-AUTH-USERS] Todos los usuarios tienen perfil');
      }
    }

    // 5. Verificar si hay usuarios duplicados por email
    console.log('\n🔍 [DEBUG-AUTH-USERS] 5. Verificando usuarios duplicados por email:');
    const emailCounts = {};
    allUsers.users.forEach(user => {
      if (user.email) {
        emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
      }
    });
    
    const duplicateEmails = Object.entries(emailCounts)
      .filter(([email, count]) => count > 1)
      .map(([email, count]) => ({ email, count }));
    
    if (duplicateEmails.length > 0) {
      console.log('⚠️ [DEBUG-AUTH-USERS] Emails duplicados encontrados:', duplicateEmails.length);
      duplicateEmails.forEach(({ email, count }) => {
        console.log(`  - "${email}": ${count} usuarios`);
        const usersWithEmail = allUsers.users.filter(u => u.email === email);
        usersWithEmail.forEach(user => {
          console.log(`    * ID: ${user.id}, Creado: ${user.created_at}`);
        });
      });
    } else {
      console.log('✅ [DEBUG-AUTH-USERS] No hay emails duplicados');
    }

    // 6. Verificar si hay usuarios con emails muy largos o extraños
    console.log('\n🔍 [DEBUG-AUTH-USERS] 6. Verificando emails extraños:');
    const strangeEmails = allUsers.users.filter(user => 
      user.email && (
        user.email.length > 100 ||
        user.email.includes(' ') ||
        user.email.includes('\t') ||
        user.email.includes('\n')
      )
    );
    
    if (strangeEmails.length > 0) {
      console.log('⚠️ [DEBUG-AUTH-USERS] Emails extraños encontrados:', strangeEmails.length);
      strangeEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Longitud:', user.email.length);
        console.log('    Caracteres especiales:', user.email.replace(/[a-zA-Z0-9@.-]/g, ''));
      });
    } else {
      console.log('✅ [DEBUG-AUTH-USERS] No hay emails extraños');
    }

    console.log('\n🎯 [DEBUG-AUTH-USERS] Debug completado. Revisa los resultados arriba.');

  } catch (error) {
    console.error('💥 [DEBUG-AUTH-USERS] Error general:', error);
    console.error('💥 [DEBUG-AUTH-USERS] Stack:', error.stack);
  }
}

// Ejecutar el debug
debugAuthUsers();
