import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr'

// Forzar Node.js runtime para evitar warnings de Edge
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json().catch(() => ({} as any));

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { ok: false, error: "Missing tokens" },
        { status: 400 }
      );
    }

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

    // Establece la sesión en el lado servidor (emite Set-Cookie)
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    }

    // (Opcional) Devolver user para debug/UX
    const { data: { user } } = await supabase.auth.getUser();

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
