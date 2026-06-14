import type { NextRequest } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { planForProductId } from "@/lib/dodo";
import type { Plan } from "@/lib/supabase/types";

// Minimal shape of the subscription payload we rely on (the adaptor validates
// the full schema with Zod before calling us).
interface SubscriptionData {
  subscription_id?: string;
  product_id?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  customer?: { customer_id?: string; email?: string };
  next_billing_date?: string | Date | null;
  expires_at?: string | Date | null;
}

function toIso(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/** Resolve which profile this subscription belongs to. */
async function findUserId(
  admin: ReturnType<typeof createAdminClient>,
  data: SubscriptionData
): Promise<string | null> {
  const metaId = data.metadata?.user_id;
  if (typeof metaId === "string" && metaId) return metaId;

  // Fallbacks: existing dodo customer, then email match.
  const customerId = data.customer?.customer_id;
  if (customerId) {
    const { data: byCustomer } = await admin
      .from("profiles")
      .select("id")
      .eq("dodo_customer_id", customerId)
      .maybeSingle();
    if (byCustomer?.id) return byCustomer.id;
  }
  const email = data.customer?.email;
  if (email) {
    const { data: byEmail } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (byEmail?.id) return byEmail.id;
  }
  return null;
}

type Mode = "activate" | "status" | "revoke";

/** Apply a subscription state to the user's profile. */
async function applySubscription(data: SubscriptionData, mode: Mode) {
  const admin = createAdminClient();
  const userId = await findUserId(admin, data);
  if (!userId) {
    console.error("[dodo webhook] could not match subscription to a user", data.subscription_id);
    return;
  }

  const update: Record<string, unknown> = {
    plan_status: data.status ?? mode,
    dodo_customer_id: data.customer?.customer_id ?? null,
    dodo_subscription_id: data.subscription_id ?? null,
  };

  if (mode === "activate") {
    const grantedPlan = data.product_id ? planForProductId(data.product_id) : null;
    update.plan = (grantedPlan ?? "pro") as Plan;
    update.plan_renews_at = toIso(data.next_billing_date);
  } else if (mode === "revoke") {
    // Subscription truly ended — drop back to free.
    update.plan = "free" as Plan;
    update.plan_renews_at = null;
  }
  // mode === "status": keep plan/renews_at (user paid through the period),
  // just record the new status (on_hold / failed / cancelled-at-period-end).

  await admin.from("profiles").update(update).eq("id", userId);
}

function dataOf(payload: unknown): SubscriptionData {
  return ((payload as { data?: SubscriptionData })?.data ?? {}) as SubscriptionData;
}

const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_SECRET || "";
const PLACEHOLDER = /your_|_here|^$/i;

// Build the adaptor handler only when a real secret exists — passing an empty
// key throws at construction, which would 500 the route before payments are set up.
const handler =
  WEBHOOK_SECRET && !PLACEHOLDER.test(WEBHOOK_SECRET)
    ? Webhooks({
        webhookKey: WEBHOOK_SECRET,
        onSubscriptionActive: async (p) => applySubscription(dataOf(p), "activate"),
        onSubscriptionRenewed: async (p) => applySubscription(dataOf(p), "activate"),
        onSubscriptionPlanChanged: async (p) => applySubscription(dataOf(p), "activate"),
        onSubscriptionOnHold: async (p) => applySubscription(dataOf(p), "status"),
        onSubscriptionFailed: async (p) => applySubscription(dataOf(p), "status"),
        onSubscriptionCancelled: async (p) => applySubscription(dataOf(p), "status"),
        onSubscriptionExpired: async (p) => applySubscription(dataOf(p), "revoke"),
      })
    : null;

export async function POST(req: NextRequest) {
  if (!handler) {
    return new Response("Webhooks not configured", { status: 503 });
  }
  return handler(req);
}
