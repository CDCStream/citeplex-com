"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  Sparkles,
  Plus,
  Activity as ActivityIcon,
  FileText,
  Trash2,
  FolderPlus,
  LogIn,
  Crown,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Citation, Project, ActivityLog, Plan, ActivityAction } from "@/lib/supabase/types";
import { ProjectsPanel } from "@/components/dashboard/projects-panel";
import { CitationsList } from "@/components/dashboard/citations-list";
import { ExportBar } from "@/components/dashboard/export-bar";

interface DashboardShellProps {
  userName: string;
  plan: Plan;
  used: number;
  limit: number;
  citations: Citation[];
  projects: Project[];
  activity: ActivityLog[];
}

function UsageMeter({ plan, used, limit }: { plan: Plan; used: number; limit: number }) {
  if (plan !== "free") {
    return (
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-500" />
          <span className="text-[13px] font-semibold capitalize">{plan} plan</span>
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">Unlimited saved citations.</p>
        <a
          href="/api/billing"
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Manage billing
        </a>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((used / limit) * 100));
  const near = pct >= 80;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Monthly usage
        </span>
        <span className="text-[12px] font-medium tabular-nums">
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", near ? "bg-amber-500" : "bg-foreground")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <Link
        href="/pricing"
        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-600 hover:underline"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Upgrade for unlimited
      </Link>
    </div>
  );
}

const ACTION_META: Record<ActivityAction, { label: string; icon: React.ReactNode }> = {
  "citation.created": { label: "Saved a citation", icon: <FileText className="h-3.5 w-3.5" /> },
  "citation.deleted": { label: "Deleted a citation", icon: <Trash2 className="h-3.5 w-3.5" /> },
  "citation.exported": { label: "Exported a citation", icon: <FileText className="h-3.5 w-3.5" /> },
  "project.created": { label: "Created a project", icon: <FolderPlus className="h-3.5 w-3.5" /> },
  "project.deleted": { label: "Deleted a project", icon: <Trash2 className="h-3.5 w-3.5" /> },
  "auth.signin": { label: "Signed in", icon: <LogIn className="h-3.5 w-3.5" /> },
  "auth.signup": { label: "Created account", icon: <Sparkles className="h-3.5 w-3.5" /> },
  "plan.upgraded": { label: "Upgraded plan", icon: <Crown className="h-3.5 w-3.5" /> },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function ActivityFeed({ activity }: { activity: ActivityLog[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        <ActivityIcon className="h-3.5 w-3.5" />
        Recent activity
      </h2>
      {activity.length === 0 ? (
        <p className="px-1 text-[12px] text-muted-foreground">No activity yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {activity.map((a) => {
            const meta = ACTION_META[a.action] ?? {
              label: a.action,
              icon: <ActivityIcon className="h-3.5 w-3.5" />,
            };
            return (
              <li key={a.id} className="flex items-start gap-2.5 px-1">
                <span className="mt-0.5 text-muted-foreground">{meta.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] text-foreground">{meta.label}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(a.created_at)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DashboardShell({
  userName,
  plan,
  used,
  limit,
  citations,
  projects,
  activity,
}: DashboardShellProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Celebrate a successful upgrade once the user returns from checkout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "1") {
      toast.success("Welcome to Pro! Your upgrade is being activated.");
      params.delete("upgraded");
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
  }, []);

  const filtered = useMemo(() => {
    if (selected === null) return citations;
    if (selected === "none") return citations.filter((c) => !c.project_id);
    return citations.filter((c) => c.project_id === selected);
  }, [citations, selected]);

  const heading =
    selected === null
      ? "All citations"
      : selected === "none"
      ? "Unfiled"
      : projects.find((p) => p.id === selected)?.name ?? "Citations";

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
      <Toaster position="bottom-right" />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {citations.length} saved {citations.length === 1 ? "citation" : "citations"}
            {projects.length > 0 && ` across ${projects.length} ${projects.length === 1 ? "project" : "projects"}`}.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-80 sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          New citation
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          <UsageMeter plan={plan} used={used} limit={limit} />
          <ProjectsPanel
            projects={projects}
            citations={citations}
            selected={selected}
            onSelect={setSelected}
          />
          <ActivityFeed activity={activity} />
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold">{heading}</h2>
              <span className="text-[12px] text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
              </span>
            </div>
            <ExportBar citations={filtered} plan={plan} scopeName={heading} />
          </div>
          <CitationsList citations={filtered} projects={projects} />
        </section>
      </div>
    </div>
  );
}
