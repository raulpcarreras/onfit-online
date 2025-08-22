#!/usr/bin/env node

/**
 * Script para debug directo de auth.users usando la API de Supabase
 * Verifica si el email problemático existe en auth.users
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

async function debugAuthUsersDirect() {
  console.log('🔍 [DEBUG-AUTH-USERS-DIRECT] Iniciando debug directo de auth.users...\n');

  try {
    // 1. Listar TODOS los usuarios de auth.users
    console.log('👥 [DEBUG-AUTH-USERS-DIRECT] 1. Todos los usuarios en auth.users:');
    const { data: allUsers, error: allError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    
    if (allError) {
      console.log('❌ [DEBUG-AUTH-USERS-DIRECT] Error listando usuarios:', allError.message);
      return;
    }
    
    console.log('✅ [DEBUG-AUTH-USERS-DIRECT] Usuarios encontrados:', allUsers.users.length);
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
    console.log(`🔍 [DEBUG-AUTH-USERS-DIRECT] 2. Búsqueda específica de: "${problemEmail}"`);
    
    const matchingUsers = allUsers.users.filter(user => 
      user.email === problemEmail
    );
    
    if (matchingUsers.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] Usuarios encontrados con ese email:', matchingUsers.length);
      matchingUsers.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Creado:', user.created_at);
        console.log('    App metadata:', user.app_metadata);
      });
    } else {
      console.log('❌ [DEBUG-AUTH-USERS-DIRECT] NO se encontró ningún usuario con ese email');
    }

    // 3. Verificar si hay emails similares o parciales
    console.log(`\n🔍 [DEBUG-AUTH-USERS-DIRECT] 3. Emails similares a "${problemEmail}":`);
    const similarEmails = allUsers.users.filter(user => 
      user.email && (
        user.email.includes('onfit13-1') ||
        user.email.includes('onfit.dev') ||
        user.email.includes('onfit13') ||
        user.email.includes('onfit')
      )
    );
    
    if (similarEmails.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] Emails similares encontrados:', similarEmails.length);
      similarEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Creado:', user.created_at);
      });
    } else {
      console.log('ℹ️ [DEBUG-AUTH-USERS-DIRECT] No se encontraron emails similares');
    }

    // 4. Verificar si hay usuarios con emails muy largos o extraños
    console.log('\n🔍 [DEBUG-AUTH-USERS-DIRECT] 4. Emails extraños o muy largos:');
    const strangeEmails = allUsers.users.filter(user => 
      user.email && (
        user.email.length > 100 ||
        user.email.includes(' ') ||
        user.email.includes('\t') ||
        user.email.includes('\n') ||
        user.email.includes('\\') ||
        user.email.includes('"') ||
        user.email.includes("'")
      )
    );
    
    if (strangeEmails.length > 0) {
      console.log('⚠️ [DEBUG-AUTH-USERS-DIRECT] Emails extraños encontrados:', strangeEmails.length);
      strangeEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Longitud:', user.email.length);
        console.log('    Caracteres especiales:', user.email.replace(/[a-zA-Z0-9@.-]/g, ''));
      });
    } else {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] No hay emails extraños');
    }

    // 5. Verificar si hay usuarios duplicados por email
    console.log('\n🔍 [DEBUG-AUTH-USERS-DIRECT] 5. Verificando usuarios duplicados por email:');
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
      console.log('⚠️ [DEBUG-AUTH-USERS-DIRECT] Emails duplicados encontrados:', duplicateEmails.length);
      duplicateEmails.forEach(({ email, count }) => {
        console.log(`  - "${email}": ${count} usuarios`);
        const usersWithEmail = allUsers.users.filter(u => u.email === email);
        usersWithEmail.forEach(user => {
          console.log(`    * ID: ${user.id}, Creado: ${user.created_at}`);
        });
      });
    } else {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] No hay emails duplicados');
    }

    // 6. Verificar si hay usuarios con emails que contengan caracteres especiales
    console.log('\n🔍 [DEBUG-AUTH-USERS-DIRECT] 6. Emails con caracteres especiales:');
    const specialCharEmails = allUsers.users.filter(user => 
      user.email && (
        user.email.includes('_') ||
        user.email.includes('-') ||
        user.email.includes('.') ||
        user.email.includes('+') ||
        user.email.includes('@')
      )
    );
    
    if (specialCharEmails.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] Emails con caracteres especiales:', specialCharEmails.length);
      specialCharEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Caracteres especiales:', user.email.replace(/[a-zA-Z0-9]/g, ''));
      });
    } else {
      console.log('ℹ️ [DEBUG-AUTH-USERS-DIRECT] No hay emails con caracteres especiales');
    }

    // 7. Verificar si hay usuarios con emails que contengan números
    console.log('\n🔍 [DEBUG-AUTH-USERS-DIRECT] 7. Emails que contienen números:');
    const numericEmails = allUsers.users.filter(user => 
      user.email && /\d/.test(user.email)
    );
    
    if (numericEmails.length > 0) {
      console.log('✅ [DEBUG-AUTH-USERS-DIRECT] Emails con números:', numericEmails.length);
      numericEmails.forEach(user => {
        console.log('  - ID:', user.id);
        console.log('    Email:', `"${user.email}"`);
        console.log('    Números encontrados:', user.email.match(/\d/g)?.join('') || 'Ninguno');
      });
    } else {
      console.log('ℹ️ [DEBUG-AUTH-USERS-DIRECT] No hay emails con números');
    }

    console.log('\n🎯 [DEBUG-AUTH-USERS-DIRECT] Debug directo completado. Revisa los resultados arriba.');

  } catch (error) {
    console.error('💥 [DEBUG-AUTH-USERS-DIRECT] Error general:', error);
    console.error('💥 [DEBUG-AUTH-USERS-DIRECT] Stack:', error.stack);
  }
}

// Ejecutar el debug
debugAuthUsersDirect();
