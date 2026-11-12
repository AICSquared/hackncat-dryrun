import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { Kpi } from "@/components/kpi";
import { Button, Card, Page, PageHeader, SetupNotice, Tag, type Severity } from "@/components/ui";
import type { Job } from "@/lib/jobs";
import { hasRender } from "@/lib/render/client";
import { hasSupabase } from "@/lib/supabase/env";
import { createClient, getUser } from "@/lib/supabase/server";
import { tracks } from "@/lib/tracks";
import { createJob, deleteJob } from "./actions";
import { AutoRefresh } from "./auto-refresh";

export const metadata: Metadata = { title: "Dashboard" };
// Always render on request: the page depends on the signed-in user and live job status.
export const dynamic = "force-dynamic";

const statusTag: Record<Job["status"], Severity> = { queued: "Info", running: "Warning", done: "Done", failed: "Critical" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!hasSupabase) {
    return (
      <Page>
        <PageHeader meta="Dashboard" title="Connect Supabase to start." />
        <SetupNotice />
      </Page>
    );
  }

  const user = await getUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(20);
  const jobs = (data ?? []) as Job[];
  const pending = jobs.filter((j) => j.status === "queued" || j.status === "running").length;
  const done = jobs.filter((j) => j.status === "done").length;

  return (
    <Page>
      <AutoRefresh active={pending > 0} />
      <PageHeader
        meta={`Signed in as ${user.email ?? "you"} · background work runs on ${hasRender ? "Render" : "Next.js"}`}
        title={pending ? `${pending} job${pending === 1 ? " is" : "s are"} running.` : "Everything is up to date."}
        actions={
          <form action={signOut}>
            <Button variant="secondary">Sign out</Button>
          </form>
        }
      />

      <section aria-label="Key numbers" className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
        <Kpi label="Jobs shown" value={jobs.length} />
        <Kpi label="Finished" value={done} />
        <Kpi label="In progress" value={pending} />
      </section>

      <Card aria-labelledby="new-job">
        <h2 id="new-job" className="text-lg font-semibold">Start a job</h2>
        <form action={createJob} className="mt-4 flex flex-wrap items-end gap-3">
          <label htmlFor="track" className="flex flex-col gap-1.5 text-sm text-ink-2">
            Track
            <select id="track" name="track" className="min-h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3 text-base text-ink">
              {tracks.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
              <option value="shared">Shared</option>
            </select>
          </label>
          <label htmlFor="note" className="flex min-w-60 flex-1 flex-col gap-1.5 text-sm text-ink-2">
            Note
            <input id="note" name="note" maxLength={500} placeholder="What should this job do?" className="min-h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3 text-base text-ink" />
          </label>
          <Button>Start job</Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-crit">{error}</p>}
      </Card>

      <section aria-labelledby="recent" className="flex flex-col gap-2.5">
        <h2 id="recent" className="text-lg font-semibold">Recent jobs</h2>
        {jobs.length === 0 ? (
          <Card><p className="text-ink-2">No jobs yet. Start one above.</p></Card>
        ) : (
          <ol className="rounded-[var(--radius-card)] bg-surface py-1.5">
            {jobs.map((j) => (
              <li key={j.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-[#eeece7] px-5 py-3 last:border-b-0">
                <span className="min-w-0">
                  <strong className="font-semibold">{tracks.find((t) => t.slug === j.track)?.name ?? "Shared"}.</strong>{" "}
                  <span className="text-ink-2">{String(j.input?.note || "No note")}</span>
                  {j.error && <span className="block text-sm text-crit">{j.error}</span>}
                </span>
                <Tag severity={statusTag[j.status]}>{j.status}</Tag>
                <form action={deleteJob}>
                  <input type="hidden" name="id" value={j.id} />
                  <button className="min-h-11 px-2 text-sm font-semibold text-accent" aria-label="Delete job">Delete</button>
                </form>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Page>
  );
}
