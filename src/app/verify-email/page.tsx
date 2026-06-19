import Link from "next/link";
import { redirect } from "next/navigation";
import { MailCheck, ArrowRight } from "lucide-react";
import { AuthAside } from "@/components/auth/auth-aside";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Confirm your email — CitePlex" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const { email } = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex" aria-label="CitePlex home">
            <Logo markClassName="h-9 w-9" wordmarkClassName="text-2xl" className="gap-2.5" />
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <MailCheck className="h-6 w-6 text-accent-foreground" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight">Check your inbox</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            We&apos;ve sent a confirmation link to{" "}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              "your email address"
            )}
            . Click the link to activate your account, then sign in.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-[12px] leading-relaxed text-muted-foreground">
            Didn&apos;t get it? Check your spam folder, or wait a minute — delivery can
            take a moment. The link expires after a while for your security.
          </div>

          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-all hover:opacity-80"
          >
            Go to sign in
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            Wrong address?{" "}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              Sign up again
            </Link>
          </p>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
