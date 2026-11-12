# Lenovo plan (practice brief)

Author: Alex's Claude (integrator) · Channel: #6 · Status: plan only, nothing built

**Brief:** "Show a live view of a laptop fleet's battery health, flag any device below 70%, and let an operator mark it for service."

**Reading of the brief (to confirm with lead):** "battery health" means state of health, `full_charge_capacity_mwh / design_capacity_mwh × 100`, not the current charge level. A device is **flagged** when health is **strictly below 70%**. "Live" means the view updates without a reload. Time box: 3 hours (assumed; lead sets it in AGENTS.md section 6).

## 1. The demo in 90 seconds

1. Open `/lenovo`. Headline in plain language: "42 of 48 laptops are healthy. 6 are below 70% and need a person." The KPI strip shows fleet size, median health, flagged count (animated), in service.
2. The fleet table is sorted worst-first. Each row: hostname, model, health bar with the number, cycle count, last seen. Flagged rows carry a `Critical` tag and sit at the top.
3. Wait about 5 seconds. A "Live" indicator pulses, "Updated 3 s ago" resets, and one device's health ticks down. When it crosses 70 it jumps into the flagged group and the flagged KPI animates 6 to 7.
4. Click **Mark for service** on a flagged row (button at least 44px). The row flips to `Warning` "In service queue", the KPI "In service" goes up, and the flagged count drops by one (a device in service is no longer waiting on an operator).
5. Reload. The mark is still there (Supabase), or, with no keys, still there in this session (in-memory fallback with `SetupNotice`).
6. Click **Undo** on that row to take it back out of the queue, so the demo can be repeated.

## 2. Rubric map

The sponsor's real rubric is not out yet; this maps the three clauses of the practice brief. Replace with the real criteria in `CHECKLIST.md` at kickoff.

| Criterion | Answered by |
|---|---|
| Live view of fleet battery health | `use-fleet` hook polling the source every 5 s; "Live" indicator and "Updated N s ago" computed from the newest arrival, not point spacing (AGENTS.md section 7) |
| Flag any device below 70% | `isFlagged()` in `_lib/health.ts`, strict `< 70`; flagged group, `Critical` tag, flagged KPI |
| Operator can mark it for service | Server Action `markForService` / `clearService`, persisted in `lenovo_service_marks` |
| Correct numbers | Second-way check: a node script recomputes flagged count and median from the raw sample JSON and must equal the page (evidence in `docs/evidence/`) |
| Looks and works well | Direction D tokens, shared `Page`/`Card`/`Tag`/`Button`, `Kpi` for 3 numbers only, 44px controls |

## 3. Data

**Contract first** (integrator writes `_lib/types.ts` and `_lib/health.ts` before anyone builds; changes need a `REQ` on #6 and an `ACK` from the three builders):

```ts
export type DeviceReading = {
  deviceId: string;            // "LT-0001"
  hostname: string;
  model: string;               // "ThinkPad T14 Gen 4"
  designCapacityMwh: number;
  fullChargeCapacityMwh: number;
  cycleCount: number;
  observedAt: string;          // ISO, set by the source, not the device clock
};
export type FleetDevice = DeviceReading & {
  healthPct: number;           // one decimal
  flagged: boolean;            // healthPct < 70 and not in service
  inService: boolean;
};
export const HEALTH_THRESHOLD_PCT = 70;
```

**Tables** (one migration, `supabase/migrations/<ts>_lenovo_fleet.sql`, lead approves):

- `lenovo_devices` (id, user_id, device_id, hostname, model, design_capacity_mwh, full_charge_capacity_mwh, cycle_count, observed_at). RLS on `auth.uid() = user_id`.
- `lenovo_service_marks` (id, user_id, device_id, marked_at, note). Unique on `(user_id, device_id)`. RLS on `auth.uid() = user_id`.

Readings are simulated: no real fleet exists. State this plainly in the README.

**Sample data** (`_data/fleet.ts`, 48 devices, fixed seed): mostly 78–96% health, 6 devices between 55 and 69, plus edge cases: exactly 70.0 (not flagged), 69.9 (flagged), a device with `fullCharge > design` (clamp to 100), one with `design = 0` (excluded, shown as "No data"), one stale device (last seen over 10 minutes ago).

**Live source:** `_lib/fleet-source.ts` exposes `getFleet(): Promise<{ devices: DeviceReading[]; fetchedAt: string }>`. With Supabase keys it reads `lenovo_devices`; without, it returns the sample data with small seeded drift per call so the live view visibly moves. A Route Handler `src/app/lenovo/api/fleet/route.ts` serves it to the client hook. (The hook polls; Supabase Realtime is a stretch, not a must.)

## 4. Tasks

Build order: **0 (contract) → A, B, C in parallel against the contract → I**. Each task is under 2 hours. A builder owns only the files listed; anything else is a `REQ` to the owner.

### Task 0 · Contract (integrator, 20 min)
- **Owns:** `src/app/lenovo/_lib/types.ts`, `src/app/lenovo/_lib/health.ts` (`healthPct()`, `isFlagged()`, `medianHealth()`, `HEALTH_THRESHOLD_PCT`)
- **Done when:** types compile, `healthPct` handles the edge cases above, `pnpm tsc` passes, posted to #6 as `DECISION`-ready contract.

### Task A · Fleet data and live feed (builder 1)
- **Owns:** `src/app/lenovo/_data/fleet.ts`, `src/app/lenovo/_lib/fleet-source.ts`, `src/app/lenovo/_lib/use-fleet.ts`, `src/app/lenovo/api/fleet/route.ts`, `supabase/migrations/<ts>_lenovo_fleet.sql` (draft only; lead approves and applies)
- **Depends on:** Task 0.
- **Does:** the 48-device sample with the edge cases; `getFleet()` with Supabase and seeded fallback; `useFleet(initial)` client hook that polls every 5 s and returns `{ devices, fetchedAt, secondsAgo, live }` where `live` turns false after 15 s without a successful poll.
- **Accept:** `curl /lenovo/api/fleet` returns 48 devices; two calls 5 s apart differ by at least one reading; with the network off the hook reports `live: false`; migration has RLS on both tables.

### Task B · Fleet table and health bar (builder 2)
- **Owns:** `src/app/lenovo/_components/fleet-table.tsx`, `src/app/lenovo/_components/health-bar.tsx`
- **Depends on:** Task 0 (types only; uses sample data until A lands).
- **Does:** client component `FleetTable({ devices, onService })` sorted flagged first then lowest health; health bar with the number and a text label (not colour alone); `Critical` / `Warning` / `Done` tags from `@/components/ui`; "No data" and "Stale" states; a slot for the row action so Task C plugs in.
- **Accept:** renders 48 rows from the sample; 69.9 is flagged and 70.0 is not; keyboard reachable; rows at least 44px; no new colours.

### Task C · Service action (builder 3)
- **Owns:** `src/app/lenovo/actions.ts`, `src/app/lenovo/_components/service-button.tsx`
- **Depends on:** Task 0 and the migration from A (mock the store until then).
- **Does:** `"use server"` actions `markForService(deviceId, note?)` and `clearService(deviceId)`, ending in `revalidatePath("/lenovo")`; Supabase upsert when `hasSupabase`, otherwise an in-memory `Map` fallback; `ServiceButton` uses `useTransition` with an optimistic state and an Undo.
- **Accept:** mark then reload keeps the mark; marking twice is idempotent; a signed-out user with Supabase on gets a clear error, not a crash; works with no keys.

### Task I · Integrator (Alex's Claude)
- **Owns:** `src/app/lenovo/page.tsx`, `src/app/lenovo/layout.tsx`, `src/app/lenovo/README.md`, `src/app/lenovo/CHECKLIST.md`, `docs/evidence/lenovo-*`
- **Depends on:** A, B, C.
- **Does:** server `page.tsx` loads initial fleet and marks, renders `PageHeader` with the plain-language headline, three `Kpi`s (flagged, median health, in service), `FleetTable` wired to `useFleet` and `ServiceButton`, and `SetupNotice` when `!hasSupabase`. Writes the second-way check script and evidence, fills README and CHECKLIST, records the 90-second video.
- **Accept:** the demo in section 1 works click for click on a phone-width screen; `pnpm lint && pnpm tsc && pnpm build` pass.

## 5. Risks and fallbacks

| Risk | Fallback |
|---|---|
| "Health" is read as charge level, not state of health | Confirm with lead before Task A. The contract isolates it in `healthPct()`, so switching is a one-file change |
| Supabase keys or auth missing in the demo | In-memory fallbacks in A and C; `SetupNotice` shown; the demo still runs |
| Live feel is fake (simulated drift) | Say so in the README; the "Updated N s ago" comes from real poll arrivals, not made-up timestamps |
| Flagged count and table disagree | One `isFlagged()` used by KPI and table; the evidence script recomputes independently |
| Three builders collide in `page.tsx` | They don't touch it; the integrator wires everything and the row action is a slot in B |
| Migration needs lead approval and is late | C and A use the in-memory fallback until it is applied |
| Polling hammers the route | 5 s interval, pause when the tab is hidden |
