#!/usr/bin/env node

/**
 * Script para debug de la estructura de la base de datos
 * Verifica constraints, triggers, funciones y políticas RLS
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Variables de entorno faltantes:");
    console.error("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "✅" : "❌");
    console.error(
        "  SUPABASE_SERVICE_ROLE_KEY:",
        SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌",
    );
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function debugDatabaseStructure() {
    console.log(
        "🔍 [DEBUG-DB-STRUCTURE] Iniciando debug de estructura de base de datos...\n",
    );

    try {
        // 1. Verificar constraints de la tabla profiles
        console.log("🔒 [DEBUG-DB-STRUCTURE] 1. Constraints de la tabla profiles:");
        try {
            const { data: constraints, error: constraintsError } = await supabase.rpc(
                "get_table_constraints",
                { table_name: "profiles" },
            );

            if (constraintsError) {
                console.log(
                    "ℹ️ [DEBUG-DB-STRUCTURE] Función get_table_constraints no disponible",
                );
                console.log("   Intentando consulta directa...");

                // Consulta alternativa para obtener constraints
                const { data: altConstraints, error: altError } = await supabase
                    .from("information_schema.table_constraints")
                    .select("*")
                    .eq("table_name", "profiles")
                    .eq("table_schema", "public");

                if (altError) {
                    console.log(
                        "❌ [DEBUG-DB-STRUCTURE] Error obteniendo constraints:",
                        altError.message,
                    );
                } else {
                    console.log(
                        "✅ [DEBUG-DB-STRUCTURE] Constraints encontrados:",
                        altConstraints.length,
                    );
                    altConstraints.forEach((constraint) => {
                        console.log(
                            `  - ${constraint.constraint_name}: ${constraint.constraint_type}`,
                        );
                    });
                }
            } else {
                console.log("✅ [DEBUG-DB-STRUCTURE] Constraints:", constraints);
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Función get_table_constraints no disponible",
            );
        }

        // 2. Verificar índices de la tabla profiles
        console.log("\n📊 [DEBUG-DB-STRUCTURE] 2. Índices de la tabla profiles:");
        try {
            const { data: indexes, error: indexesError } = await supabase
                .from("pg_indexes")
                .select("*")
                .eq("tablename", "profiles")
                .eq("schemaname", "public");

            if (indexesError) {
                console.log("ℹ️ [DEBUG-DB-STRUCTURE] Tabla pg_indexes no accesible");
                console.log("   Intentando consulta alternativa...");

                // Consulta alternativa para índices
                const { data: altIndexes, error: altIndexesError } = await supabase
                    .from("information_schema.statistics")
                    .select("*")
                    .eq("table_name", "profiles")
                    .eq("table_schema", "public");

                if (altIndexesError) {
                    console.log(
                        "❌ [DEBUG-DB-STRUCTURE] Error obteniendo índices:",
                        altIndexesError.message,
                    );
                } else {
                    console.log(
                        "✅ [DEBUG-DB-STRUCTURE] Índices encontrados:",
                        altIndexes.length,
                    );
                    altIndexes.forEach((index) => {
                        console.log(
                            `  - ${index.index_name || "Sin nombre"}: ${index.index_type || "Tipo desconocido"}`,
                        );
                    });
                }
            } else {
                console.log("✅ [DEBUG-DB-STRUCTURE] Índices:", indexes.length);
                indexes.forEach((index) => {
                    console.log(`  - ${index.indexname}: ${index.indexdef}`);
                });
            }
        } catch (e) {
            console.log("ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a índices:", e.message);
        }

        // 3. Verificar triggers de la tabla profiles
        console.log("\n🔄 [DEBUG-DB-STRUCTURE] 3. Triggers de la tabla profiles:");
        try {
            const { data: triggers, error: triggersError } = await supabase
                .from("information_schema.triggers")
                .select("*")
                .eq("event_object_table", "profiles")
                .eq("trigger_schema", "public");

            if (triggersError) {
                console.log(
                    "❌ [DEBUG-DB-STRUCTURE] Error obteniendo triggers:",
                    triggersError.message,
                );
            } else {
                console.log(
                    "✅ [DEBUG-DB-STRUCTURE] Triggers encontrados:",
                    triggers.length,
                );
                if (triggers.length === 0) {
                    console.log("  - No hay triggers configurados");
                } else {
                    triggers.forEach((trigger) => {
                        console.log(
                            `  - ${trigger.trigger_name}: ${trigger.event_manipulation} ${trigger.event_object_table}`,
                        );
                        console.log(`    Función: ${trigger.action_statement}`);
                    });
                }
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a triggers:",
                e.message,
            );
        }

        // 4. Verificar funciones que puedan estar relacionadas
        console.log("\n⚙️ [DEBUG-DB-STRUCTURE] 4. Funciones relacionadas con profiles:");
        try {
            const { data: functions, error: functionsError } = await supabase
                .from("information_schema.routines")
                .select("*")
                .eq("routine_schema", "public")
                .ilike("routine_name", "%profile%");

            if (functionsError) {
                console.log(
                    "❌ [DEBUG-DB-STRUCTURE] Error obteniendo funciones:",
                    functionsError.message,
                );
            } else {
                console.log(
                    "✅ [DEBUG-DB-STRUCTURE] Funciones relacionadas encontradas:",
                    functions.length,
                );
                if (functions.length === 0) {
                    console.log("  - No hay funciones relacionadas con profiles");
                } else {
                    functions.forEach((func) => {
                        console.log(`  - ${func.routine_name}: ${func.routine_type}`);
                    });
                }
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a funciones:",
                e.message,
            );
        }

        // 5. Verificar políticas RLS de la tabla profiles
        console.log("\n🔐 [DEBUG-DB-STRUCTURE] 5. Políticas RLS de la tabla profiles:");
        try {
            const { data: policies, error: policiesError } = await supabase
                .from("pg_policies")
                .select("*")
                .eq("tablename", "profiles")
                .eq("schemaname", "public");

            if (policiesError) {
                console.log("ℹ️ [DEBUG-DB-STRUCTURE] Tabla pg_policies no accesible");
                console.log("   Intentando consulta alternativa...");

                // Consulta alternativa para políticas RLS
                const { data: altPolicies, error: altPoliciesError } = await supabase
                    .from("information_schema.policies")
                    .select("*")
                    .eq("table_name", "profiles")
                    .eq("table_schema", "public");

                if (altPoliciesError) {
                    console.log(
                        "❌ [DEBUG-DB-STRUCTURE] Error obteniendo políticas:",
                        altPoliciesError.message,
                    );
                } else {
                    console.log(
                        "✅ [DEBUG-DB-STRUCTURE] Políticas encontradas:",
                        altPolicies.length,
                    );
                    if (altPolicies.length === 0) {
                        console.log("  - No hay políticas RLS configuradas");
                    } else {
                        altPolicies.forEach((policy) => {
                            console.log(
                                `  - ${policy.policy_name}: ${policy.policy_definition || "Sin definición"}`,
                            );
                        });
                    }
                }
            } else {
                console.log(
                    "✅ [DEBUG-DB-STRUCTURE] Políticas encontradas:",
                    policies.length,
                );
                if (policies.length === 0) {
                    console.log("  - No hay políticas RLS configuradas");
                } else {
                    policies.forEach((policy) => {
                        console.log(
                            `  - ${policy.policyname}: ${policy.cmd} ${policy.qual || "Sin condición"}`,
                        );
                    });
                }
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a políticas:",
                e.message,
            );
        }

        // 6. Verificar si hay constraints únicos en otras tablas
        console.log("\n🔍 [DEBUG-DB-STRUCTURE] 6. Constraints únicos en otras tablas:");
        try {
            const { data: uniqueConstraints, error: uniqueError } = await supabase
                .from("information_schema.table_constraints")
                .select("*")
                .eq("constraint_type", "UNIQUE")
                .eq("table_schema", "public");

            if (uniqueError) {
                console.log(
                    "❌ [DEBUG-DB-STRUCTURE] Error obteniendo constraints únicos:",
                    uniqueError.message,
                );
            } else {
                console.log(
                    "✅ [DEBUG-DB-STRUCTURE] Constraints únicos encontrados:",
                    uniqueConstraints.length,
                );
                uniqueConstraints.forEach((constraint) => {
                    console.log(
                        `  - ${constraint.table_name}.${constraint.constraint_name}: ${constraint.constraint_type}`,
                    );
                });
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a constraints únicos:",
                e.message,
            );
        }

        // 7. Verificar si hay funciones de validación automática
        console.log("\n🔍 [DEBUG-DB-STRUCTURE] 7. Funciones de validación automática:");
        try {
            const { data: validationFunctions, error: validationError } = await supabase
                .from("information_schema.routines")
                .select("*")
                .eq("routine_schema", "public")
                .or(
                    "routine_name.ilike.%validate%,routine_name.ilike.%check%,routine_name.ilike.%constraint%",
                );

            if (validationError) {
                console.log(
                    "❌ [DEBUG-DB-STRUCTURE] Error obteniendo funciones de validación:",
                    validationError.message,
                );
            } else {
                console.log(
                    "✅ [DEBUG-DB-STRUCTURE] Funciones de validación encontradas:",
                    validationFunctions.length,
                );
                if (validationFunctions.length === 0) {
                    console.log("  - No hay funciones de validación automática");
                } else {
                    validationFunctions.forEach((func) => {
                        console.log(`  - ${func.routine_name}: ${func.routine_type}`);
                    });
                }
            }
        } catch (e) {
            console.log(
                "ℹ️ [DEBUG-DB-STRUCTURE] Error accediendo a funciones de validación:",
                e.message,
            );
        }

        console.log(
            "\n🎯 [DEBUG-DB-STRUCTURE] Debug de estructura completado. Revisa los resultados arriba.",
        );
    } catch (error) {
        console.error("💥 [DEBUG-DB-STRUCTURE] Error general:", error);
        console.error("💥 [DEBUG-DB-STRUCTURE] Stack:", error.stack);
    }
}

// Ejecutar el debug
debugDatabaseStructure();
