import {
  HEALTH_THRESHOLD_PCT,
  STALE_AFTER_MS,
  type DeviceReading,
  type FleetDevice,
} from "./types";

/** State of health: full-charge capacity over design capacity. Clamped to 0-100, one decimal. null if design capacity is missing. */
export function healthPct(r: Pick<DeviceReading, "designCapacityMwh" | "fullChargeCapacityMwh">): number | null {
  if (!(r.designCapacityMwh > 0) || !Number.isFinite(r.fullChargeCapacityMwh)) return null;
  const pct = (r.fullChargeCapacityMwh / r.designCapacityMwh) * 100;
  return Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10;
}

/** Strictly below the threshold. 70.0 is healthy, 69.9 is not. */
export function isBelowThreshold(pct: number | null): boolean {
  return pct !== null && pct < HEALTH_THRESHOLD_PCT;
}

export function toFleetDevice(r: DeviceReading, inService: boolean): FleetDevice {
  const pct = healthPct(r);
  return { ...r, healthPct: pct, inService, flagged: isBelowThreshold(pct) && !inService };
}

export function isStale(r: Pick<DeviceReading, "observedAt">, now: number = Date.now()): boolean {
  return now - new Date(r.observedAt).getTime() > STALE_AFTER_MS;
}

/** Median health across devices that have data. Median, not mean, so outliers don't move it. null if none. */
export function medianHealth(devices: Pick<FleetDevice, "healthPct">[]): number | null {
  const v = devices.flatMap((d) => (d.healthPct === null ? [] : [d.healthPct])).sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round(((v[mid - 1] + v[mid]) / 2) * 10) / 10;
}
