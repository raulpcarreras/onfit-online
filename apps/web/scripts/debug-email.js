#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Variables de entorno no configuradas");
    process.exit(1);
}

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

async function debugEmail() {
    const emailToCheck = "onfit13-1@onfit.dev";

    console.log("🔍 INVESTIGANDO EMAIL:", emailToCheck);
    console.log("📅", new Date().toLocaleString("es-ES"));
    console.log("");

    try {
        // 1) Verificar en auth.users
        console.log("🔍 1) Verificando en auth.users...");
        const { data: authUsers, error: authError } =
            await adminSupabase.auth.admin.listUsers({
                page: 1,
                perPage: 1000,
            });

        if (authError) {
            console.error("❌ Error listando usuarios auth:", authError.message);
            return;
        }

        const authUser = authUsers.users.find(
            (u) => u.email?.toLowerCase() === emailToCheck.toLowerCase(),
        );

        if (authUser) {
            console.log("✅ Usuario encontrado en auth.users:");
            console.log("  - ID:", authUser.id);
            console.log("  - Email:", authUser.email);
            console.log(
                "  - Email confirmado:",
                authUser.email_confirmed_at ? "Sí" : "No",
            );
            console.log("  - Creado:", authUser.created_at);
            console.log("  - App metadata:", authUser.app_metadata);
        } else {
            console.log("❌ Usuario NO encontrado en auth.users");
        }

        console.log("");

        // 2) Verificar en profiles
        console.log("🔍 2) Verificando en profiles...");
        const { data: profiles, error: profilesError } = await adminSupabase
            .from("profiles")
            .select("*")
            .or(
                `email.eq.${emailToCheck},email.eq.${emailToCheck.toLowerCase()},email.eq.${emailToCheck.toUpperCase()}`,
            );

        if (profilesError) {
            console.error("❌ Error consultando profiles:", profilesError.message);
            return;
        }

        if (profiles && profiles.length > 0) {
            console.log("✅ Perfiles encontrados en profiles:");
            profiles.forEach((profile, index) => {
                console.log(`  - Perfil ${index + 1}:`);
                console.log("    ID:", profile.id);
                console.log("    Email:", profile.email);
                console.log("    Nombre:", profile.full_name);
                console.log("    Rol:", profile.role);
                console.log("    Creado:", profile.created_at);
            });
        } else {
            console.log("❌ NO se encontraron perfiles en profiles");
        }

        console.log("");

        // 3) Verificar con consulta directa SQL
        console.log("🔍 3) Verificación SQL directa...");
        const { data: sqlResult, error: sqlError } = await adminSupabase.rpc("exec_sql", {
            query: `SELECT id, email, full_name, role, created_at FROM profiles WHERE email ILIKE '${emailToCheck}'`,
        });

        if (sqlError) {
            console.log("ℹ️ RPC no disponible, usando consulta alternativa...");

            // Alternativa: consulta con LIKE
            const { data: likeResult, error: likeError } = await adminSupabase
                .from("profiles")
                .select("*")
                .ilike("email", `%${emailToCheck}%`);

            if (likeError) {
                console.error("❌ Error con consulta LIKE:", likeError.message);
            } else if (likeResult && likeResult.length > 0) {
                console.log("✅ Resultados con LIKE:");
                likeResult.forEach((profile, index) => {
                    console.log(`  - Perfil ${index + 1}:`);
                    console.log("    ID:", profile.id);
                    console.log("    Email:", profile.email);
                    console.log("    Nombre:", profile.full_name);
                });
            } else {
                console.log("❌ No hay resultados con LIKE");
            }
        } else {
            console.log("✅ Resultados SQL directos:", sqlResult);
        }

        console.log("");

        // 4) Verificar todos los perfiles para debug
        console.log("🔍 4) Listando todos los perfiles para debug...");
        const { data: allProfiles, error: allError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name, role, created_at")
            .order("created_at", { ascending: false })
            .limit(10);

        if (allError) {
            console.error("❌ Error listando todos los perfiles:", allError.message);
        } else {
            console.log("📋 Últimos 10 perfiles:");
            allProfiles.forEach((profile, index) => {
                console.log(
                    `  ${index + 1}. ${profile.email} (${profile.full_name}) - ${profile.role}`,
                );
            });
        }
    } catch (error) {
        console.error("💥 Error general:", error.message);
    }
}

debugEmail();
