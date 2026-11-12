import type { Metadata } from "next";
import { Card, Page, PageHeader, Tag } from "@/components/ui";

// Cisco track. Owned by the builder named in CHECKLIST.md. Replace this placeholder
// with the real screen once the brief is out; keep shared pieces in src/components.
export const metadata: Metadata = { title: "Cisco" };

export default function CiscoPage() {
  return (
    <Page>
      <PageHeader meta="Cisco track" title="Waiting for the Cisco brief." />
      <Card className="flex flex-col gap-2">
        <span className="w-fit"><Tag severity="Info">Not started</Tag></span>
        <p className="text-ink-2">
          This page becomes the Cisco demo. The plan lives in <code className="font-mono text-sm">docs/plans/cisco.md</code> and
          progress in <code className="font-mono text-sm">src/app/cisco/CHECKLIST.md</code>.
        </p>
      </Card>
    </Page>
  );
}
