import type { Metadata } from "next";
import { Button, Card, Field, Page, PageHeader, SetupNotice } from "@/components/ui";
import { hasSupabase } from "@/lib/supabase/env";
import { signIn, signUp } from "../actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string }> }) {
  const { error, notice } = await searchParams;
  return (
    <Page narrow>
      <PageHeader meta="Team account" title="Sign in to see your jobs." />
      {!hasSupabase ? (
        <SetupNotice />
      ) : (
        <Card>
          <form className="flex flex-col gap-4">
            <Field label="Email" id="email" name="email" type="email" autoComplete="email" required />
            <Field label="Password" id="password" name="password" type="password" autoComplete="current-password" minLength={6} required />
            {error && <p role="alert" className="text-sm font-semibold text-crit">{error}</p>}
            {notice && <p role="status" className="text-sm text-ok">{notice}</p>}
            <div className="flex flex-wrap gap-2.5">
              <Button formAction={signIn}>Sign in</Button>
              <Button formAction={signUp} variant="secondary">Create account</Button>
            </div>
          </form>
        </Card>
      )}
    </Page>
  );
}
