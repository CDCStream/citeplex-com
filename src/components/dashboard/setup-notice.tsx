import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";

export function SetupNotice() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <Database className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-lg font-bold tracking-tight">Accounts not connected yet</h1>
      <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
        The dashboard, sign-in, and saved citations need Supabase credentials.
        Add your project URL and keys to <code className="rounded bg-muted px-1 py-0.5">.env.local</code>,
        run the SQL migration, then restart the dev server.
      </p>
      <Link
        href="/generate"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-80"
      >
        Generate citations
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
