import type { Plan } from "@/lib/supabase/types";

/**
 * Free-tier limits for the plagiarism checker. Plagiarism is the only tool
 * with a real per-scan API cost (≈2 credits/word), so the free tier is a
 * deliberately small teaser; full-paper scans are a Pro feature.
 */
export const FREE_PLAGIARISM = {
  wordLimit: 300,
  scansPerDay: 1,
} as const;

/** Pro plagiarism allowance (enforced once payments + auth gating land). */
export const PRO_PLAGIARISM = {
  wordLimit: 7000,
  scansPerMonth: 25,
} as const;

/**
 * Daily AI request caps. Every AI generation (paraphrase, summarize, thesis,
 * outline, hook, conclusion) spends OpenAI tokens, so we cap requests per day
 * to prevent runaway cost / abuse. The free cap is keyed by user id when signed
 * in, otherwise by IP; Pro & Team get a much higher ceiling.
 */
export const FREE_AI = {
  requestsPerDay: 15,
} as const;

export const PRO_AI = {
  requestsPerDay: 300,
} as const;

export interface PlanDef {
  id: Plan;
  name: string;
  tagline: string;
  monthly: number; // USD / month
  annual: number; // USD / year (0 = free)
  cta: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

/** Single source of truth for pricing + feature gating. */
export const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For occasional citations",
    monthly: 0,
    annual: 0,
    cta: "Get started",
    features: [
      "Unlimited generate & copy",
      "All 11 citation styles",
      "All source types",
      "Auto-fill from URL, DOI & ISBN",
      "Save up to 20 citations / month",
      "Up to 2 projects",
      `Plagiarism check: ${FREE_PLAGIARISM.scansPerDay}/day, up to ${FREE_PLAGIARISM.wordLimit} words`,
    ],
    limitations: ["No Word / BibTeX / RIS export", "No citation history"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For students who cite daily",
    monthly: 9.99,
    annual: 79,
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      "Everything in Free, plus:",
      "Unlimited saved citations",
      "Unlimited projects",
      `Plagiarism: ${PRO_PLAGIARISM.scansPerMonth} scans/mo, up to ${PRO_PLAGIARISM.wordLimit.toLocaleString()} words`,
      "Export to Word, BibTeX & RIS",
      "Full citation history",
      "Priority support",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "For research groups & law firms",
    monthly: 24.99,
    annual: 199,
    cta: "Start Team plan",
    features: [
      "Everything in Pro, plus:",
      "Up to 10 team members",
      "Shared project libraries",
      "Custom citation templates",
      "Admin dashboard",
      "API access",
    ],
  },
];

/** Percentage saved by paying annually vs 12× monthly. */
export function annualSavingsPct(plan: PlanDef): number {
  if (!plan.monthly || !plan.annual) return 0;
  const fullYear = plan.monthly * 12;
  return Math.round(((fullYear - plan.annual) / fullYear) * 100);
}
