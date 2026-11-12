// Optional background worker for Render. Only needed when a track has work that is too
// long or heavy for a Vercel function. Next.js calls it through src/lib/render/client.ts.
import express from "express";
import { createClient } from "@supabase/supabase-js";

const { PORT = 10000, RENDER_INTERNAL_SECRET, NEXT_PUBLIC_SUPABASE_URL } = process.env;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!RENDER_INTERNAL_SECRET || !NEXT_PUBLIC_SUPABASE_URL || !SECRET_KEY) {
  console.error("Missing RENDER_INTERNAL_SECRET, NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });
const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Everything below needs the shared secret.
app.use((req, res, next) => {
  if (req.get("authorization") !== `Bearer ${RENDER_INTERNAL_SECRET}`) return res.status(401).json({ error: "unauthorized" });
  next();
});

// Body: { jobId }. Answers right away, then does the work and writes the result to Supabase.
app.post("/jobs", async (req, res) => {
  const { jobId } = req.body ?? {};
  if (typeof jobId !== "string") return res.status(400).json({ error: "jobId required" });
  res.status(202).json({ accepted: jobId });

  try {
    await supabase.from("jobs").update({ status: "running" }).eq("id", jobId);
    const { data: job, error } = await supabase.from("jobs").select("*").eq("id", jobId).single();
    if (error) throw error;
    const result = await processJob(job);
    await supabase.from("jobs").update({ status: "done", result }).eq("id", jobId);
  } catch (e) {
    await supabase.from("jobs").update({ status: "failed", error: String(e?.message ?? e) }).eq("id", jobId);
  }
});

// Replace with the real work for each kind of job.
async function processJob(job) {
  await new Promise((r) => setTimeout(r, 1500));
  return { processedBy: "render", kind: job.kind, at: new Date().toISOString() };
}

app.listen(PORT, () => console.log(`render-worker listening on ${PORT}`));
