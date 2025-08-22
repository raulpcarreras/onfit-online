#!/usr/bin/env node

/**
 * Script para debug usando funciones RPC disponibles en Supabase
 * Intenta usar funciones del sistema que sí están disponibles
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

async function debugSupabaseRPC() {
  console.log('🔍 [DEBUG-SUPABASE-RPC] Iniciando debug usando funciones RPC...\n');

  try {
    // 1. Intentar obtener información de la tabla profiles usando RPC
    console.log('📋 [DEBUG-SUPABASE-RPC] 1. Información de la tabla profiles:');
    
    // Intentar diferentes funciones RPC disponibles
    const rpcFunctions = [
      'get_table_info',
      'get_table_structure', 
      'get_table_schema',
      'describe_table',
      'table_info',
      'get_columns',
      'get_table_columns'
    ];

    let tableInfo = null;
    for (const funcName of rpcFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName, { 
          table_name: 'profiles' 
        });
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          tableInfo = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!tableInfo) {
      console.log('  ℹ️ No se pudo obtener información de la tabla usando RPC');
    }

    // 2. Intentar obtener constraints usando RPC
    console.log('\n🔒 [DEBUG-SUPABASE-RPC] 2. Constraints de la tabla profiles:');
    
    const constraintFunctions = [
      'get_table_constraints',
      'get_constraints',
      'table_constraints',
      'get_unique_constraints'
    ];

    let constraints = null;
    for (const funcName of constraintFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName, { 
          table_name: 'profiles' 
        });
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          constraints = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!constraints) {
      console.log('  ℹ️ No se pudo obtener constraints usando RPC');
    }

    // 3. Intentar obtener índices usando RPC
    console.log('\n📊 [DEBUG-SUPABASE-RPC] 3. Índices de la tabla profiles:');
    
    const indexFunctions = [
      'get_table_indexes',
      'get_indexes',
      'table_indexes',
      'get_table_keys'
    ];

    let indexes = null;
    for (const funcName of indexFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName, { 
          table_name: 'profiles' 
        });
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          indexes = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!indexes) {
      console.log('  ℹ️ No se pudo obtener índices usando RPC');
    }

    // 4. Intentar obtener triggers usando RPC
    console.log('\n🔄 [DEBUG-SUPABASE-RPC] 4. Triggers de la tabla profiles:');
    
    const triggerFunctions = [
      'get_table_triggers',
      'get_triggers',
      'table_triggers'
    ];

    let triggers = null;
    for (const funcName of triggerFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName, { 
          table_name: 'profiles' 
        });
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          triggers = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!triggers) {
      console.log('  ℹ️ No se pudo obtener triggers usando RPC');
    }

    // 5. Intentar obtener funciones del sistema
    console.log('\n⚙️ [DEBUG-SUPABASE-RPC] 5. Funciones del sistema disponibles:');
    
    const systemFunctions = [
      'get_available_functions',
      'list_functions',
      'get_system_functions',
      'available_rpc'
    ];

    let systemFuncs = null;
    for (const funcName of systemFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName);
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          systemFuncs = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!systemFuncs) {
      console.log('  ℹ️ No se pudo obtener funciones del sistema usando RPC');
    }

    // 6. Intentar ejecutar SQL raw usando RPC
    console.log('\n🔍 [DEBUG-SUPABASE-RPC] 6. Intentando SQL raw:');
    
    const sqlFunctions = [
      'exec_sql',
      'run_sql',
      'execute_sql',
      'sql_query'
    ];

    let sqlResult = null;
    for (const funcName of sqlFunctions) {
      try {
        console.log(`  🔍 Intentando función: ${funcName}`);
        const { data, error } = await supabase.rpc(funcName, { 
          query: 'SELECT * FROM profiles LIMIT 1' 
        });
        
        if (!error && data) {
          console.log(`  ✅ Función ${funcName} exitosa:`, data);
          sqlResult = data;
          break;
        } else {
          console.log(`  ❌ Función ${funcName} falló:`, error?.message || 'Sin datos');
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    if (!sqlResult) {
      console.log('  ℹ️ No se pudo ejecutar SQL raw usando RPC');
    }

    // 7. Verificar si hay funciones personalizadas en el proyecto
    console.log('\n🔍 [DEBUG-SUPABASE-RPC] 7. Verificando funciones personalizadas del proyecto:');
    
    // Intentar funciones que podrían estar definidas en el proyecto
    const customFunctions = [
      'is_super_admin', // Esta función sí existe según la migración
      'get_user_profile',
      'get_profile_by_email'
    ];

    for (const funcName of customFunctions) {
      try {
        console.log(`  🔍 Probando función personalizada: ${funcName}`);
        
        if (funcName === 'is_super_admin') {
          // Esta función requiere un UUID de usuario
          const { data, error } = await supabase.rpc(funcName, { 
            user_id: '00000000-0000-0000-0000-000000000000' // UUID dummy
          });
          
          if (!error) {
            console.log(`  ✅ Función ${funcName} disponible, resultado:`, data);
          } else {
            console.log(`  ❌ Función ${funcName} falló:`, error.message);
          }
        } else {
          const { data, error } = await supabase.rpc(funcName);
          
          if (!error && data) {
            console.log(`  ✅ Función ${funcName} disponible:`, data);
          } else {
            console.log(`  ❌ Función ${funcName} no disponible:`, error?.message || 'Sin datos');
          }
        }
      } catch (e) {
        console.log(`  ❌ Función ${funcName} no disponible:`, e.message);
      }
    }

    console.log('\n🎯 [DEBUG-SUPABASE-RPC] Debug RPC completado. Revisa los resultados arriba.');

  } catch (error) {
    console.error('💥 [DEBUG-SUPABASE-RPC] Error general:', error);
    console.error('💥 [DEBUG-SUPABASE-RPC] Stack:', error.stack);
  }
}

// Ejecutar el debug
debugSupabaseRPC();
