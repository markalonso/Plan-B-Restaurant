import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for missing environment variables
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey;

if (isMissingCredentials) {
  console.warn(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. " +
    "Database features will be disabled."
  );
}

// Create client with fallback values for development (operations will fail gracefully)
// In production, proper environment variables must be set
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
