-- Menu + Gallery admin updates

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  is_popular boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists menu_comfort_picks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into gallery_categories (name, sort_order)
values ('Uncategorized', 0)
on conflict (name) do nothing;

insert into gallery_categories (name, sort_order)
select distinct category, 1
from gallery_images
where category is not null and trim(category) <> ''
on conflict (name) do nothing;

alter table if exists menu_categories enable row level security;
alter table if exists menu_items enable row level security;
alter table if exists menu_comfort_picks enable row level security;
alter table if exists gallery_categories enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'public select menu categories'
  ) then
    create policy "public select menu categories"
      on menu_categories for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'public select menu items'
  ) then
    create policy "public select menu items"
      on menu_items for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'public select comfort picks'
  ) then
    create policy "public select comfort picks"
      on menu_comfort_picks for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'public select gallery categories'
  ) then
    create policy "public select gallery categories"
      on gallery_categories for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'admin mutate menu categories'
  ) then
    create policy "admin mutate menu categories"
      on menu_categories for all
      using (is_admin())
      with check (is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'admin mutate menu items'
  ) then
    create policy "admin mutate menu items"
      on menu_items for all
      using (is_admin())
      with check (is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'admin mutate comfort picks'
  ) then
    create policy "admin mutate comfort picks"
      on menu_comfort_picks for all
      using (is_admin())
      with check (is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and policyname = 'admin mutate gallery categories'
  ) then
    create policy "admin mutate gallery categories"
      on gallery_categories for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
