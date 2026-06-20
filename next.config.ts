import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry org/project for source-map uploads (set in env on the build host).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps when an auth token is available; otherwise skip
  // silently so local/CI builds without the token still succeed.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Route Sentry requests through our own domain to dodge ad-blockers.
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
});
