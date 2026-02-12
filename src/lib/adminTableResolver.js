import { supabase } from "./supabaseClient.js";

const cache = new Map();

const isMissingTableError = (error) => {
  const message = error?.message?.toLowerCase?.() || "";
  return message.includes("could not find the table") || message.includes("404");
};

export const resolveFirstExistingTable = async (candidates) => {
  const key = candidates.join("|");
  if (cache.has(key)) {
    return cache.get(key);
  }

  for (const tableName of candidates) {
    const { error } = await supabase.from(tableName).select("id").limit(1);
    if (!error) {
      cache.set(key, tableName);
      return tableName;
    }

    if (!isMissingTableError(error)) {
      // table exists but query failed for another reason (RLS, etc.)
      cache.set(key, tableName);
      return tableName;
    }
  }

  cache.set(key, null);
  return null;
};
