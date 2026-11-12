// Shared building blocks in the Direction D style. Tracks import these; they don't copy them.
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Page({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return (
    <main className={cx("mx-auto flex flex-col gap-7 px-5 pt-9 pb-12 sm:px-8", narrow ? "max-w-xl" : "max-w-5xl")}>
      {children}
    </main>
  );
}

/** Top of every screen: small context line, then a plain-language headline that says what's going on. */
export function PageHeader({ meta, title, actions }: { meta?: ReactNode; title: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-2xl flex-col gap-1.5">
        {meta && <p className="text-sm text-ink-3">{meta}</p>}
        <h1 className="text-[clamp(26px,4vw,36px)] leading-tight font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </header>
  );
}

export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section className={cx("rounded-[var(--radius-card)] bg-surface p-6", className)} {...props} />;
}

type ButtonVariant = "primary" | "secondary";
const buttonClass = (v: ButtonVariant = "primary") =>
  cx(
    "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] px-5 text-[15px] font-semibold transition-colors disabled:opacity-50",
    v === "primary" ? "bg-accent text-white hover:bg-accent-strong" : "border border-[#c9c6bf] bg-surface text-ink hover:bg-ground",
  );

export function Button({ variant, className, ...props }: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cx(buttonClass(variant), className)} {...props} />;
}

export function ButtonLink({ variant, className, ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cx(buttonClass(variant), className)} {...props} />;
}

export type Severity = "Critical" | "Warning" | "Info" | "Done";
const tagClass: Record<Severity, string> = {
  Critical: "bg-crit-bg text-crit-tag",
  Warning: "bg-warn-bg text-warn",
  Info: "bg-info-bg text-ink-2",
  Done: "bg-ok-bg text-ok",
};

export function Tag({ severity, children }: { severity: Severity; children?: ReactNode }) {
  return (
    <span className={cx("rounded-[var(--radius-tag)] px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap", tagClass[severity])}>
      {children ?? severity}
    </span>
  );
}

export function Field({ label, id, ...props }: ComponentProps<"input"> & { label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm text-ink-2">
      {label}
      <input
        id={id}
        className="min-h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3 text-base text-ink"
        {...props}
      />
    </label>
  );
}

/** Shown instead of data until .env.local has the Supabase keys. */
export function SetupNotice() {
  return (
    <Card className="border border-line">
      <h2 className="text-lg font-semibold">Supabase isn&apos;t connected yet</h2>
      <p className="mt-1 text-ink-2">
        Copy <code className="font-mono text-sm">.env.example</code> to <code className="font-mono text-sm">.env.local</code> and
        fill in the Supabase URL and keys, then restart <code className="font-mono text-sm">pnpm dev</code>.
      </p>
    </Card>
  );
}
