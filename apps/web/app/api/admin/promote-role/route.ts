export const runtime = "nodejs"; // ¡importante! para no ejecutar en Edge

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Verificar que el usuario actual sea super admin
    const supabase = await supabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // Verificar que sea super admin
    const isSuper = !!(user.app_metadata as any)?.is_super_admin;
    if (!isSuper) {
      return NextResponse.json({ error: "not_super_admin" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, role } = body as { userId: string; role: "user" | "trainer" | "admin" };

    if (!userId || !["user", "trainer", "admin"].includes(role)) {
      return NextResponse.json({ error: "userId and valid role required" }, { status: 400 });
    }

    // Usar service role para operaciones admin
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Actualizar role en profiles
    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      userId, 
      role,
      message: `Usuario promocionado a ${role}`
    });

  } catch (error: any) {
    console.error("Error en promote-role:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
