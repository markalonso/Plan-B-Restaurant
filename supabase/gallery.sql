create extension if not exists "pgcrypto";

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  category text not null,
  title text,
  description text,
  alt_text text,
  image_url text not null,
  storage_path text
);

create index if not exists gallery_images_category_idx
  on gallery_images (category);

alter table gallery_images enable row level security;

create policy "public select gallery images"
  on gallery_images for select
  to anon, authenticated
  using (true);

create policy "admin insert gallery images"
  on gallery_images for insert
  to authenticated
  with check (is_admin());

create policy "admin update gallery images"
  on gallery_images for update
  to authenticated
  using (is_admin());

create policy "admin delete gallery images"
  on gallery_images for delete
  to authenticated
  using (is_admin());

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "public read gallery"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "admin upload gallery"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery' and is_admin());

create policy "admin delete gallery"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery' and is_admin());
