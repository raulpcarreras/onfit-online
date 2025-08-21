import { NextRequest, NextResponse } from "next/server";

// ⚠️ Protegemos SOLO rutas privadas. No incluyas /login, /register, estáticos, etc.
export const config = {
  matcher: ["/admin/:path*", "/trainer/:path*", "/user/:path*"],
};

export async function middleware(req: NextRequest) {
  console.log(`🔒 Middleware: ${req.nextUrl.pathname}`);
  
  // Debug: ver todas las cookies
  const allCookies = req.cookies.getAll();
  console.log(`🍪 Cookies encontradas:`, allCookies.map(c => c.name));

  // Verificación mínima: solo comprobar presencia de cookies de Supabase
  const hasAuthToken = allCookies.some(c => 
    c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );
  const hasRefreshToken = allCookies.some(c => 
    c.name.startsWith("sb-") && c.name.endsWith("-refresh-token")
  );

  // Si faltan las cookies esenciales, redirigir a login
  if (!hasAuthToken || !hasRefreshToken) {
    console.log(`🔄 Cookies insuficientes, redirigiendo a login desde: ${req.nextUrl.pathname}`);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Hay cookies válidas => dejar pasar
  console.log(`✅ Cookies válidas, continuando...`);
  return NextResponse.next();
}
