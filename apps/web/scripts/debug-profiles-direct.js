#!/usr/bin/env node

/**
 * Script para debug directo de la tabla profiles
 * Se conecta directamente a Supabase y hace consultas SQL raw
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

async function debugProfilesDirect() {
  console.log('🔍 [DEBUG-PROFILES] Iniciando debug directo de profiles...\n');

  try {
    // 1. Verificar estructura de la tabla
    console.log('📋 [DEBUG-PROFILES] 1. Estructura de la tabla profiles:');
    const { data: structure, error: structureError } = await supabase
      .rpc('get_table_structure', { table_name: 'profiles' });
    
    if (structureError) {
      console.log('ℹ️ [DEBUG-PROFILES] No se puede obtener estructura, continuando...');
    } else {
      console.log('✅ [DEBUG-PROFILES] Estructura:', structure);
    }

    // 2. Contar total de registros
    console.log('\n📊 [DEBUG-PROFILES] 2. Total de registros en profiles:');
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ [DEBUG-PROFILES] Error contando registros:', countError.message);
    } else {
      console.log('✅ [DEBUG-PROFILES] Total registros:', count);
    }

    // 3. Listar TODOS los perfiles con detalles
    console.log('\n👥 [DEBUG-PROFILES] 3. Todos los perfiles en profiles:');
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.log('❌ [DEBUG-PROFILES] Error listando perfiles:', allError.message);
    } else {
      console.log('✅ [DEBUG-PROFILES] Perfiles encontrados:', allProfiles.length);
      allProfiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. ID: ${profile.id}`);
        console.log(`     Email: "${profile.email}" (tipo: ${typeof profile.email})`);
        console.log(`     Nombre: ${profile.full_name}`);
        console.log(`     Rol: ${profile.role}`);
        console.log(`     Creado: ${profile.created_at}`);
        console.log(`     Actualizado: ${profile.updated_at}`);
        console.log('');
      });
    }

    // 4. Búsqueda específica del email problemático
    const problemEmail = 'onfit13-1@onfit.dev';
    console.log(`🔍 [DEBUG-PROFILES] 4. Búsqueda específica de: "${problemEmail}"`);
    
    // 4a. Búsqueda exacta
    const { data: exactMatch, error: exactError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', problemEmail);
    
    if (exactError) {
      console.log('❌ [DEBUG-PROFILES] Error en búsqueda exacta:', exactError.message);
    } else {
      console.log('✅ [DEBUG-PROFILES] Búsqueda exacta:', exactMatch?.length || 0, 'coincidencias');
      if (exactMatch?.length > 0) {
        exactMatch.forEach(match => console.log('  -', match));
      }
    }

    // 4b. Búsqueda con ILIKE
    const { data: ilikeMatch, error: ilikeError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', problemEmail);
    
    if (ilikeError) {
      console.log('❌ [DEBUG-PROFILES] Error en búsqueda ILIKE:', ilikeError.message);
    } else {
      console.log('✅ [DEBUG-PROFILES] Búsqueda ILIKE:', ilikeMatch?.length || 0, 'coincidencias');
      if (ilikeMatch?.length > 0) {
        ilikeMatch.forEach(match => console.log('  -', match));
      }
    }

    // 4c. Búsqueda con LIKE
    const { data: likeMatch, error: likeError } = await supabase
      .from('profiles')
      .select('*')
      .like('email', `%${problemEmail}%`);
    
    if (likeError) {
      console.log('❌ [DEBUG-PROFILES] Error en búsqueda LIKE:', likeError.message);
    } else {
      console.log('✅ [DEBUG-PROFILES] Búsqueda LIKE:', likeMatch?.length || 0, 'coincidencias');
      if (likeMatch?.length > 0) {
        likeMatch.forEach(match => console.log('  -', match));
      }
    }

    // 4d. Búsqueda manual en todos los perfiles
    console.log('\n🔍 [DEBUG-PROFILES] 4d. Búsqueda manual en todos los perfiles:');
    if (allProfiles) {
      const manualMatches = allProfiles.filter(profile => {
        const profileEmail = profile.email || '';
        return (
          profileEmail === problemEmail ||
          profileEmail.toLowerCase() === problemEmail.toLowerCase() ||
          profileEmail.includes(problemEmail) ||
          problemEmail.includes(profileEmail)
        );
      });
      
      console.log('✅ [DEBUG-PROFILES] Búsqueda manual:', manualMatches.length, 'coincidencias');
      if (manualMatches.length > 0) {
        manualMatches.forEach(match => {
          console.log('  - ID:', match.id);
          console.log('    Email:', `"${match.email}"`);
          console.log('    Nombre:', match.full_name);
          console.log('');
        });
      }
    }

    // 5. Verificar índices y constraints
    console.log('\n🔒 [DEBUG-PROFILES] 5. Verificando constraints e índices:');
    try {
      const { data: constraints, error: constraintsError } = await supabase
        .rpc('get_table_constraints', { table_name: 'profiles' });
      
      if (constraintsError) {
        console.log('ℹ️ [DEBUG-PROFILES] No se pueden obtener constraints, continuando...');
      } else {
        console.log('✅ [DEBUG-PROFILES] Constraints:', constraints);
      }
    } catch (e) {
      console.log('ℹ️ [DEBUG-PROFILES] Función get_table_constraints no disponible');
    }

    // 6. Consulta SQL raw directa
    console.log('\n🔍 [DEBUG-PROFILES] 6. Consulta SQL raw directa:');
    try {
      const { data: rawQuery, error: rawError } = await supabase
        .rpc('exec_sql', { 
          sql_query: `
            SELECT 
              id, 
              email, 
              full_name, 
              role,
              LENGTH(email) as email_length,
              email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' as is_valid_email
            FROM profiles 
            WHERE email ILIKE '%onfit13-1@onfit.dev%'
            OR email ILIKE '%onfit13-1%'
            OR email ILIKE '%onfit.dev%'
            ORDER BY created_at DESC;
          `
        });
      
      if (rawError) {
        console.log('ℹ️ [DEBUG-PROFILES] Función exec_sql no disponible, continuando...');
      } else {
        console.log('✅ [DEBUG-PROFILES] Consulta SQL raw:', rawQuery);
      }
    } catch (e) {
      console.log('ℹ️ [DEBUG-PROFILES] Función exec_sql no disponible');
    }

    // 7. Verificar si hay transacciones pendientes
    console.log('\n🔄 [DEBUG-PROFILES] 7. Verificando transacciones:');
    try {
      const { data: transactions, error: transError } = await supabase
        .rpc('get_active_transactions');
      
      if (transError) {
        console.log('ℹ️ [DEBUG-PROFILES] No se pueden obtener transacciones, continuando...');
      } else {
        console.log('✅ [DEBUG-PROFILES] Transacciones activas:', transactions);
      }
    } catch (e) {
      console.log('ℹ️ [DEBUG-PROFILES] Función get_active_transactions no disponible');
    }

    console.log('\n🎯 [DEBUG-PROFILES] Debug completado. Revisa los resultados arriba.');

  } catch (error) {
    console.error('💥 [DEBUG-PROFILES] Error general:', error);
    console.error('💥 [DEBUG-PROFILES] Stack:', error.stack);
  }
}

// Ejecutar el debug
debugProfilesDirect();
