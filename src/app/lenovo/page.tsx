import type { Metadata } from "next";
import { Card, Page, PageHeader, Tag } from "@/components/ui";

// Lenovo track. Owned by the builder named in CHECKLIST.md. Replace this placeholder
// with the real screen once the brief is out; keep shared pieces in src/components.
export const metadata: Metadata = { title: "Lenovo" };

export default function LenovoPage() {
  return (
    <Page>
      <PageHeader meta="Lenovo track" title="Waiting for the Lenovo brief." />
      <Card className="flex flex-col gap-2">
        <span className="w-fit"><Tag severity="Info">Not started</Tag></span>
        <p className="text-ink-2">
          This page becomes the Lenovo demo. The plan lives in <code className="font-mono text-sm">docs/plans/lenovo.md</code> and
          progress in <code className="font-mono text-sm">src/app/lenovo/CHECKLIST.md</code>.
        </p>
      </Card>
    </Page>
  );
}
