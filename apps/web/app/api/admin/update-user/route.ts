export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function PUT(req: Request) {
  try {
    // Verificar que el usuario actual sea super admin
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const isSuper = !!(user.app_metadata as any)?.is_super_admin;
    if (!isSuper) {
      return NextResponse.json({ error: "not_super_admin" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, full_name, role, is_super_admin } = body as {
      userId: string;
      full_name: string;
      role: "user" | "trainer" | "admin";
      is_super_admin: boolean;
    };

    // Validaciones
    if (!userId) {
      return NextResponse.json({ error: "userId_required" }, { status: 400 });
    }
    if (!full_name?.trim()) {
      return NextResponse.json({ error: "full_name_required" }, { status: 400 });
    }
    if (!["user", "trainer", "admin"].includes(role)) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    // Usar service role para operaciones admin
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar que el usuario existe
    const { data: existingUser, error: userError } = await adminSupabase.auth.admin.getUserById(userId);
    if (userError || !existingUser.user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    // Prevenir auto-eliminación de super admin
    if (userId === user.id && !is_super_admin) {
      return NextResponse.json({ 
        error: "cannot_remove_own_super_admin" 
      }, { status: 400 });
    }

    // Actualizar app_metadata.is_super_admin en auth.users
    const { error: authUpdateError } = await adminSupabase.auth.admin.updateUserById(userId, {
      app_metadata: { is_super_admin },
    });

    if (authUpdateError) {
      return NextResponse.json({ error: authUpdateError.message }, { status: 500 });
    }

    // Actualizar perfil en public.profiles
    const { error: profileUpdateError } = await adminSupabase
      .from("profiles")
      .update({
        full_name,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileUpdateError) {
      return NextResponse.json({ error: profileUpdateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: userId,
        full_name,
        role,
        is_super_admin,
      },
      message: "Usuario actualizado exitosamente"
    });

  } catch (error: any) {
    console.error("Error en update-user:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}
