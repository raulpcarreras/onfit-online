#!/usr/bin/env node

/**
 * Script para gestionar super admins desde terminal
 * Uso: node scripts/manage-super-admin.js <email> <enable|disable>
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function findUser(email) {
    log("blue", `🔍 Buscando usuario: ${email}`);

    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    const user = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
        throw new Error(`Usuario no encontrado: ${email}`);
    }

    log("green", `✅ Usuario encontrado: ${user.id}`);
    return user;
}

async function toggleSuperAdmin(email, enable) {
    try {
        const user = await findUser(email);

        log(
            "blue",
            `${enable ? "🔼" : "🔽"} ${enable ? "Otorgando" : "Quitando"} super admin...`,
        );

        // Actualizar app_metadata
        const { data: updated, error: updateError } =
            await supabase.auth.admin.updateUserById(user.id, {
                app_metadata: {
                    ...user.app_metadata,
                    is_super_admin: enable,
                },
            });

        if (updateError) throw updateError;

        // ❌ SINCRONIZACIÓN AUTOMÁTICA ELIMINADA
        // Los roles se gestionan independientemente via /api/admin/promote-role
        // Super admin y profiles.role son completamente independientes

        log("green", `✅ Super admin ${enable ? "otorgado" : "quitado"} a ${email}`);

        // Mostrar estado actual
        const currentState = updated.user.app_metadata?.is_super_admin;
        log("cyan", `📊 Estado actual: is_super_admin = ${currentState}`);

        return true;
    } catch (error) {
        log("red", `❌ Error: ${error.message}`);
        return false;
    }
}

async function listSuperAdmins() {
    try {
        log("blue", "🔍 Listando todos los super admins...");

        const { data: users, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        const superAdmins = users.users.filter(
            (user) => user.app_metadata?.is_super_admin === true,
        );

        if (superAdmins.length === 0) {
            log("yellow", "⚠️ No hay super admins configurados");
        } else {
            log("green", `👑 Super Admins encontrados: ${superAdmins.length}`);
            superAdmins.forEach((user, i) => {
                log(
                    "cyan",
                    `   ${i + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`,
                );
                log(
                    "yellow",
                    `      Creado: ${new Date(user.created_at).toLocaleString("es-ES")}`,
                );
                log(
                    "yellow",
                    `      Último login: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("es-ES") : "Nunca"}`,
                );
            });
        }

        return superAdmins;
    } catch (error) {
        log("red", `❌ Error listando super admins: ${error.message}`);
        return [];
    }
}

async function verifyUserPermissions(email) {
    try {
        log("blue", `🔍 Verificando permisos de: ${email}`);

        const user = await findUser(email);

        // Estado en JWT
        const isSuperInJWT = user.app_metadata?.is_super_admin === true;
        log("cyan", `📋 JWT app_metadata.is_super_admin: ${isSuperInJWT}`);

        // Estado en profiles
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (profileError) {
            log("red", `❌ Error en profiles: ${profileError.message}`);
        } else {
            log("cyan", `📋 Profiles.role: ${profile.role}`);
            log("cyan", `📋 Nombre: ${profile.full_name || "Sin nombre"}`);
        }

        // Verificar si puede acceder a datos de otros usuarios
        const { data: otherProfiles, error: accessError } = await supabase
            .from("profiles")
            .select("id")
            .neq("id", user.id)
            .limit(1);

        if (accessError) {
            log("red", `❌ No puede acceder a otros perfiles: ${accessError.message}`);
        } else {
            log(
                "green",
                `✅ Puede acceder a otros perfiles: ${otherProfiles.length > 0 ? "Sí" : "No hay otros usuarios"}`,
            );
        }
    } catch (error) {
        log("red", `❌ Error verificando permisos: ${error.message}`);
    }
}

function showUsage() {
    console.log(`
${colors.bright}📖 USO DEL SCRIPT:${colors.reset}

${colors.cyan}# Listar todos los super admins${colors.reset}
node scripts/manage-super-admin.js list

${colors.cyan}# Otorgar super admin${colors.reset}
node scripts/manage-super-admin.js usuario@email.com enable

${colors.cyan}# Quitar super admin${colors.reset}
node scripts/manage-super-admin.js usuario@email.com disable

${colors.cyan}# Verificar permisos de un usuario${colors.reset}
node scripts/manage-super-admin.js usuario@email.com check

${colors.cyan}# Verificación completa del sistema${colors.reset}
node scripts/verify-super-admin.js
`);
}

async function main() {
    const [email, action] = process.argv.slice(2);

    if (!email) {
        showUsage();
        return;
    }

    log("bright", "🔧 GESTOR DE SUPER ADMIN");
    log("bright", `📅 ${new Date().toLocaleString("es-ES")}`);

    switch (action) {
        case "list":
            await listSuperAdmins();
            break;
        case "enable":
            await toggleSuperAdmin(email, true);
            break;
        case "disable":
            await toggleSuperAdmin(email, false);
            break;
        case "check":
            await verifyUserPermissions(email);
            break;
        default:
            if (email === "list") {
                await listSuperAdmins();
            } else {
                log("red", `❌ Acción no válida: ${action}`);
                showUsage();
            }
    }
}

if (require.main === module) {
    main().catch((error) => {
        log("red", `❌ Error fatal: ${error.message}`);
        process.exit(1);
    });
}
