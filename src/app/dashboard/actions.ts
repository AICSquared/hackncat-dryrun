"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { callRenderService } from "@/lib/render/client";
import { runJob } from "@/lib/jobs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, getUser } from "@/lib/supabase/server";
import { tracks } from "@/lib/tracks";

const validTracks = new Set<string>([...tracks.map((t) => t.slug), "shared"]);

/** Creates a job, hands it to Render if configured (else runs it after the response), and refreshes the dashboard. */
export async function createJob(form: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const track = String(form.get("track") ?? "shared");
  const note = String(form.get("note") ?? "").slice(0, 500);
  if (!validTracks.has(track)) redirect("/dashboard?error=Unknown%20track");

  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .insert({ user_id: user.id, track, kind: "demo", input: { note } })
    .select("id")
    .single();
  if (error || !job) redirect(`/dashboard?error=${encodeURIComponent(error?.message ?? "Could not create the job")}`);

  const sent = await callRenderService("/jobs", { body: { jobId: job.id } });
  if (!sent.ok) {
    // No Render worker (or it failed): run the job here, after the response is sent.
    // The secret-key client is used when available, because after() runs outside the request.
    const hasSecret = Boolean(process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY);
    if (hasSecret) after(() => runJob(createAdminClient(), job.id));
    else await runJob(supabase, job.id);
  }

  revalidatePath("/dashboard");
}

export async function deleteJob(form: FormData) {
  const supabase = await createClient();
  await supabase.from("jobs").delete().eq("id", String(form.get("id")));
  revalidatePath("/dashboard");
}
