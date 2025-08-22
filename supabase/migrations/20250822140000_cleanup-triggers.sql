-- =========================================
-- 🔹 LIMPIEZA DE TRIGGERS DUPLICADOS Y FIX DE FUNCIONES
-- =========================================
-- Fecha: 2025-08-22
-- Problema: Triggers duplicados causan constraint violations
-- Solución: Limpiar duplicados y arreglar search_path

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

-- 1) Elimina duplicados y el trigger "modtime"
DROP TRIGGER IF EXISTS trg_profiles_updated_at  ON public.profiles;
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;

-- 2) Asegura la función "update_updated_at_column"
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
-- 🔹 (Opcional) Fix de lint: función "update_modified_column"
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
