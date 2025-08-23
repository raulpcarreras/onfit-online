Perfecto — vamos directos al grano con los códigos que te pide Cursor para cerrar el tema.

⸻

1) SQL — Limpieza de triggers duplicados + fix de función

Pega esto tal cual en el SQL editor de Supabase (idempotente: lo puedes ejecutar varias veces sin romper nada):

-- =========================================
-- 🔹 AUTH.USERS — Dejar un único trigger por evento
-- =========================================

-- 1) Elimina duplicados
DROP TRIGGER IF EXISTS trg_on_auth_user_created       ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_user_updated_email ON auth.users;

-- 2) Asegura los triggers canónicos (por si faltaran)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Crea/repone los triggers canónicos con nombres consistentes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass AND tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass AND tgname = 'on_auth_email_updated'
  ) THEN
    CREATE TRIGGER on_auth_email_updated
      AFTER UPDATE OF email ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();
  END IF;
END $$;


-- =========================================
-- 🔹 PUBLIC.PROFILES — Un solo trigger de updated_at
-- =========================================

-- 1) Elimina duplicados y el trigger “modtime”
DROP TRIGGER IF EXISTS trg_profiles_updated_at  ON public.profiles;
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;

-- 2) Asegura la función “update_updated_at_column”
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 3) Crea un único trigger claro
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =========================================
-- 🔹 (Opcional) Fix de lint: función “update_modified_column”
--    (si la usas en otros sitios, deja de dar warning)
-- =========================================
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_temp'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- =========================================
-- 🔎 Verificación rápida de qué quedó activo
-- =========================================
-- Triggers en auth.users
SELECT tgname
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass AND NOT tgisinternal
ORDER BY tgname;

-- Triggers en public.profiles
SELECT tgname
FROM pg_trigger
WHERE tgrelid = 'public.profiles'::regclass AND NOT tgisinternal
ORDER BY tgname;


⸻

2) API — Cambiar INSERT por UPDATE (con fallback seguro)

Sustituye la lógica de /api/admin/create-user después de auth.admin.createUser() por esta (TypeScript/Next.js Route Handler).
Idea: dejar que el trigger cree la fila en profiles y nosotros solo actualizamos; si por alguna razón la fila aún no existiera, hacemos un upsert puntual por id.

// apps/web/app/api/admin/create-user/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, full_name, role = "user", email_confirmed = true } = body;

    // 1) Admin client (Service Role) – fuera del bundle del cliente
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // 👈 clave de servicio (RLS bypass)
    );

    // 2) Crear usuario en auth
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: email_confirmed,
      user_metadata: { full_name },
    });
    if (createErr || !created.user) {
      return NextResponse.json({ ok: false, step: "createUser", error: createErr?.message }, { status: 400 });
    }
    const userId = created.user.id;

    // 3) Intentar UPDATE directo (la fila debería existir por trigger)
    const { data: updData, error: updErr, count } = await supabaseAdmin
      .from("profiles")
      .update({ full_name, role, email })
      .eq("id", userId)
      .select("*", { count: "exact", head: false });

    if (updErr) {
      // Si UPDATE falla por timing u otra razón, intentamos UPSERT por id (fallback puntual)
      const { error: upsertErr } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, email, full_name, role }, { onConflict: "id", ignoreDuplicates: false });

      if (upsertErr) {
        // Rollback del auth user si el perfil no queda consistente
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { ok: false, step: "profiles_upsert", error: upsertErr.message },
          { status: 500 }
        );
      }
    } else if (!count || count < 1) {
      // Muy raro, pero por seguridad: si UPDATE no afectó filas y no hubo error, intentamos UPSERT
      const { error: upsertErr2 } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, email, full_name, role }, { onConflict: "id", ignoreDuplicates: false });
      if (upsertErr2) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { ok: false, step: "profiles_upsert_empty", error: upsertErr2.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true, user_id: userId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}

Notas clave:
	•	Nunca hagas INSERT “a pelo” en profiles. El trigger ya inserta por ti.
	•	UPDATE primero; UPSERT solo si de verdad no hay fila (timing extremo).
	•	Con Service Role, RLS no bloquea (correcto para administración).

⸻

3) (Opcional) Crear con metadata para que el trigger rellene todo

Si quieres que la fila inicial de profiles ya lleve el nombre correcto desde el trigger, crea el usuario con el full_name en metadatos (ya incluido arriba):

await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name }, // 👈 el trigger lo usa
});


⸻

✅ Qué logras con esto
	•	Desaparece el error duplicate key value violates unique constraint "profiles_email_key".
	•	La base queda limpia y determinística (sin triggers duplicados).
	•	Tu endpoint de creación de usuarios se vuelve idempotente y robusto.

Si quieres, te paso los tests rápidos (SQL + curl) para validar que ya se crea el usuario + perfil sin colisiones.
