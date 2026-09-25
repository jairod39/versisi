-- ============================================================
-- Versisi — esquema inicial de base de datos
-- Pega este archivo completo en Supabase > SQL Editor > Run
-- ============================================================

create extension if not exists "pgcrypto";

-- Usuarios (se llena automáticamente cuando alguien se registra con Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  city text,
  photo_url text,
  is_over_18 boolean not null default false,
  photo_consent boolean not null default false,
  age_verified boolean not null default false,
  telegram_username text,
  created_at timestamptz not null default now()
);

-- Retos (un usuario crea un reto y comparte su link)
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  slug text unique not null,
  is_public boolean not null default false,
  intent text not null default 'couple',
  created_at timestamptz not null default now()
);

-- Solicitudes (alguien abre un reto y sube su foto)
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  visitor_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending', -- pending | approved | rejected
  created_at timestamptz not null default now(),
  unique (challenge_id, visitor_id)
);

-- Llave Versisi: controla el acceso a cada conexión (reto <-> visitante, o match)
-- El token en sí vive como cookie en el navegador; esta tabla es la que el
-- servidor consulta para saber si esa llave sigue activa.
create table if not exists access_keys (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  owner_id uuid not null references profiles(id) on delete cascade,
  subject_id uuid not null references profiles(id) on delete cascade,
  request_id uuid references requests(id) on delete cascade,
  match_id uuid,
  status text not null default 'active', -- active | revoked
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Escenas generadas por cada solicitud aprobada
create table if not exists scene_sets (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  scene_key text not null, -- vac | wed | old
  image_url text,
  status text not null default 'pending', -- pending | done | failed
  created_at timestamptz not null default now()
);

-- Decisión de cada persona tras ver las escenas
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  interested boolean not null,
  created_at timestamptz not null default now(),
  unique (request_id, profile_id)
);

-- Matches (cuando ambos dijeron que sí)
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade unique,
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Mensajes del chat, solo entre los dos del match
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Bloqueos: al bloquear, se revocan las llaves de esa conexión
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_id uuid not null references profiles(id) on delete cascade,
  reason text,
  status text not null default 'open', -- open | reviewed
  created_at timestamptz not null default now()
);

-- Gasto diario de generación (para el tope de gasto)
create table if not exists generation_spend (
  day date primary key default current_date,
  cents_spent integer not null default 0
);

-- ---------- Row Level Security ----------

alter table profiles enable row level security;
alter table challenges enable row level security;
alter table requests enable row level security;
alter table access_keys enable row level security;
alter table scene_sets enable row level security;
alter table decisions enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table blocks enable row level security;
alter table reports enable row level security;

-- Perfiles: cada quien ve y edita el suyo; el nombre/foto de retos públicos se
-- expone vía la API con service role, no leyendo profiles directo desde el cliente.
create policy "profiles_self" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Retos: el dueño ve y administra los suyos.
create policy "challenges_owner" on challenges
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Retos públicos: cualquiera autenticado puede leer los que están marcados públicos.
create policy "challenges_public_read" on challenges
  for select using (is_public = true);

-- Solicitudes: el dueño del reto y quien la envió pueden verla.
create policy "requests_owner_or_visitor" on requests
  for select using (
    auth.uid() = visitor_id
    or auth.uid() in (select owner_id from challenges c where c.id = challenge_id)
  );
create policy "requests_insert_visitor" on requests
  for insert with check (auth.uid() = visitor_id);
create policy "requests_update_owner" on requests
  for update using (auth.uid() in (select owner_id from challenges c where c.id = challenge_id));

-- Decisiones: cada quien ve y crea las suyas dentro de su solicitud.
create policy "decisions_participant" on decisions
  for all using (
    auth.uid() = profile_id
  ) with check (auth.uid() = profile_id);

-- Matches y mensajes: solo los dos participantes.
create policy "matches_participants" on matches
  for select using (auth.uid() = user_a or auth.uid() = user_b);
create policy "messages_participants" on messages
  for select using (
    auth.uid() in (select user_a from matches m where m.id = match_id
                    union select user_b from matches m where m.id = match_id)
  );
create policy "messages_insert_participants" on messages
  for insert with check (
    auth.uid() = sender_id and
    auth.uid() in (select user_a from matches m where m.id = match_id
                    union select user_b from matches m where m.id = match_id)
  );

-- Bloqueos y reportes: cada quien ve y crea los suyos.
create policy "blocks_self" on blocks
  for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);
create policy "reports_self" on reports
  for insert with check (auth.uid() = reporter_id);
create policy "reports_read_self" on reports
  for select using (auth.uid() = reporter_id);

-- scene_sets: el dueño y el visitante de una solicitud pueden ver sus escenas.
create policy "scene_sets_participants" on scene_sets
  for select using (
    request_id in (
      select r.id from requests r
      join challenges c on c.id = r.challenge_id
      where r.visitor_id = auth.uid() or c.owner_id = auth.uid()
    )
  );

-- access_keys y el resto de escritura de scene_sets se manejan solo desde el
-- servidor (service role), por eso no llevan más políticas de cliente.

-- ---------- Permisos de base (necesarios además de RLS) ----------
-- Sin esto, aunque las políticas de arriba estén bien, los roles anon y
-- authenticated no tienen ni siquiera permiso de tocar las tablas.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;
