"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { FREE_MONTHLY_LIMIT, FREE_PROJECT_LIMIT } from "@/lib/supabase/types";
import type { CitationStyle, SourceType, SourceData } from "@/lib/citation-styles";

export interface SaveCitationInput {
  style: CitationStyle;
  sourceType: SourceType;
  sourceData: SourceData;
  formatted: string;
  inText?: string;
  title?: string;
  projectId?: string | null;
}

export interface SaveResult {
  ok: boolean;
  error?: string;
  limitReached?: boolean;
  id?: string;
}

/** Persists a citation, logs the activity, and enforces the free-tier limit. */
export async function saveCitation(input: SaveCitationInput): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authenticated." };

  // Check plan + usage before inserting.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, citation_count, citation_count_reset_at")
    .eq("id", user.id)
    .single();

  if (profile && profile.plan === "free") {
    const resetPassed = new Date(profile.citation_count_reset_at) <= new Date();
    const used = resetPassed ? 0 : profile.citation_count;
    if (used >= FREE_MONTHLY_LIMIT) {
      return {
        ok: false,
        limitReached: true,
        error: `Free plan limit of ${FREE_MONTHLY_LIMIT} saved citations/month reached. Upgrade to Pro for unlimited.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("citations")
    .insert({
      user_id: user.id,
      project_id: input.projectId ?? null,
      style: input.style,
      source_type: input.sourceType,
      source_data: input.sourceData,
      formatted: input.formatted,
      in_text: input.inText ?? null,
      title: input.title ?? input.sourceData.title ?? input.sourceData.caseName ?? null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase.rpc("increment_citation_count", { p_user_id: user.id });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "citation.created",
    metadata: { style: input.style, source_type: input.sourceType, citation_id: data.id },
  });

  revalidatePath("/dashboard");
  return { ok: true, id: data.id as string };
}

export async function deleteCitation(id: string): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase.from("citations").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "citation.deleted",
    metadata: { citation_id: id },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createProject(name: string, color?: string): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Project name is required." };

  // Enforce free-tier project cap.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (profile?.plan === "free") {
    const { count } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) >= FREE_PROJECT_LIMIT) {
      return {
        ok: false,
        limitReached: true,
        error: `Free plan is limited to ${FREE_PROJECT_LIMIT} projects. Upgrade to Pro for unlimited.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: user.id, name: trimmed, color: color ?? "#f59e0b" })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "project.created",
    metadata: { project_id: data.id, name: trimmed },
  });

  revalidatePath("/dashboard");
  return { ok: true, id: data.id as string };
}

export async function deleteProject(id: string): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "project.deleted",
    metadata: { project_id: id },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

/** Records an export in the activity log. Export itself happens client-side. */
export async function logCitationExport(format: string, count: number): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "citation.exported",
    metadata: { format, count },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function moveCitationToProject(
  citationId: string,
  projectId: string | null
): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase
    .from("citations")
    .update({ project_id: projectId })
    .eq("id", citationId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}
