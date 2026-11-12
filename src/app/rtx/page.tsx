import type { Metadata } from "next";
import { Card, Page, PageHeader, Tag } from "@/components/ui";

// RTX track. Owned by the builder named in CHECKLIST.md. Replace this placeholder
// with the real screen once the brief is out; keep shared pieces in src/components.
export const metadata: Metadata = { title: "RTX" };

export default function RtxPage() {
  return (
    <Page>
      <PageHeader meta="RTX track" title="Waiting for the RTX brief." />
      <Card className="flex flex-col gap-2">
        <span className="w-fit"><Tag severity="Info">Not started</Tag></span>
        <p className="text-ink-2">
          This page becomes the RTX demo. The plan lives in <code className="font-mono text-sm">docs/plans/rtx.md</code> and
          progress in <code className="font-mono text-sm">src/app/rtx/CHECKLIST.md</code>.
        </p>
      </Card>
    </Page>
  );
}
