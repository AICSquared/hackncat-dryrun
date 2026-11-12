import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Server-only client with the secret key. It bypasses Row Level Security, so use it
 * only for trusted background work, never with input you haven't checked.
 */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secret) throw new Error("Set SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local");
  return createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}
