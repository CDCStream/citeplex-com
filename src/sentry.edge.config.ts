// Sentry — Edge runtime SDK init. Runs in middleware and edge routes.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 0 : 0.1,
  enableLogs: true,
});
