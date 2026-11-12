// One place that reads the Supabase settings. Accepts both the current key names
// (publishable / secret) and the legacy ones (anon / service_role).
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until the team fills in .env.local. Pages show a setup notice instead of crashing. */
export const hasSupabase = Boolean(supabaseUrl && supabasePublicKey);
