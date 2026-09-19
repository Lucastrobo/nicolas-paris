import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return { url, key };
}

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (!config) return null;
  return createClient(config.url, config.key);
}

export function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config) return null;
  return createClient(config.url, config.key, {
    auth: {
      persistSession: false,
    },
  });
}
