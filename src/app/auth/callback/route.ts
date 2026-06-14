import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * OAuth + email-confirmation callback. Supabase redirects here with a `code`
 * which we exchange for a session, then bounce the user to their destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Log the auth event and welcome genuinely-new users (e.g. Google sign-up).
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: prior } = await supabase
            .from("activity_log")
            .select("id")
            .eq("user_id", user.id)
            .in("action", ["auth.signup", "auth.signin"])
            .limit(1);
          const isFirst = !prior || prior.length === 0;
          await supabase.from("activity_log").insert({
            user_id: user.id,
            action: isFirst ? "auth.signup" : "auth.signin",
            metadata: { method: "oauth" },
          });
          if (isFirst && user.email) {
            const meta = user.user_metadata as { full_name?: string; name?: string } | null;
            await sendWelcomeEmail(user.email, meta?.full_name || meta?.name).catch(() => {});
          }
        }
      } catch {
        // Non-fatal — never block sign-in on logging/email.
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
