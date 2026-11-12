import type { Metadata } from "next";
import { Card, Page, PageHeader, Tag } from "@/components/ui";

// Sandia National Laboratories track. Owned by the builder named in CHECKLIST.md. Replace this placeholder
// with the real screen once the brief is out; keep shared pieces in src/components.
export const metadata: Metadata = { title: "Sandia National Laboratories" };

export default function SandiaPage() {
  return (
    <Page>
      <PageHeader meta="Sandia National Laboratories track" title="Waiting for the Sandia National Laboratories brief." />
      <Card className="flex flex-col gap-2">
        <span className="w-fit"><Tag severity="Info">Not started</Tag></span>
        <p className="text-ink-2">
          This page becomes the Sandia National Laboratories demo. The plan lives in <code className="font-mono text-sm">docs/plans/sandia.md</code> and
          progress in <code className="font-mono text-sm">src/app/sandia/CHECKLIST.md</code>.
        </p>
      </Card>
    </Page>
  );
}
