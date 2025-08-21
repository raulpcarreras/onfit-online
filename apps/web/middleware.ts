import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'

// ⚠️ Protegemos SOLO rutas privadas. No incluyas /login, /register, estáticos, etc.
export const config = {
  matcher: ["/admin/:path*", "/trainer/:path*", "/user/:path*"],
};

export async function middleware(req: NextRequest) {
  console.log(`🔒 Middleware: ${req.nextUrl.pathname}`);
  
  // Creamos una respuesta base para poder setear cookies si Supabase las renueva
  const res = NextResponse.next({ request: { headers: req.headers } });

  // Debug: ver todas las cookies
  const allCookies = req.cookies.getAll();
  console.log(`🍪 Cookies encontradas:`, allCookies.map(c => c.name));

  // Client SSR para **Edge** usando cookies del request y seteándolas en la response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          req.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
        setAll: (cookies: Array<{ name: string; value: string; options?: any }>) => {
          for (const { name, value, options } of cookies) {
            // NextResponse se ocupa de setear Set-Cookie
            res.cookies.set({ name, value, ...options });
          }
        },
      },
    }
  );

  // 1) Si hay refresh-token pero no access-token, getUser intentará **renovar** sesión
  console.log(`🔍 Verificando sesión con Supabase...`);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(`❌ Error en getUser:`, error.message);
  } else if (data?.user) {
    console.log(`✅ Usuario autenticado:`, data.user.email);
  } else {
    console.log(`❌ No hay usuario`);
  }

  // 2) Si **no** hay usuario tras el intento (o hubo error), redirigimos a login
  if (error || !data?.user) {
    console.log(`🔄 Redirigiendo a login desde: ${req.nextUrl.pathname}`);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 3) Hay sesión => dejamos pasar (y devolvemos las cookies que setee Supabase)
  console.log(`✅ Sesión válida, continuando...`);
  return res;
}
