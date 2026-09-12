create extension if not exists citext;

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          varchar(60)  not null check (char_length(name) between 20 and 60),
  email         citext       not null unique,
  password_hash text         not null,
  address       varchar(400) not null,
  role          text         not null default 'USER'
                check (role in ('ADMIN','USER','OWNER')),
  created_at    timestamptz  not null default now()
);

create table if not exists stores (
  id         uuid primary key default gen_random_uuid(),
  name       varchar(60)  not null,
  email      citext       not null unique,
  address    varchar(400) not null,
  owner_id   uuid references users(id) on delete set null,
  created_at timestamptz  not null default now()
);

create table if not exists ratings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id)  on delete cascade,
  store_id   uuid not null references stores(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, store_id)
);

create index if not exists ratings_store_idx on ratings(store_id);
create index if not exists stores_owner_idx  on stores(owner_id);
