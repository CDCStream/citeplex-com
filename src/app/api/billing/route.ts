import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getDodoClient, isDodoConfigured } from "@/lib/dodo";

function origin(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

// GET /api/billing — opens the Dodo customer portal for the signed-in user
// (manage / cancel subscription, update payment method).
export async function GET(req: NextRequest) {
  const site = origin(req);

  if (!isDodoConfigured()) {
    return NextResponse.redirect(`${site}/dashboard?error=payments_unavailable`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${site}/login?redirect=/api/billing`);
  }

  const profile = await getProfile();
  if (!profile?.dodo_customer_id) {
    // No subscription yet — send them to pricing to start one.
    return NextResponse.redirect(`${site}/pricing`);
  }

  try {
    const session = await getDodoClient().customers.customerPortal.create(
      profile.dodo_customer_id,
      { return_url: `${site}/dashboard` }
    );
    return NextResponse.redirect(session.link);
  } catch {
    return NextResponse.redirect(`${site}/dashboard?error=portal_failed`);
  }
}
