import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Debug (temporary): tells us if env is loaded
console.log("SUPABASE ENV CHECK:", {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY_EXISTS: !!supabaseAnonKey,
});

if (!supabaseUrl || !supabaseAnonKey) {
  // ✅ Stop early so it doesn't create a broken client that crashes later
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file in the project root (same folder as package.json), then restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
