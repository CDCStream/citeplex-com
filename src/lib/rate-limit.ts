// Lightweight in-memory daily rate limiter.
//
// Note: state lives per server instance, so on serverless it resets on cold
// starts and is not shared across regions. That's fine as a soft abuse guard
// for free-tier teasers. For hard enforcement at scale, back this with Redis
// (e.g. Upstash) keyed the same way.

interface Bucket {
  count: number;
  resetAt: number; // epoch ms when the window resets
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

/** Allows `limit` hits per rolling 24h window for a given key. */
export function dailyLimit(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + DAY;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, limit, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, limit, resetAt: existing.resetAt };
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
