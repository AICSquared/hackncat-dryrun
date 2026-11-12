import type { Metadata } from "next";
import { Card, Page, PageHeader, Tag } from "@/components/ui";

// Applied Materials track. Owned by the builder named in CHECKLIST.md. Replace this placeholder
// with the real screen once the brief is out; keep shared pieces in src/components.
export const metadata: Metadata = { title: "Applied Materials" };

export default function AmatPage() {
  return (
    <Page>
      <PageHeader meta="Applied Materials track" title="Waiting for the Applied Materials brief." />
      <Card className="flex flex-col gap-2">
        <span className="w-fit"><Tag severity="Info">Not started</Tag></span>
        <p className="text-ink-2">
          This page becomes the Applied Materials demo. The plan lives in <code className="font-mono text-sm">docs/plans/amat.md</code> and
          progress in <code className="font-mono text-sm">src/app/amat/CHECKLIST.md</code>.
        </p>
      </Card>
    </Page>
  );
}
