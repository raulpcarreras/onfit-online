export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        // Verificar que el usuario actual sea super admin
        const supabase = await supabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
        }

        const isSuper = !!(user.app_metadata as any)?.is_super_admin;
        if (!isSuper) {
            return NextResponse.json({ error: "not_super_admin" }, { status: 403 });
        }

        const body = await req.json().catch(() => ({}));
        const { email, enable } = body as { email: string; enable: boolean };

        if (!email) {
            return NextResponse.json({ error: "email required" }, { status: 400 });
        }

        // Usar service role para operaciones admin
        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // Buscar usuario por email
        const { data: list, error: listErr } = await adminSupabase.auth.admin.listUsers({
            page: 1,
            perPage: 200,
        });
        if (listErr)
            return NextResponse.json({ error: listErr.message }, { status: 500 });

        const found = list.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
        );
        if (!found)
            return NextResponse.json({ error: "user_not_found" }, { status: 404 });

        // Actualizar role en profiles
        const newRole = enable ? "admin" : "user";
        const { error: updateError } = await adminSupabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", found.id);

        if (updateError)
            return NextResponse.json({ error: updateError.message }, { status: 500 });

        // Si se quita admin, también quitar super admin
        if (!enable) {
            await adminSupabase.auth.admin.updateUserById(found.id, {
                app_metadata: { is_super_admin: false },
            });
        }

        return NextResponse.json({
            ok: true,
            userId: found.id,
            role: newRole,
            message: enable ? "Usuario promocionado a admin" : "Usuario degradado a user",
        });
    } catch (error: any) {
        console.error("Error en promote-admin:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
