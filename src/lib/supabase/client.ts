"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicKey, supabaseUrl } from "./env";

/** Supabase client for "use client" components. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublicKey);
}
