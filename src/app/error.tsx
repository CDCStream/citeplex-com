"use client";

// Route-segment error boundary — keeps the app shell intact and reports the
// error to Sentry while letting the user retry.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          Error
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          An unexpected error occurred. Our team has been notified — please try
          again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-all hover:opacity-80"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
