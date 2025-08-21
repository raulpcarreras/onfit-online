import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr'

// Forzar Node.js runtime para evitar warnings de Edge
export const runtime = 'nodejs';

export async function POST(_request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: Array<{ name: string; value: string; options?: any }>) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
        db: { schema: "public" },
      }
    );

    // Revoca/limpia en Supabase (servidor)
    await supabase.auth.signOut({ scope: "global" });

    // Asegura limpieza de cookies sb-* (defensa en profundidad)
    cookieStore
      .getAll()
      .filter((c) => c.name.startsWith("sb-"))
      .forEach((c) => cookieStore.set(c.name, "", { maxAge: 0, path: "/" }));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
