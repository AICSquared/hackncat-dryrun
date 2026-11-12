import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type Job = {
  id: string;
  track: string;
  kind: string;
  input: Record<string, unknown>;
  status: "queued" | "running" | "done" | "failed";
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
};

/**
 * The work a job does when it runs inside Next.js (no Render worker).
 * Replace the body with the real task for each kind. Keep it under a minute;
 * anything longer belongs in render-worker/.
 */
export async function runJob(supabase: SupabaseClient, jobId: string) {
  await supabase.from("jobs").update({ status: "running" }).eq("id", jobId);
  try {
    await new Promise((r) => setTimeout(r, 1500));
    const result = { processedBy: "next", at: new Date().toISOString() };
    await supabase.from("jobs").update({ status: "done", result }).eq("id", jobId);
  } catch (e) {
    await supabase.from("jobs").update({ status: "failed", error: e instanceof Error ? e.message : String(e) }).eq("id", jobId);
  }
}
