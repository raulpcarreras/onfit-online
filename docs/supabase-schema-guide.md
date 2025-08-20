# Onfit — Guía de datos y configuración (Supabase)

> **Objetivo**: Documentar nombres, tablas, enums, funciones, buckets y **RLS** para que el front (web y apps nativas) pueda usar **los mismos nombres** sin sorpresas. Todo vive en el **schema `onfit`** salvo donde se indique (auth/storage).

---

## 1) Convenciones y nombres (canónicos)

- **Schema app**: `onfit`
- **Auth** (Supabase): `auth`
- **Storage** (Supabase): `storage`
- **Formato nombres**: `snake_case`
- **Claves**: `*_id` (UUID cuando sea identidad de usuario)
- **Fechas**: `created_at`, `updated_at` (`timestamptz`, `DEFAULT now()`)
- **Roles app** (enum): `onfit.user_role` con **`user` | `trainer` | `admin`**
- **Bucket de avatares**: `avatars`
- **Vista pública de perfiles**: `onfit.public_profiles` (sólo campos no sensibles)

---

## 2) Enums

### `onfit.user_role`
Valores: `user`, `trainer`, `admin`

> **Nota**: Si no existe aún, crear con:
```sql
create type onfit.user_role as enum ('user', 'trainer', 'admin');
```

---

## 3) Funciones utilitarias

### 3.1 `onfit.update_modified_column()`
Actualiza `updated_at` automáticamente en `UPDATE`.

```sql
create or replace function onfit.update_modified_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

### 3.2 `onfit.handle_new_user()`
Inserta un row en `onfit.profiles` cuando se crea un usuario en `auth.users`.

```sql
create or replace function onfit.handle_new_user()
returns trigger language plpgsql security definer set search_path = public onfit as $$
declare
  v_email text;
  v_name  text;
begin
  -- Datos de auth.users
  select email, raw_user_meta_data->>'full_name'
    into v_email, v_name
  from auth.users
  where id = new.id;

  insert into onfit.profiles (user_id, email, full_name, role)
  values (new.id, v_email, coalesce(v_name, ''), 'user'::onfit.user_role)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Trigger en auth.users
drop trigger if exists onfit_handle_new_user on auth.users;
create trigger onfit_handle_new_user
after insert on auth.users
for each row execute procedure onfit.handle_new_user();
```

> **Por qué**: Evita inserts manuales en `profiles` desde el front. El alta en Supabase Auth crea **siempre** un perfil base.

---

## 4) Tablas

### 4.1 `onfit.profiles` (ya creada)
**Propósito**: Perfil base del usuario (app-level).

```sql
-- Ya la tienes (referencia de columnas canónicas)
-- user_id (uuid, pk, fk -> auth.users.id)
-- email (text, unique)
-- full_name (text)
-- role (onfit.user_role, default 'user')
-- avatar_url (text)
-- created_at (timestamptz default now())
-- updated_at (timestamptz default now())

-- Trigger de updated_at (si no existe)
drop trigger if exists update_profiles_modtime on onfit.profiles;
create trigger update_profiles_modtime
before update on onfit.profiles
for each row execute function onfit.update_modified_column();
```

**Índices recomendados**:
```sql
create index if not exists profiles_email_idx on onfit.profiles (email);
create index if not exists profiles_role_idx  on onfit.profiles (role);
```

> **Nota**: El `email` **no es** fuente de verdad (puede cambiar); `user_id` **sí** lo es.

---

## 5) Vistas

### 5.1 `onfit.public_profiles`
**Propósito**: Exponer **sólo campos no sensibles** a clientes autenticados (y opcionalmente no autenticados).

```sql
create or replace view onfit.public_profiles as
select
  user_id,
  full_name,
  avatar_url,
  role,
  created_at
from onfit.profiles;
```

> **Front**: Usa esta vista para listados públicos (no incluye `email`).

---

## 6) Row Level Security (RLS)

> **Regla de oro**: RLS **siempre ON** y lo más restrictiva posible. Añade políticas explícitas.

### 6.1 `onfit.profiles`

```sql
alter table onfit.profiles enable row level security;

-- 1) Leer tu propio perfil
create policy "profiles.read.self"
on onfit.profiles for select
using (auth.uid() = user_id);

-- 2) Leer todos si eres admin
create policy "profiles.read.admin"
on onfit.profiles for select
using (
  exists (
    select 1 from onfit.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- 3) Actualizar tu propio perfil
create policy "profiles.update.self"
on onfit.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4) Admin puede actualizar a cualquiera
create policy "profiles.update.admin"
on onfit.profiles for update
using (
  exists (
    select 1 from onfit.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (true);

-- 5) Insert: lo gestiona el trigger de auth.users (no permitir insert manual)
revoke insert on onfit.profiles from anon, authenticated;
```

### 6.2 `onfit.public_profiles` (view)

**Opción A (recomendada)**: Permitir `SELECT` a todos los autenticados
```sql
grant select on onfit.public_profiles to authenticated;
```

**Opción B**: Hacerla pública
```sql
grant select on onfit.public_profiles to anon;
```

> Las vistas no tienen RLS; heredan permisos. Controla datos sensibles en la **proyección** de la vista.

---

## 7) Storage (Avatares)

**Bucket**: `avatars`  
**Estructura path**: `user_id/*` (carpeta por usuario)

> **Crea el bucket desde el panel** (evitas problemas de ownership/firmas de función).  
> Ajustes: _Public_: **no** (privado).

**Políticas** (Storage → Policies → `buckets: avatars`):

```sql
-- Leer: cualquier autenticado puede leer (o hazlo público si prefieres)
create policy "avatars.read.authenticated"
on storage.objects for select
using (
  bucket_id = 'avatars'
);

-- Subir/actualizar: sólo el dueño en su carpeta
create policy "avatars.write.own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars.update.own"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Borrar: dueño o admin
create policy "avatars.delete.own-or-admin"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1 from onfit.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  )
);
```

> **Frontend**: Sube a `avatars/${user.id}/avatar.png`. Guarda la URL pública/firmada en `onfit.profiles.avatar_url`.

---

## 8) Variables de entorno (Front)

Usar **exactamente** estos nombres en ambos clientes:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

- **Web** (`apps/web/.env.local`):  
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (si usas el helper de Supabase para Next.js)
- **Native** (`apps/native/.env.development`):  
  `SUPABASE_URL`, `SUPABASE_ANON_KEY`

> Front crea cliente en: `packages/core/supabase/client.ts` (recomendado) y reúsalo en Web/Native.

---

## 9) Mapeo UI → DB (nombres estables)

- **Usuario actual**: `onfit.profiles` (clave: `user_id`)
- **Nombre**: `full_name`
- **Avatar**: `avatar_url` (`storage` → bucket `avatars`)
- **Rol**: `role` (`user` | `trainer` | `admin`)
- **Listados públicos**: `onfit.public_profiles`
- **Edición perfil**: `update onfit.profiles where user_id = auth.uid()`

---

## 10) Checklist de puesta en marcha

1. [ ] `onfit.user_role` (enum) creado
2. [ ] `onfit.update_modified_column()` creada
3. [ ] `onfit.profiles` creada (o migrada al formato canónico)
4. [ ] Trigger `onfit_handle_new_user` en `auth.users` creado
5. [ ] `onfit.public_profiles` creada
6. [ ] RLS habilitadas y **políticas** aplicadas
7. [ ] Bucket `avatars` creado en el panel (privado)
8. [ ] Policies de `avatars` creadas
9. [ ] `.env` con `SUPABASE_URL` y `SUPABASE_ANON_KEY`
10. [ ] Cliente Supabase centralizado en `packages/core/supabase/client.ts`

---

## 11) Notas operativas

- **Admin bootstrap**: Promociona un usuario a admin con:
  ```sql
  update onfit.profiles
  set role = 'admin'
  where email = 'tu-admin@onfit.online';
  ```
- **Email en `profiles`**: Es **cache** de `auth.users.email` para acceso rápido. En flujos de cambio de email, sincroniza o lee siempre de `auth.users` cuando necesites máxima verdad.
- **Auditoría**: Si más adelante quieres trails, crea `onfit.audit_log` con RLS sólo admin.
- **Evolución**: Añade tablas (`workouts`, `plans`, `payments`) bajo el **mismo patrón**: `created_at/updated_at`, RLS self/admin, vistas públicas para datos no sensibles.
