// Sentry — browser SDK init. Runs in the user's browser.
// DSN comes from env; when it's empty Sentry stays inert (no errors), so this
// is safe to ship before the key is configured.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  // Tracing off in dev (Turbopack noise); light sampling in production.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 0 : 0.1,
  enableLogs: true,
  // Capture a replay on 10% of sessions and 100% of sessions with an error.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
