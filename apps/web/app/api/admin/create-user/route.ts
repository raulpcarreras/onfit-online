export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        // Tipo para los matches de email
        type Match = { id: string; email: string; full_name?: string | null };

        console.log("🔍 [CREATE-USER] Iniciando creación de usuario...");

        // Verificar que el usuario actual sea super admin
        const supabase = await supabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.log("❌ [CREATE-USER] Usuario no autenticado");
            return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
        }

        const isSuper = !!(user.app_metadata as any)?.is_super_admin;
        if (!isSuper) {
            console.log("❌ [CREATE-USER] Usuario no es super admin");
            return NextResponse.json({ error: "not_super_admin" }, { status: 403 });
        }

        console.log("✅ [CREATE-USER] Usuario autenticado y autorizado");

        const body = await req.json().catch(() => ({}));
        console.log("📦 [CREATE-USER] Body recibido:", JSON.stringify(body, null, 2));

        const { full_name, email, password, role, is_super_admin, email_confirmed } =
            body as {
                full_name: string;
                email: string;
                password: string;
                role: "user" | "trainer" | "admin";
                is_super_admin: boolean;
                email_confirmed: boolean;
            };

        console.log("🔍 [CREATE-USER] Datos extraídos:", {
            full_name,
            email,
            role,
            is_super_admin,
            email_confirmed,
        });

        // Validaciones
        if (!full_name?.trim()) {
            return NextResponse.json({ error: "full_name_required" }, { status: 400 });
        }
        if (!email?.trim()) {
            return NextResponse.json({ error: "email_required" }, { status: 400 });
        }
        if (!email.includes("@")) {
            return NextResponse.json({ error: "invalid_email" }, { status: 400 });
        }
        if (!["user", "trainer", "admin"].includes(role)) {
            return NextResponse.json({ error: "invalid_role" }, { status: 400 });
        }
        if (!password?.trim()) {
            return NextResponse.json({ error: "password_required" }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: "password_too_short" }, { status: 400 });
        }

        // Usar service role para operaciones admin
        console.log("🔗 [CREATE-USER] Conectando a Supabase con service role...");
        console.log(
            "🔗 [CREATE-USER] URL:",
            process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurada" : "❌ Faltante",
        );
        console.log(
            "🔗 [CREATE-USER] Service Role Key:",
            process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Configurada" : "❌ Faltante",
        );

        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        console.log("✅ [CREATE-USER] Cliente Supabase creado");

        // Verificar si el email ya existe en auth.users
        console.log("🔍 [CREATE-USER] Verificando email en auth.users...");
        const { data: existingUsers, error: listError } =
            await adminSupabase.auth.admin.listUsers({
                page: 1,
                perPage: 1000,
            });

        if (listError) {
            console.log(
                "❌ [CREATE-USER] Error listando usuarios auth:",
                listError.message,
            );
            return NextResponse.json({ error: listError.message }, { status: 500 });
        }

        console.log(
            "✅ [CREATE-USER] Usuarios auth listados:",
            existingUsers.users.length,
        );

        const emailExistsInAuth = existingUsers.users.some(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
        );

        if (emailExistsInAuth) {
            return NextResponse.json({ error: "email_already_exists" }, { status: 409 });
        }

        // Verificar si el email ya existe en profiles (VERIFICACIÓN AGRESIVA)
        console.log(
            "🔍 [CREATE-USER] Verificando email en profiles (VERIFICACIÓN AGRESIVA)...",
        );

        // Método 1: Verificación exacta
        const { data: exactMatch, error: exactError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name")
            .eq("email", email);

        if (exactError) {
            console.log(
                "❌ [CREATE-USER] Error verificando email exacto:",
                exactError.message,
            );
            return NextResponse.json({ error: exactError.message }, { status: 500 });
        }

        // Método 2: Verificación con ILIKE (case insensitive)
        const { data: ilikeMatch, error: ilikeError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name")
            .ilike("email", email);

        if (ilikeError) {
            console.log(
                "❌ [CREATE-USER] Error verificando con ILIKE:",
                ilikeError.message,
            );
            return NextResponse.json({ error: ilikeError.message }, { status: 500 });
        }

        // Método 3: Verificación con LIKE (case sensitive pero más amplia)
        const { data: likeMatch, error: likeError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name")
            .like("email", `%${email}%`);

        if (likeError) {
            console.log(
                "❌ [CREATE-USER] Error verificando con LIKE:",
                likeError.message,
            );
            return NextResponse.json({ error: likeError.message }, { status: 500 });
        }

        // Método 4: Verificación con texto (buscar en cualquier parte)
        const { data: textMatch, error: textError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name")
            .textSearch("email", email);

        if (textError) {
            console.log("ℹ️ [CREATE-USER] TextSearch no disponible, continuando...");
        }

        // Método 5: Listar TODOS los perfiles y buscar manualmente
        console.log("🔍 [CREATE-USER] Verificación manual de todos los perfiles...");
        const { data: allProfiles, error: allError } = await adminSupabase
            .from("profiles")
            .select("id, email, full_name");

        if (allError) {
            console.log(
                "❌ [CREATE-USER] Error listando todos los perfiles:",
                allError.message,
            );
            return NextResponse.json({ error: allError.message }, { status: 500 });
        }

        // Buscar manualmente con diferentes criterios
        const manualMatches = allProfiles.filter((profile) => {
            const profileEmail = profile.email || "";
            const searchEmail = email || "";

            return (
                profileEmail === searchEmail ||
                profileEmail.toLowerCase() === searchEmail.toLowerCase() ||
                profileEmail.includes(searchEmail) ||
                searchEmail.includes(profileEmail) ||
                profileEmail.replace(/[^a-zA-Z0-9@.-]/g, "") ===
                    searchEmail.replace(/[^a-zA-Z0-9@.-]/g, "")
            );
        });

        // Consolidar todos los resultados
        const allMatches: Match[] = [
            ...(exactMatch || []),
            ...(ilikeMatch || []),
            ...(likeMatch || []),
            ...(textMatch || []),
            ...manualMatches,
        ];

        // Eliminar duplicados por ID
        const uniqueMatches: Match[] = allMatches.filter(
            (match, index, self) => index === self.findIndex((m) => m.id === match.id),
        );

        console.log("🔍 [CREATE-USER] Verificaciones realizadas:");
        console.log("  - Email exacto:", exactMatch?.length || 0, "coincidencias");
        console.log("  - ILIKE:", ilikeMatch?.length || 0, "coincidencias");
        console.log("  - LIKE:", likeMatch?.length || 0, "coincidencias");
        console.log("  - TextSearch:", textMatch?.length || 0, "coincidencias");
        console.log("  - Manual:", manualMatches.length, "coincidencias");
        console.log("  - Total únicos:", uniqueMatches.length);
        console.log("  - Todos los perfiles:", allProfiles.length);

        if (uniqueMatches.length > 0) {
            console.log("❌ [CREATE-USER] Email ya existe en profiles:", uniqueMatches);
            console.log("🔍 [CREATE-USER] Detalles de coincidencias:");
            uniqueMatches.forEach((match, index) => {
                console.log(
                    `    ${index + 1}. ID: ${match.id}, Email: "${match.email}", Nombre: ${match.full_name ?? "(sin nombre)"}`,
                );
            });
            return NextResponse.json(
                { error: "email_already_exists_in_profiles" },
                { status: 409 },
            );
        }

        console.log(
            "✅ [CREATE-USER] Email no existe en profiles (verificación agresiva completada)",
        );

        // Crear usuario en auth.users con el password del formulario y metadata
        console.log("👤 [CREATE-USER] Creando usuario en auth.users...");
        const { data: newUser, error: createError } =
            await adminSupabase.auth.admin.createUser({
                email,
                password: password,
                email_confirm: email_confirmed, // Usar el valor del checkbox
                app_metadata: { is_super_admin },
                user_metadata: { full_name }, // Pasar full_name para que el trigger lo use
            });

        if (createError) {
            console.log(
                "❌ [CREATE-USER] Error creando usuario auth:",
                createError.message,
            );
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        if (!newUser.user) {
            console.log("❌ [CREATE-USER] Usuario auth creado pero sin datos");
            return NextResponse.json({ error: "user_creation_failed" }, { status: 500 });
        }

        console.log("✅ [CREATE-USER] Usuario auth creado:", newUser.user.id);

        // El trigger handle_new_user() ya creó el perfil automáticamente
        console.log(
            "✅ [CREATE-USER] Trigger handle_new_user() creó el perfil automáticamente",
        );

        // Ahora actualizamos el perfil con los datos adicionales (role, etc.)
        console.log("📝 [CREATE-USER] Actualizando perfil con datos adicionales...");
        const {
            data: updateData,
            error: updateError,
            count,
        } = await adminSupabase
            .from("profiles")
            .update({
                full_name,
                role,
                email,
                created_at: new Date().toISOString(),
            })
            .eq("id", newUser.user.id)
            .select("*");

        if (updateError) {
            console.log(
                "❌ [CREATE-USER] Error actualizando perfil:",
                updateError.message,
            );
            // Si falla la actualización, intentamos UPSERT como fallback
            console.log("🔄 [CREATE-USER] Intentando UPSERT como fallback...");
            const { error: upsertError } = await adminSupabase.from("profiles").upsert(
                {
                    id: newUser.user.id,
                    email,
                    full_name,
                    role,
                    created_at: new Date().toISOString(),
                },
                { onConflict: "id", ignoreDuplicates: false },
            );

            if (upsertError) {
                console.log(
                    "❌ [CREATE-USER] Error en UPSERT fallback:",
                    upsertError.message,
                );
                // Si falla el UPSERT, eliminar el usuario de auth
                console.log("🗑️ [CREATE-USER] Eliminando usuario auth fallido...");
                await adminSupabase.auth.admin.deleteUser(newUser.user.id);
                return NextResponse.json({ error: upsertError.message }, { status: 500 });
            }
            console.log("✅ [CREATE-USER] Perfil creado con UPSERT fallback");
        } else if (!count || count < 1) {
            // Muy raro, pero por seguridad: si UPDATE no afectó filas, intentamos UPSERT
            console.log("⚠️ [CREATE-USER] UPDATE no afectó filas, intentando UPSERT...");
            const { error: upsertError2 } = await adminSupabase.from("profiles").upsert(
                {
                    id: newUser.user.id,
                    email,
                    full_name,
                    role,
                    created_at: new Date().toISOString(),
                },
                { onConflict: "id", ignoreDuplicates: false },
            );

            if (upsertError2) {
                console.log(
                    "❌ [CREATE-USER] Error en UPSERT de seguridad:",
                    upsertError2.message,
                );
                await adminSupabase.auth.admin.deleteUser(newUser.user.id);
                return NextResponse.json(
                    { error: upsertError2.message },
                    { status: 500 },
                );
            }
            console.log("✅ [CREATE-USER] Perfil creado con UPSERT de seguridad");
        } else {
            console.log("✅ [CREATE-USER] Perfil actualizado exitosamente");
        }

        // Usuario creado exitosamente
        console.log("🎉 [CREATE-USER] Usuario creado completamente exitoso");
        return NextResponse.json({
            ok: true,
            user: {
                id: newUser.user.id,
                email: newUser.user.email,
                full_name,
                role,
                is_super_admin,
                email_confirmed: email_confirmed,
            },
            message: "Usuario creado exitosamente",
        });
    } catch (error: any) {
        console.error("💥 [CREATE-USER] Error general:", error);
        console.error("💥 [CREATE-USER] Stack:", error.stack);
        return NextResponse.json(
            {
                error: error.message || "Internal server error",
            },
            { status: 500 },
        );
    }
}
