export const runtime = "nodejs"; // ¡importante! para no ejecutar en Edge

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

        // Verificar que sea super admin
        const isSuper = !!(user.app_metadata as any)?.is_super_admin;
        if (!isSuper) {
            return NextResponse.json({ error: "not_super_admin" }, { status: 403 });
        }

        const body = await req.json().catch(() => ({}));
        const { userId, email, enable } = body as {
            userId?: string;
            email?: string;
            enable?: boolean;
        };

        if (!userId && !email) {
            return NextResponse.json(
                { error: "userId or email required" },
                { status: 400 },
            );
        }

        // Usar service role para operaciones admin
        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // 1) Resuelve el userId si llega por email
        let targetUserId = userId;
        if (!targetUserId && email) {
            const { data: list, error: listErr } =
                await adminSupabase.auth.admin.listUsers({ page: 1, perPage: 200 });
            if (listErr)
                return NextResponse.json({ error: listErr.message }, { status: 500 });
            const found = list.users.find(
                (u) => u.email?.toLowerCase() === email.toLowerCase(),
            );
            if (!found)
                return NextResponse.json({ error: "user_not_found" }, { status: 404 });
            targetUserId = found.id;
        }

        // 2) Cualquier usuario puede ser super admin (flexibilidad total)
        // No hay restricciones de role para super admin

        // 3) Actualiza app_metadata.is_super_admin
        const { data: updated, error: upErr } =
            await adminSupabase.auth.admin.updateUserById(targetUserId!, {
                app_metadata: { is_super_admin: !!enable },
            });

        if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

        return NextResponse.json({
            ok: true,
            userId: targetUserId,
            is_super_admin: !!enable,
        });
    } catch (error: any) {
        console.error("Error en grant-super:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
