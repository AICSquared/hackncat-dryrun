import { hasRender } from "@/lib/render/client";
import { hasSupabase } from "@/lib/supabase/env";

/** Quick check for the dry run and for judges' demo links. */
export function GET() {
  return Response.json({ ok: true, supabase: hasSupabase, render: hasRender });
}
