"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function read(form: FormData) {
  return { email: String(form.get("email") ?? "").trim(), password: String(form.get("password") ?? "") };
}

export async function signIn(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(read(form));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export async function signUp(form: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(read(form));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  // With "Confirm email" on in Supabase, there's no session until the link is clicked.
  if (!data.session) redirect(`/login?notice=${encodeURIComponent("Check your email to confirm, then sign in.")}`);
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
