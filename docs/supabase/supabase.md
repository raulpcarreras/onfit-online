# Supabase — Estado actual y operación del proyecto

> Resumen operativo del estado de BD, seguridad y configuración en el repo.

## 1) Arquitectura actual
- Proyecto único (sin branches de pago, de momento).
- Schema de dominio: `onfit`.
- Auth: gestionado por Supabase (`auth` schema).
- Tabla de perfiles: `onfit.profiles` con RLS y roles (enum `onfit.user_role` → `user|trainer|admin`).
- Clientes (web/native) configurados para usar `onfit` por defecto.

## 2) Tablas y tipos
- `onfit.profiles`
  - `user_id uuid PK` (FK a `auth.users(id)`)
  - `email text`, `full_name text`, `avatar_url text`
  - `role onfit.user_role NOT NULL DEFAULT 'user'`
  - `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`
- `onfit.user_role` enum: `user`, `trainer`, `admin`

## 3) RLS y policies (onfit.profiles)
- RLS: activado
- Policies:
  - Read own: `auth.uid() = user_id`
  - Update own: `auth.uid() = user_id`
  - Insert own
  - Public view para `trainer|admin`

## 4) Repo: dónde está qué
- Web: `apps/web/src/lib/supabase.ts`
```ts
export const supabase = createClient(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { db: { schema: "onfit" } }
);
```
- Native: `apps/native/src/lib/supabase.ts`
```ts
export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  db: { schema: "onfit" },
});
```
- Logins con lectura de rol tras login:
  - Web: `apps/web/app/(auth)/login/page.tsx`
  - Native: `apps/native/features/auth/LoginScreen.tsx`

## 5) Variables de entorno
- Native (`apps/native/.env.development` / `.env.production`):
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - Build requiere `SENTRY_ORG`, `SENTRY_PROJECT` (ver `apps/native/app.config.ts`)
- Web (`apps/web/.env.local` y prod):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No usar `service_role` en cliente (solo backend/Edge).

## 6) Comandos
- Web: `pnpm --filter web dev`, `pnpm --filter web exec tsc --noEmit`
- Native: `pnpm native:start`, `pnpm native:start:go`, `pnpm --filter native exec tsc --noEmit`

## 7) Administración (SQL útiles)
- Promover admin por email:
```sql
update onfit.profiles
set role = 'admin'
where user_id = (select id from auth.users where email = 'correo@dominio');
```
- Ver rol:
```sql
select u.email, p.role
from auth.users u
left join onfit.profiles p on p.user_id = u.id
where u.email = 'correo@dominio';
```

## 8) MCP (automatización opcional)
- Config: `/.cursor/mcp.json`
  - Usa `SUPABASE_ACCESS_TOKEN` (PAT) y `--project-ref`.
  - Quitar `--read-only` para aplicar migraciones.
- Seguridad: no comitear secretos; rotar tokens.

## 9) Branches (futuro)
- Ahora: sin branches (coste). Recomendado a futuro: `develop` + `main`.
- Alternativa sin coste: Supabase Local (CLI) para validar SQL/RLS.

## 10) Troubleshooting
- Android Metro 8081: `adb reverse tcp:8081 tcp:8081` y `pnpm native:start`
- Next `allowedDevOrigins`: aviso; configurar cuando sea obligatorio
- Env no cargadas: revisar `.env` y reiniciar con caché limpia

## 11) Cambios aplicados recientemente
- Integración Supabase web/native (env + cliente `onfit`)
- Migración: creación `onfit.profiles`, enum roles, policies, triggers
- Limpieza: eliminado `public.profiles`

## 12) Próximos pasos
- `UserProvider` con `{ user, role }` y guards de ruta
- Panel admin visible solo para `admin`
- Seeds mínimos y, cuando haya presupuesto, activar branches
