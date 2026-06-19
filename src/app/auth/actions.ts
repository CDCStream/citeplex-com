"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export interface AuthState {
  error?: string;
  message?: string;
}

function siteUrl(host: string | null) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (host) return `http://${host}`;
  return "http://localhost:3001";
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("activity_log").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    action: "auth.signin",
    metadata: { method: "password" },
  });

  revalidatePath("/", "layout");
  const redirectTo = String(formData.get("redirect") || "/dashboard");
  redirect(redirectTo);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const hdrs = await headers();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl(hdrs.get("host"))}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Send a welcome email (best-effort — never blocks signup).
  if (data.user) {
    await sendWelcomeEmail(email, fullName).catch(() => {});
  }

  // When email confirmation is enabled, there is no active session yet —
  // send the user to a dedicated "check your inbox" page.
  if (data.user && !data.session) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Email is required." };

  const hdrs = await headers();
  const supabase = await createClient();

  // Sends Supabase's "Reset password" email; link returns to our callback,
  // which exchanges the code for a recovery session and forwards to /reset-password.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl(hdrs.get("host"))}/auth/callback?next=/reset-password`,
  });

  // Generic message — never reveal whether an account exists.
  return {
    message: "If an account exists for that email, we've sent a reset link. Check your inbox.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset link has expired. Request a new one from the sign-in page." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const hdrs = await headers();
  const supabase = await createClient();
  const redirectTo = String(formData.get("redirect") || "/dashboard");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl(hdrs.get("host"))}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
