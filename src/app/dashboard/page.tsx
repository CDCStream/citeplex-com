import { redirect } from "next/navigation";
import { Header } from "@/components/ui/header";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FREE_MONTHLY_LIMIT } from "@/lib/supabase/types";
import type { Citation, Project, Profile, ActivityLog } from "@/lib/supabase/types";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SetupNotice } from "@/components/dashboard/setup-notice";

export const metadata = { title: "Dashboard — CitePlex" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1 bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <SetupNotice />
          </div>
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const [profileRes, citationsRes, projectsRes, activityRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("citations").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const profile = profileRes.data as Profile | null;
  const citations = (citationsRes.data as Citation[]) ?? [];
  const projects = (projectsRes.data as Project[]) ?? [];
  const activity = (activityRes.data as ActivityLog[]) ?? [];

  const resetPassed = profile
    ? new Date(profile.citation_count_reset_at) <= new Date()
    : true;
  const used = resetPassed ? 0 : profile?.citation_count ?? 0;

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <DashboardShell
          userName={profile?.full_name || user.email || "there"}
          plan={profile?.plan ?? "free"}
          used={used}
          limit={FREE_MONTHLY_LIMIT}
          citations={citations}
          projects={projects}
          activity={activity}
        />
      </main>
    </div>
  );
}
