export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        // Verificar que el usuario actual sea super admin
        const supabase = await supabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
        }

        // Verificar que sea super admin O admin funcional
        const isSuper = !!(user.app_metadata as any)?.is_super_admin;

        // Si no es super admin, verificar si es admin funcional
        let isAdmin = false;
        if (!isSuper) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .maybeSingle();
            isAdmin = profile?.role === "admin";
        }

        if (!isSuper && !isAdmin) {
            return NextResponse.json(
                {
                    error: "insufficient_permissions",
                    message:
                        "Se requieren permisos de super admin o role de admin funcional",
                },
                { status: 403 },
            );
        }

        // Usar service role para obtener usuarios
        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // Obtener profiles
        const { data: profiles, error: profilesError } = await adminSupabase
            .from("profiles")
            .select("id, full_name, email, role, created_at")
            .order("created_at", { ascending: false });

        if (profilesError) {
            return NextResponse.json({ error: profilesError.message }, { status: 500 });
        }

        // Obtener usuarios auth con app_metadata
        const { data: authUsers, error: authError } =
            await adminSupabase.auth.admin.listUsers();
        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }

        // Mapear profiles con información de super admin
        const usersWithSuperAdmin = profiles.map((profile) => {
            const authUser = authUsers.users.find((au) => au.id === profile.id);
            return {
                ...profile,
                is_super_admin: authUser?.app_metadata?.is_super_admin === true,
                created: profile.created_at,
            };
        });

        return NextResponse.json({ users: usersWithSuperAdmin });
    } catch (error: any) {
        console.error("Error en /api/admin/users:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
