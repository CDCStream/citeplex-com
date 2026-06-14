"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/auth/actions";

export function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!configured) {
    return (
      <Link
        href="/generate"
        className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-80"
      >
        Start citing
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    );
  }

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />;
  }

  if (!email) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-80"
        >
          Start citing
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
        aria-label="Account menu"
      >
        <span className="text-[13px] font-semibold uppercase">
          {email[0] ?? <UserIcon className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-[12px] text-muted-foreground">Signed in as</p>
            <p className="truncate text-[13px] font-medium">{email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            Dashboard
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
