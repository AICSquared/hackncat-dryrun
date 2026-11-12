// Lenovo track contract. Changes need a REQ on #6 and an ACK from every builder using it.

/** Flag a device when its battery health is strictly below this percentage. */
export const HEALTH_THRESHOLD_PCT = 70;

/** A device with no reading for longer than this is shown as stale. */
export const STALE_AFTER_MS = 10 * 60 * 1000;

/** One raw reading from the fleet source. */
export type DeviceReading = {
  deviceId: string; // "LT-0001"
  hostname: string;
  model: string; // "ThinkPad T14 Gen 4"
  designCapacityMwh: number;
  fullChargeCapacityMwh: number;
  cycleCount: number;
  observedAt: string; // ISO, set by the source, not the device clock
};

/** A reading plus everything derived from it. Build with `toFleetDevice`. */
export type FleetDevice = DeviceReading & {
  /** State of health, 0 to 100, one decimal. null when design capacity is missing (shown as "No data"). */
  healthPct: number | null;
  /** healthPct is below the threshold and the device is not already in service. */
  flagged: boolean;
  inService: boolean;
};

/** What the live feed returns. */
export type FleetSnapshot = {
  devices: DeviceReading[];
  fetchedAt: string; // ISO, set when the source answered
};
