import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getDodoClient, isDodoConfigured, productIdFor, type Billing } from "@/lib/dodo";
import type { Plan } from "@/lib/supabase/types";

function origin(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
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

  try {
    const session = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      // Reuse the existing Dodo customer if we've seen them before.
      customer: profile?.dodo_customer_id
        ? { customer_id: profile.dodo_customer_id }
        : { email: user.email ?? "", name: profile?.full_name ?? user.email ?? "" },
      metadata: { user_id: user.id, plan: planParam },
      return_url: `${site}/dashboard?upgraded=1`,
    });

    if (!session.checkout_url) {
      return NextResponse.redirect(`${site}/pricing?error=checkout_failed`);
    }
    return NextResponse.redirect(session.checkout_url);
  } catch {
    return NextResponse.redirect(`${site}/pricing?error=checkout_failed`);
  }
}
