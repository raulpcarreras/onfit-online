import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Proteger solo rutas privadas
  if (!path.startsWith("/admin") && !path.startsWith("/trainer") && !path.startsWith("/user")) {
    return NextResponse.next();
  }

  console.log(`🔒 Middleware - Protegiendo ruta: ${path}`);
  
  const all = req.cookies.getAll();
  console.log(`🍪 Middleware - Total cookies: ${all.length}`);
  
  // Log todas las cookies para debug
  all.forEach(cookie => {
    console.log(`🍪 Cookie: ${cookie.name} = ${cookie.value.substring(0, 20)}...`);
  });

  // Buscar cookies de Supabase
  const supabaseCookies = all.filter(c => c.name.startsWith("sb-"));
  console.log(`🔑 Middleware - Cookies Supabase encontradas: ${supabaseCookies.length}`);
  
  supabaseCookies.forEach(cookie => {
    console.log(`🔑 Supabase cookie: ${cookie.name}`);
  });

  // Verificar si existen las cookies necesarias
  const hasAuth = all.some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
  const hasRefresh = all.some((c) => c.name.startsWith("sb-") && c.name.endsWith("-refresh-token"));
  
  console.log(`🔑 Middleware - Has auth token: ${hasAuth}`);
  console.log(`🔑 Middleware - Has refresh token: ${hasRefresh}`);

  if (!(hasAuth && hasRefresh)) {
    console.log(`❌ Middleware - Cookies faltantes, redirigiendo a login`);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  console.log(`✅ Middleware - Cookies válidas, permitiendo acceso`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/trainer/:path*",
    "/user/:path*",
  ],
};
