/**
 * True only when real Supabase credentials are present. Until the user adds
 * their project URL + anon key to .env.local, the app runs in a degraded
 * "logged-out" mode instead of crashing on every request.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      url.startsWith("http") &&
      !url.includes("your_supabase") &&
      key.length > 20 &&
      !key.includes("your_supabase")
  );
}
