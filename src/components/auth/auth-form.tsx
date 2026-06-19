"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp, signInWithGoogle, type AuthState } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-all hover:opacity-80 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <>
          {label}
          <ArrowRight className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
}

function GoogleButton({ redirect }: { redirect: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      formAction={signInWithGoogle}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Continue with Google
      <input type="hidden" name="redirect" value={redirect} />
    </button>
  );
}

interface AuthFormProps {
  mode: "signin" | "signup";
  redirect?: string;
  initialError?: string;
}

export function AuthForm({ mode, redirect = "/dashboard", initialError }: AuthFormProps) {
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthState, FormData>(action, {
    error: initialError,
  });

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <Link href="/" className="mb-8 flex" aria-label="CitePlex home">
        <Logo markClassName="h-9 w-9" wordmarkClassName="text-2xl" className="gap-2.5" />
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        {mode === "signin"
          ? "Sign in to access your saved citations and projects."
          : "Start saving and organizing citations in seconds."}
      </p>

      <form className="mt-7 space-y-3">
        <input type="hidden" name="redirect" value={redirect} />
        <GoogleButton redirect={redirect} />
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="redirect" value={redirect} />

        {mode === "signup" && (
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-[12px] font-medium text-foreground">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-foreground/40"
            />
          </div>
        )}

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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-[12px] font-medium text-foreground">
              Password
            </label>
            {mode === "signin" && (
              <Link href="/forgot-password" className="text-[12px] font-medium text-muted-foreground hover:text-foreground hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-foreground/40"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-accent px-3 py-2 text-[12px] text-accent-foreground">
            {state.message}
          </p>
        )}

        <div className="pt-1">
          <SubmitButton label={mode === "signin" ? "Sign in" : "Create account"} />
        </div>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
