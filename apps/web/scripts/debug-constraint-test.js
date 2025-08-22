#!/usr/bin/env node

/**
 * Script para debug de constraints probando diferentes inserciones
 * Intenta identificar qué constraint está causando el problema
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

async function debugConstraintTest() {
  console.log('🔍 [DEBUG-CONSTRAINT-TEST] Iniciando debug de constraints...\n');

  try {
    // 1. Verificar si podemos insertar un perfil con email diferente
    console.log('🧪 [DEBUG-CONSTRAINT-TEST] 1. Probando inserción con email diferente:');
    
    const testEmail1 = 'test-different@onfit.dev';
    console.log(`  🔍 Intentando insertar perfil con email: "${testEmail1}"`);
    
    try {
      const { data: insert1, error: error1 } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000001', // UUID dummy
          full_name: 'Test Different',
          email: testEmail1,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error1) {
        console.log(`  ❌ Error insertando "${testEmail1}":`, error1.message);
        console.log(`  🔍 Tipo de error:`, error1.code || 'Sin código');
        console.log(`  🔍 Detalles:`, error1.details || 'Sin detalles');
        console.log(`  🔍 Hint:`, error1.hint || 'Sin hint');
      } else {
        console.log(`  ✅ Inserción exitosa con "${testEmail1}":`, insert1);
        
        // Limpiar el test
        await supabase
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000001');
        console.log(`  🗑️ Test limpiado`);
      }
    } catch (e) {
      console.log(`  ❌ Excepción insertando "${testEmail1}":`, e.message);
    }

    // 2. Verificar si podemos insertar un perfil con email similar al problemático
    console.log('\n🧪 [DEBUG-CONSTRAINT-TEST] 2. Probando inserción con email similar:');
    
    const testEmail2 = 'onfit13-2@onfit.dev'; // Similar al problemático
    console.log(`  🔍 Intentando insertar perfil con email: "${testEmail2}"`);
    
    try {
      const { data: insert2, error: error2 } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000002', // UUID dummy
          full_name: 'Test Similar',
          email: testEmail2,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error2) {
        console.log(`  ❌ Error insertando "${testEmail2}":`, error2.message);
        console.log(`  🔍 Tipo de error:`, error2.code || 'Sin código');
        console.log(`  🔍 Detalles:`, error2.details || 'Sin detalles');
        console.log(`  🔍 Hint:`, error2.hint || 'Sin hint');
      } else {
        console.log(`  ✅ Inserción exitosa con "${testEmail2}":`, insert2);
        
        // Limpiar el test
        await supabase
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000002');
        console.log(`  🗑️ Test limpiado`);
      }
    } catch (e) {
      console.log(`  ❌ Excepción insertando "${testEmail2}":`, e.message);
    }

    // 3. Verificar si podemos insertar un perfil con email que contenga números
    console.log('\n🧪 [DEBUG-CONSTRAINT-TEST] 3. Probando inserción con email con números:');
    
    const testEmail3 = 'test123@onfit.dev'; // Con números
    console.log(`  🔍 Intentando insertar perfil con email: "${testEmail3}"`);
    
    try {
      const { data: insert3, error: error3 } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000003', // UUID dummy
          full_name: 'Test Numbers',
          email: testEmail3,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error3) {
        console.log(`  ❌ Error insertando "${testEmail3}":`, error3.message);
        console.log(`  🔍 Tipo de error:`, error3.code || 'Sin código');
        console.log(`  🔍 Detalles:`, error3.details || 'Sin detalles');
        console.log(`  🔍 Hint:`, error3.hint || 'Sin hint');
      } else {
        console.log(`  ✅ Inserción exitosa con "${testEmail3}":`, insert3);
        
        // Limpiar el test
        await supabase
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000003');
        console.log(`  🗑️ Test limpiado`);
      }
    } catch (e) {
      console.log(`  ❌ Excepción insertando "${testEmail3}":`, e.message);
    }

    // 4. Verificar si podemos insertar un perfil con email que contenga guiones
    console.log('\n🧪 [DEBUG-CONSTRAINT-TEST] 4. Probando inserción con email con guiones:');
    
    const testEmail4 = 'test-with-dash@onfit.dev'; // Con guiones
    console.log(`  🔍 Intentando insertar perfil con email: "${testEmail4}"`);
    
    try {
      const { data: insert4, error: error4 } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000004', // UUID dummy
          full_name: 'Test Dash',
          email: testEmail4,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error4) {
        console.log(`  ❌ Error insertando "${testEmail4}":`, error4.message);
        console.log(`  🔍 Tipo de error:`, error4.code || 'Sin código');
        console.log(`  🔍 Detalles:`, error4.details || 'Sin detalles');
        console.log(`  🔍 Hint:`, error4.hint || 'Sin hint');
      } else {
        console.log(`  ✅ Inserción exitosa con "${testEmail4}":`, insert4);
        
        // Limpiar el test
        await supabase
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000004');
        console.log(`  🗑️ Test limpiado`);
      }
    } catch (e) {
      console.log(`  ❌ Excepción insertando "${testEmail4}":`, e.message);
    }

    // 5. Verificar si podemos insertar un perfil con email exactamente igual al problemático
    console.log('\n🧪 [DEBUG-CONSTRAINT-TEST] 5. Probando inserción con email exacto al problemático:');
    
    const problemEmail = 'onfit13-1@onfit.dev'; // El email problemático
    console.log(`  🔍 Intentando insertar perfil con email: "${problemEmail}"`);
    
    try {
      const { data: insert5, error: error5 } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000005', // UUID dummy
          full_name: 'Test Problem',
          email: problemEmail,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error5) {
        console.log(`  ❌ Error insertando "${problemEmail}":`, error5.message);
        console.log(`  🔍 Tipo de error:`, error5.code || 'Sin código');
        console.log(`  🔍 Detalles:`, error5.details || 'Sin detalles');
        console.log(`  🔍 Hint:`, error5.hint || 'Sin hint');
        
        // Si es el error que esperamos, analizarlo en detalle
        if (error5.message.includes('duplicate key value violates unique constraint "profiles_email_key"')) {
          console.log(`  🎯 ¡ENCONTRADO! Este es el error que estamos investigando`);
          console.log(`  🔍 El constraint "profiles_email_key" está fallando`);
          console.log(`  🔍 Aunque el email NO existe en la tabla`);
          console.log(`  🔍 Esto sugiere un constraint compuesto o un trigger`);
        }
      } else {
        console.log(`  ✅ Inserción exitosa con "${problemEmail}":`, insert5);
        console.log(`  🎯 ¡SORPRESA! El email problemático SÍ se puede insertar`);
        
        // Limpiar el test
        await supabase
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000005');
        console.log(`  🗑️ Test limpiado`);
      }
    } catch (e) {
      console.log(`  ❌ Excepción insertando "${problemEmail}":`, e.message);
    }

    // 6. Verificar si hay algún problema con el campo role
    console.log('\n🧪 [DEBUG-CONSTRAINT-TEST] 6. Probando inserción con diferentes roles:');
    
    const testEmails = [
      'test-role1@onfit.dev',
      'test-role2@onfit.dev',
      'test-role3@onfit.dev'
    ];
    
    const roles = ['user', 'trainer', 'admin'];
    
    for (let i = 0; i < testEmails.length; i++) {
      const testEmail = testEmails[i];
      const role = roles[i];
      
      console.log(`  🔍 Probando rol "${role}" con email "${testEmail}"`);
      
      try {
        const { data: insert, error: error } = await supabase
          .from('profiles')
          .insert({
            id: `00000000-0000-0000-0000-0000000000${10 + i}`, // UUID dummy
            full_name: `Test Role ${role}`,
            email: testEmail,
            role: role,
            created_at: new Date().toISOString(),
          })
          .select();
        
        if (error) {
          console.log(`    ❌ Error con rol "${role}":`, error.message);
        } else {
          console.log(`    ✅ Éxito con rol "${role}":`, insert);
          
          // Limpiar el test
          await supabase
            .from('profiles')
            .delete()
            .eq('id', `00000000-0000-0000-0000-0000000000${10 + i}`);
          console.log(`    🗑️ Test limpiado`);
        }
      } catch (e) {
        console.log(`    ❌ Excepción con rol "${role}":`, e.message);
      }
    }

    console.log('\n🎯 [DEBUG-CONSTRAINT-TEST] Debug de constraints completado. Revisa los resultados arriba.');

  } catch (error) {
    console.error('💥 [DEBUG-CONSTRAINT-TEST] Error general:', error);
    console.error('💥 [DEBUG-CONSTRAINT-TEST] Stack:', error.stack);
  }
}

// Ejecutar el debug
debugConstraintTest();
