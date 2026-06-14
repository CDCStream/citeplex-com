// Dodo Payments helpers — client factory, config guard, and the mapping
// between our plans/billing cycles and Dodo product IDs (set in .env.local).

import DodoPayments from "dodopayments";
import type { Plan } from "@/lib/supabase/types";

export type Billing = "monthly" | "annual";

const PLACEHOLDER = /your_|_here|^$/i;

export function isDodoConfigured(): boolean {
  const key = process.env.DODO_PAYMENTS_API_KEY || "";
  return !!key && !PLACEHOLDER.test(key);
}

function environment(): "test_mode" | "live_mode" {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";
}

let client: DodoPayments | null = null;
export function getDodoClient(): DodoPayments {
  if (!client) {
    client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY,
      environment: environment(),
    });
  }
  return client;
}

/** Product ID for a given plan + billing cycle, from env. */
export function productIdFor(plan: Exclude<Plan, "free">, billing: Billing): string | undefined {
  const map: Record<string, string | undefined> = {
    "pro:monthly": process.env.DODO_PRODUCT_PRO_MONTHLY,
    "pro:annual": process.env.DODO_PRODUCT_PRO_ANNUAL,
    "team:monthly": process.env.DODO_PRODUCT_TEAM_MONTHLY,
    "team:annual": process.env.DODO_PRODUCT_TEAM_ANNUAL,
  };
  return map[`${plan}:${billing}`];
}

/** Reverse lookup: which plan does a Dodo product ID grant? */
export function planForProductId(productId: string): Exclude<Plan, "free"> | null {
  const pro = [process.env.DODO_PRODUCT_PRO_MONTHLY, process.env.DODO_PRODUCT_PRO_ANNUAL];
  const team = [process.env.DODO_PRODUCT_TEAM_MONTHLY, process.env.DODO_PRODUCT_TEAM_ANNUAL];
  if (team.includes(productId)) return "team";
  if (pro.includes(productId)) return "pro";
  return null;
}
