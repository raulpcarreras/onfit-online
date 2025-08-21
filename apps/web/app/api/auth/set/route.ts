import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      console.log("❌ /api/auth/set - Tokens faltantes");
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

    console.log("🔑 /api/auth/set - Tokens recibidos, creando cliente Supabase");

    // Respuesta que usaremos para inyectar las Set-Cookie
    const res = NextResponse.json({ ok: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookies) => {
            console.log(`🍪 /api/auth/set - Estableciendo ${cookies.length} cookies`);
            for (const { name, value, options } of cookies) {
              console.log(`🍪 /api/auth/set - Cookie: ${name} = ${value.substring(0, 20)}...`);
              // Asegurar atributos válidos en dev/producción
              res.cookies.set(name, value, {
                ...options,
                path: "/",
                // En dev (http) NO usar Secure, en prod SÍ:
                secure: process.env.NODE_ENV === "production",
                // SameSite Lax funciona perfect para same-origin
                sameSite: "lax",
              });
            }
          },
        },
        db: { schema: "public" },
      }
    );

    console.log("🔄 /api/auth/set - Llamando a setSession");
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.log(`❌ /api/auth/set - Error en setSession: ${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Forzar establecimiento de ambas cookies manualmente
    console.log("🍪 /api/auth/set - Forzando establecimiento de cookies manualmente");
    
    // Cookie auth-token
    res.cookies.set(`sb-niwdiousdcowvgqpzobj-auth-token`, access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    
    // Cookie refresh-token
    res.cookies.set(`sb-niwdiousdcowvgqpzobj-refresh-token`, refresh_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    console.log("✅ /api/auth/set - Sesión establecida correctamente con cookies manuales");
    return res;
  } catch (e: any) {
    console.log(`💥 /api/auth/set - Error general: ${e?.message}`);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
