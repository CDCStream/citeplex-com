import type { CitationStyle, SourceType, SourceData } from "@/lib/citation-styles";

export type Plan = "free" | "pro" | "team";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  citation_count: number;
  citation_count_reset_at: string;
  dodo_customer_id: string | null;
  dodo_subscription_id: string | null;
  plan_status: string | null;
  plan_renews_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Citation {
  id: string;
  user_id: string;
  project_id: string | null;
  style: CitationStyle;
  source_type: SourceType;
  source_data: SourceData;
  formatted: string;
  in_text: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivityAction =
  | "citation.created"
  | "citation.deleted"
  | "citation.exported"
  | "project.created"
  | "project.deleted"
  | "auth.signin"
  | "auth.signup"
  | "plan.upgraded";

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const FREE_MONTHLY_LIMIT = 20;
export const FREE_PROJECT_LIMIT = 2;
