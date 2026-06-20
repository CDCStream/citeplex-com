import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getDodoClient, isDodoConfigured, productIdFor, type Billing } from "@/lib/dodo";
import type { Plan } from "@/lib/supabase/types";

function origin(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

function checkoutErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { status?: number; message?: string; error?: { message?: string } };
    return [e.status, e.message, e.error?.message].filter(Boolean).join(" — ");
  }
  return String(err);
}

// GET /api/checkout?plan=pro&billing=annual
// Creates a Dodo checkout session for the signed-in user and redirects to it.
export async function GET(req: NextRequest) {
  const site = origin(req);
  const planParam = (req.nextUrl.searchParams.get("plan") || "pro") as Plan;
  const billing = (req.nextUrl.searchParams.get("billing") || "annual") as Billing;

  if (!isDodoConfigured()) {
    return NextResponse.redirect(`${site}/pricing?error=payments_unavailable`);
  }
  if (planParam === "free") {
    return NextResponse.redirect(`${site}/signup`);
  }

  // Must be signed in — bounce to login, then back to this checkout.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const next = `/api/checkout?plan=${planParam}&billing=${billing}`;
    return NextResponse.redirect(`${site}/login?redirect=${encodeURIComponent(next)}`);
  }

  const productId = productIdFor(planParam, billing);
  if (!productId) {
    return NextResponse.redirect(`${site}/pricing?error=unknown_plan`);
  }

  const profile = await getProfile();
  const returnUrl = `${site}/dashboard?upgraded=1`;
  const metadata = { user_id: user.id, plan: planParam };
  const newCustomer = {
    email: user.email ?? "",
    name: profile?.full_name ?? user.email ?? "",
  };

  const attempts: { label: string; customer: { customer_id: string } | typeof newCustomer }[] = [];
  if (profile?.dodo_customer_id) {
    attempts.push({
      label: "existing_customer",
      customer: { customer_id: profile.dodo_customer_id },
    });
  }
  attempts.push({ label: "new_customer", customer: newCustomer });

  let lastError = "unknown";
  for (const attempt of attempts) {
    try {
      const session = await getDodoClient().checkoutSessions.create({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: attempt.customer,
        metadata,
        return_url: returnUrl,
      });

      if (session.checkout_url) {
        return NextResponse.redirect(session.checkout_url);
      }
      lastError = "missing checkout_url";
    } catch (err) {
      lastError = checkoutErrorMessage(err);
      // Test-mode customer IDs are invalid in live_mode — retry with email only.
      if (attempt.label === "existing_customer") continue;
      Sentry.captureException(err, {
        extra: { plan: planParam, billing, productId, attempt: attempt.label },
      });
    }
  }

  Sentry.captureMessage(`Dodo checkout failed: ${lastError}`, {
    level: "error",
    extra: { plan: planParam, billing, productId, environment: process.env.DODO_PAYMENTS_ENVIRONMENT },
  });
  return NextResponse.redirect(`${site}/pricing?error=checkout_failed`);
}
