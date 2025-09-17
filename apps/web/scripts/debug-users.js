#!/usr/bin/env node

/**
 * Script temporal para debuggear usuarios
 * Compara auth.users vs profiles
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
    cyan: "\x1b[36m",
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function debugUsers() {
    try {
        log("blue", "🔍 DEBUGGING USUARIOS...");

        // 1. Obtener usuarios de auth.users
        log("cyan", "📋 AUTH.USERS:");
        const { data: authUsers, error: authError } =
            await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        authUsers.users.forEach((user, i) => {
            log(
                "yellow",
                `   ${i + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`,
            );
            log(
                "cyan",
                `      - is_super_admin: ${user.app_metadata?.is_super_admin || false}`,
            );
            log(
                "cyan",
                `      - created: ${new Date(user.created_at).toLocaleDateString("es-ES")}`,
            );
        });

        // 2. Obtener usuarios de profiles
        log("cyan", "\n📋 PROFILES:");
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, email, full_name, role, created_at");

        if (profilesError) throw profilesError;

        profiles.forEach((profile, i) => {
            log(
                "yellow",
                `   ${i + 1}. ${profile.email} (ID: ${profile.id.substring(0, 8)}...)`,
            );
            log("cyan", `      - full_name: ${profile.full_name || "Sin nombre"}`);
            log("cyan", `      - role: ${profile.role}`);
            log(
                "cyan",
                `      - created: ${new Date(profile.created_at).toLocaleDateString("es-ES")}`,
            );
        });

        // 3. Comparar y encontrar inconsistencias
        log("cyan", "\n🔍 COMPARACIÓN:");

        const authEmails = authUsers.users.map((u) => u.email);
        const profileEmails = profiles.map((p) => p.email);

        const onlyInProfiles = profileEmails.filter(
            (email) => !authEmails.includes(email),
        );
        const onlyInAuth = authEmails.filter((email) => !profileEmails.includes(email));

        if (onlyInProfiles.length > 0) {
            log(
                "red",
                `❌ Solo en profiles (NO en auth.users): ${onlyInProfiles.join(", ")}`,
            );
        }

        if (onlyInAuth.length > 0) {
            log(
                "red",
                `❌ Solo en auth.users (NO en profiles): ${onlyInAuth.join(", ")}`,
            );
        }

        if (onlyInProfiles.length === 0 && onlyInAuth.length === 0) {
            log("green", "✅ Sincronización perfecta entre auth.users y profiles");
        }
    } catch (error) {
        log("red", `❌ Error: ${error.message}`);
    }
}

if (require.main === module) {
    debugUsers();
}
