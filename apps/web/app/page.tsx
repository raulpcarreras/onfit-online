import { redirect } from "next/navigation";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No necesitamos setear cookies aquí
        },
      },
    }
  )

  // 1) Sesión del usuario (server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Sin sesión -> a login
    redirect("/login");
  }

  // 2) Traemos rol del perfil (usa **id** como clave primaria)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // 3) Redirigimos por rol
  if (profile?.role === "admin") redirect("/admin/dashboard");
  if (profile?.role === "trainer") redirect("/trainer");

  // por defecto usuario normal
  redirect("/user");
}
