import "server-only";

export type RenderResult<T> = { ok: true; data: T } | { ok: false; skipped: true } | { ok: false; error: string };

/** True when a Render worker is configured. Without it, run the work in Next.js with after(). */
export const hasRender = Boolean(process.env.RENDER_SERVICE_URL && process.env.RENDER_INTERNAL_SECRET);

/**
 * Calls the Render worker with the shared secret. Returns { skipped: true } when Render
 * isn't configured, so callers can fall back to running the work themselves.
 */
export async function callRenderService<T = unknown>(
  endpoint: string,
  options: { method?: "GET" | "POST"; body?: unknown; timeoutMs?: number } = {},
): Promise<RenderResult<T>> {
  if (!hasRender) return { ok: false, skipped: true };
  const url = new URL(endpoint, process.env.RENDER_SERVICE_URL);
  try {
    const res = await fetch(url, {
      method: options.method ?? "POST",
      headers: {
        Authorization: `Bearer ${process.env.RENDER_INTERNAL_SECRET}`,
        "Content-Type": "application/json",
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `Render worker answered ${res.status}` };
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Render worker unreachable" };
  }
}
