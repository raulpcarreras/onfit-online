import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            res.cookies.set(name, value, {
              ...options,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
          }
        },
      },
      db: { schema: "public" },
    }
  );

  // Invalida sesión en Supabase y fuerza Set-Cookie de limpieza
  await supabase.auth.signOut();

  return res;
}
