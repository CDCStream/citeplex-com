"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { requestPasswordReset, type AuthState } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-all hover:opacity-80 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <>
          Send reset link
          <ArrowRight className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(requestPasswordReset, {});

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="mb-8 inline-flex" aria-label="CitePlex home">
        <Logo />
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      <form action={formAction} className="mt-7 space-y-3">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@university.edu"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-foreground/40"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{state.error}</p>
        )}
        {state.message && (
          <p className="rounded-lg bg-accent px-3 py-2 text-[12px] text-accent-foreground">{state.message}</p>
        )}

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
