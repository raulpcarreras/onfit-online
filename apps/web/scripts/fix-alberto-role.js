#!/usr/bin/env node

/**
 * Script temporal para corregir el role de Alberto
 * Restaura trainer@onfit.dev a role "trainer"
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

async function fixAlbertoRole() {
    try {
        log("blue", "🔧 Corrigiendo role de Alberto...");

        // Buscar Alberto por email
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const alberto = users.users.find((u) => u.email === "trainer@onfit.dev");
        if (!alberto) {
            log("red", "❌ Alberto no encontrado");
            return;
        }

        log("yellow", `✅ Alberto encontrado: ${alberto.id}`);

        // Verificar estado actual
        log("blue", "📊 Estado actual de Alberto:");
        log(
            "yellow",
            `   - JWT is_super_admin: ${alberto.app_metadata?.is_super_admin || false}`,
        );

        // Obtener profile actual
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", alberto.id)
            .single();

        if (profileError) throw profileError;

        log("yellow", `   - Profile role: ${profile.role}`);
        log("yellow", `   - Nombre: ${profile.full_name}`);

        // Corregir role a "trainer"
        if (profile.role === "admin") {
            log("blue", '🔄 Cambiando role de "admin" a "trainer"...');

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ role: "trainer" })
                .eq("id", alberto.id);

            if (updateError) throw updateError;

            log("green", '✅ Role corregido: Alberto es ahora "trainer"');
        } else {
            log("green", '✅ Role ya es correcto: Alberto es "trainer"');
        }

        // Verificar que no es super admin
        if (alberto.app_metadata?.is_super_admin) {
            log("blue", "🔄 Quitando super admin...");

            const { error: adminError } = await supabase.auth.admin.updateUserById(
                alberto.id,
                {
                    app_metadata: { is_super_admin: false },
                },
            );

            if (adminError) throw adminError;

            log("green", "✅ Super admin quitado");
        } else {
            log("green", "✅ No es super admin (correcto)");
        }

        log("green", "🎉 Alberto corregido completamente!");
    } catch (error) {
        log("red", `❌ Error: ${error.message}`);
    }
}

if (require.main === module) {
    fixAlbertoRole();
}
