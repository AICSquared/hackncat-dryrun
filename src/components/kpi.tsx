"use client";

import NumberFlow, { type Format } from "@number-flow/react";

/** A headline number that animates when it changes. Use for the 3 to 5 numbers you'd point at in the pitch. */
export function Kpi({
  label,
  value,
  suffix,
  note,
  format,
}: {
  label: string;
  value: number;
  suffix?: string;
  note?: string;
  format?: Format;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[var(--radius-card)] bg-surface px-5 py-5">
      <span className="text-sm text-ink-3">{label}</span>
      <span className="flex items-baseline gap-1 text-[40px] leading-none font-semibold tracking-tight tabular-nums">
        <NumberFlow value={value} format={format} />
        {suffix && <small className="text-lg font-medium text-ink-3">{suffix}</small>}
      </span>
      {note && <span className="text-sm text-ink-2">{note}</span>}
    </div>
  );
}
