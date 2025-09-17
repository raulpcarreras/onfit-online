#!/usr/bin/env node

/**
 * Monitor de actividad del sistema de administración
 * Monitorea cambios en tiempo real
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
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
};

function log(color, message) {
    const timestamp = new Date().toLocaleTimeString("es-ES");
    console.log(
        `${colors.cyan}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`,
    );
}

function logActivity(type, details) {
    const icons = {
        user_created: "👤",
        user_updated: "✏️",
        role_changed: "🔄",
        super_admin_granted: "👑",
        super_admin_revoked: "🔽",
        login: "🔑",
        logout: "🚪",
    };

    log("green", `${icons[type] || "📝"} ${type.toUpperCase()}: ${details}`);
}

async function monitorProfiles() {
    log("blue", "👀 Monitoreando cambios en profiles...");

    const channel = supabase
        .channel("profiles-changes")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "profiles",
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case "INSERT":
                        logActivity(
                            "user_created",
                            `${newRecord.email} (${newRecord.role})`,
                        );
                        break;
                    case "UPDATE":
                        if (oldRecord.role !== newRecord.role) {
                            logActivity(
                                "role_changed",
                                `${newRecord.email}: ${oldRecord.role} → ${newRecord.role}`,
                            );
                        } else {
                            logActivity("user_updated", `${newRecord.email}`);
                        }
                        break;
                    case "DELETE":
                        logActivity("user_deleted", `${oldRecord.email}`);
                        break;
                }
            },
        )
        .subscribe();

    return channel;
}

async function showCurrentStats() {
    try {
        // Estadísticas actuales
        const { data: profiles } = await supabase
            .from("profiles")
            .select("role, created_at");

        const stats = {
            totalUsers: profiles?.length || 0,
            superAdmins: profiles?.filter((p) => p.role === "admin").length || 0, // Simplificado: admin = super admin
            admins: profiles?.filter((p) => p.role === "admin").length || 0,
            trainers: profiles?.filter((p) => p.role === "trainer").length || 0,
            users: profiles?.filter((p) => p.role === "user").length || 0,
        };

        console.log("\n" + "=".repeat(50));
        log("cyan", "📊 ESTADÍSTICAS ACTUALES");
        console.log("=".repeat(50));
        log("bright", `👥 Total usuarios: ${stats.totalUsers}`);
        log("magenta", `👑 Super Admins: ${stats.superAdmins}`);
        log("yellow", `🛡️  Admins: ${stats.admins}`);
        log("blue", `🏋️  Trainers: ${stats.trainers}`);
        log("green", `👤 Usuarios: ${stats.users}`);
        console.log("=".repeat(50));
    } catch (error) {
        log("red", `❌ Error obteniendo estadísticas: ${error.message}`);
    }
}

async function main() {
    log("bright", "🔍 MONITOR DE ACTIVIDAD SUPER ADMIN");
    log("cyan", "Presiona Ctrl+C para salir");

    await showCurrentStats();

    log("blue", "🚀 Iniciando monitoreo en tiempo real...");

    // Monitorear cambios en profiles
    await monitorProfiles();

    // Mostrar estadísticas cada 30 segundos
    setInterval(async () => {
        await showCurrentStats();
    }, 30000);

    // Mantener el proceso vivo
    process.on("SIGINT", () => {
        log("yellow", "👋 Cerrando monitor...");
        process.exit(0);
    });
}

if (require.main === module) {
    main().catch((error) => {
        log("red", `❌ Error fatal: ${error.message}`);
        process.exit(1);
    });
}
