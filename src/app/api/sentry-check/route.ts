import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

// TEMPORARY: verifies live Sentry error capture. Delete after confirming the
// event shows up in the Sentry Issues dashboard.
export async function GET() {
  const err = new Error("CitePlex Sentry live check — " + new Date().toISOString());
  Sentry.captureException(err);
  await Sentry.flush(2000);
  throw err;
}
