import Link from "next/link";
import { ButtonLink, Page, PageHeader } from "@/components/ui";
import { tracks } from "@/lib/tracks";

export default function Home() {
  return (
    <Page>
      <PageHeader
        meta="HackNCAT · six sponsor tracks"
        title="Pick a track to see what we built for it."
        actions={<ButtonLink href="/dashboard" variant="secondary">Team dashboard</ButtonLink>}
      />
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
        {tracks.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/${t.slug}`}
              className="flex h-full flex-col gap-1 rounded-[var(--radius-card)] bg-surface p-6 hover:outline hover:outline-2 hover:outline-accent"
            >
              <span className="text-sm text-ink-3">Track</span>
              <span className="text-xl font-semibold">{t.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
