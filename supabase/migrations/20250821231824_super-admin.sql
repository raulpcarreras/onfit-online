-- 1) Función para leer el flag desde el JWT (app_metadata.is_super_admin)
create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'is_super_admin')::boolean, false);
$$;

-- 2) RLS en public.profiles (PK = id -> auth.users.id)
alter table public.profiles enable row level security;

-- Limpia políticas duplicadas con el naming antiguo si existen
drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert self" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "profiles admin read all" on public.profiles;

-- Re-crea políticas mínimas con bypass de super_admin
create policy "profiles select own"
on public.profiles
for select
to authenticated, anon
using (auth.uid() = id or public.is_super_admin());

create policy "profiles insert self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id or public.is_super_admin());

create policy "profiles update own"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_super_admin())
with check (auth.uid() = id or public.is_super_admin());
