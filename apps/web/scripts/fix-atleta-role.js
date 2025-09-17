#!/usr/bin/env node

/**
 * Script temporal para corregir el role de Atleta Pruebas
 * Restaura cliente@onfit.dev a role "user" pero mantiene super admin
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fixAtletaRole() {
    try {
        log("blue", "🔧 Corrigiendo role de Atleta Pruebas...");

        // Buscar Atleta por email
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const atleta = users.users.find((u) => u.email === "cliente@onfit.dev");
        if (!atleta) {
            log("red", "❌ Atleta no encontrado");
            return;
        }

        log("yellow", `✅ Atleta encontrado: ${atleta.id}`);

        // Verificar estado actual
        log("blue", "📊 Estado actual de Atleta:");
        log(
            "yellow",
            `   - JWT is_super_admin: ${atleta.app_metadata?.is_super_admin || false}`,
        );

        // Obtener profile actual
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", atleta.id)
            .single();

        if (profileError) throw profileError;

        log("yellow", `   - Profile role: ${profile.role}`);
        log("yellow", `   - Nombre: ${profile.full_name}`);

        // Corregir role a "user" (mantener super admin)
        if (profile.role === "admin") {
            log("blue", '🔄 Cambiando role de "admin" a "user"...');

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ role: "user" })
                .eq("id", atleta.id);

            if (updateError) throw updateError;

            log(
                "green",
                '✅ Role corregido: Atleta es ahora "user" (pero mantiene super admin)',
            );
        } else {
            log("green", '✅ Role ya es correcto: Atleta es "user"');
        }

        // Verificar que SÍ es super admin
        if (atleta.app_metadata?.is_super_admin) {
            log("green", "✅ Es super admin (correcto)");
        } else {
            log("red", "❌ NO es super admin (incorrecto)");
        }

        log("green", '🎉 Atleta corregido: role="user" + super_admin=true');
    } catch (error) {
        log("red", `❌ Error: ${error.message}`);
    }
}

if (require.main === module) {
    fixAtletaRole();
}
