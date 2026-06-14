"use client";

// Top-level error boundary — replaces the root layout when a render error
// bubbles all the way up. Reports to Sentry and offers a recovery action.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#18181b",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 420 }}>
          <p style={{ fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a1a1aa", margin: 0 }}>
            Error
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0.75rem 0 0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, color: "#71717a", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 9999,
              background: "#18181b",
              color: "#ffffff",
              border: "none",
              padding: "0.625rem 1.25rem",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
