# Plan B Restaurant Website

Premium restaurant & cafe website for Plan B, built with Vite, React, TailwindCSS, React Router, and Supabase.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file locally (or set in Netlify) with:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Setup (High-Level)

1. Create a new Supabase project.
2. Run the provided SQL script in the Supabase SQL editor to create tables, policies, and seed menu data.
3. Create your admin user by signing up on `/admin/login` and then insert the user ID into the `admin_users` table.
4. Add your Supabase URL and anon key to environment variables locally and in Netlify.

### Gallery Setup

1. Create a **public** Storage bucket named `gallery`.
2. Add a `gallery_images` table with columns:
   - `id` uuid primary key default `gen_random_uuid()`
   - `created_at` timestamptz default `now()`
   - `category` text not null
   - `title` text
   - `description` text
   - `alt_text` text
   - `image_url` text not null
   - `storage_path` text
3. Enable RLS and allow:
   - **Public (anon)**: `SELECT` on `gallery_images`
   - **Admin (authenticated in admin_users)**: `SELECT/INSERT/UPDATE/DELETE` on `gallery_images`
4. Set Storage policies for the `gallery` bucket:
   - **Public** read access
   - **Admin** insert/delete access

## Admin Setup

- After signing up, locate your `user_id` in Supabase → Authentication → Users.
- Insert it into the `admin_users` table:

```sql
insert into admin_users (user_id) values ('YOUR_USER_ID');
```

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, **New site from Git** and select the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy.

### Supabase Auth Redirect URLs

If you enable email confirmations or password resets, update your Supabase Auth settings:
- Supabase dashboard → Authentication → URL Configuration
- Add your Netlify URL (and local `http://localhost:5173`) to the **Redirect URLs** list.

The `netlify.toml` file includes SPA redirects for React Router.
