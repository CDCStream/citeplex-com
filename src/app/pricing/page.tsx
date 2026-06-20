"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, GraduationCap, Building2 } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PLANS, annualSavingsPct, type PlanDef } from "@/lib/plans";
import { TOOL_GROUPS } from "@/lib/tools-nav";
import { cn } from "@/lib/utils";

function TagBadge({ tag }: { tag: string }) {
  const isPro = tag === "Pro";
  return (
    <span
      className={cn(
        "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isPro
          ? "bg-primary/10 text-primary"
          : "bg-amber-400/20 text-amber-600"
      )}
    >
      {tag}
    </span>
  );
}

const ICONS = {
  free: GraduationCap,
  pro: Sparkles,
  team: Building2,
} as const;

function priceLabel(plan: PlanDef, billing: "monthly" | "annual") {
  if (plan.monthly === 0) return { amount: "$0", period: "forever" };
  if (billing === "annual") {
    const perMonth = (plan.annual / 12).toFixed(2);
    return { amount: `$${perMonth}`, period: "/mo, billed annually" };
  }
  return { amount: `$${plan.monthly}`, period: "/month" };
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                No ads. No hidden fees. Generate and copy citations free, forever —
                upgrade when you need to save and export.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="mb-14 flex items-center justify-center gap-3">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                  billing === "monthly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                  billing === "annual" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                  Save {annualSavingsPct(PLANS[1])}%
                </span>
              </button>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = ICONS[plan.id];
                const { amount, period } = priceLabel(plan, billing);
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col rounded-2xl border-2 bg-background p-8 transition-all hover:shadow-lg",
                      plan.popular ? "border-primary ring-1 ring-primary/20" : "border-border"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          <Sparkles className="h-3 w-3" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold">{plan.name}</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                    </div>

                    <div className="mb-6 flex items-end gap-1">
                      <span className="text-4xl font-bold">{amount}</span>
                      <span className="mb-1 text-sm text-muted-foreground">{period}</span>
                    </div>

                    <Link
                      href={plan.id === "free" ? "/signup" : `/api/checkout?plan=${plan.id}&billing=${billing}`}
                      className={cn(
                        "flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      )}
                    >
                      {plan.cta}
                    </Link>

                    <div className="mt-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations?.map((limitation) => (
                        <div key={limitation} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                            <div className="h-1 w-3 rounded-full bg-muted-foreground/30" />
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Every tool included */}
            <div className="mx-auto mt-24 max-w-5xl">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Every tool, included
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  One account unlocks the whole writing toolkit. Most tools are free to use —
                  <TagBadge tag="AI" /> tools have a generous daily limit, and
                  <TagBadge tag="Pro" /> tools unlock with a paid plan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {TOOL_GROUPS.map((group) => (
                  <div
                    key={group.label}
                    className="rounded-2xl border border-border bg-background p-6"
                  >
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </h3>
                    <ul className="space-y-3.5">
                      {group.tools.map((tool) => (
                        <li key={tool.href}>
                          <Link href={tool.href} className="group block">
                            <span className="flex items-center text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {tool.name}
                              {tool.tag && <TagBadge tag={tool.tag} />}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {tool.desc}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mx-auto mt-20 max-w-3xl">
              <h2 className="mb-10 text-center text-2xl font-bold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {[
                  {
                    q: "Is generating citations really free?",
                    a: "Yes — generating and copying citations is unlimited and free, forever, with no account required. You only need a paid plan to save unlimited citations and export to Word, BibTeX, or RIS.",
                  },
                  {
                    q: "What do I get on the free account?",
                    a: "Auto-fill from URL/DOI/ISBN, all 11 citation styles, all source types, plus saving up to 20 citations a month across 2 projects. You also get the full writing toolkit — grammar, punctuation, paraphrasing, summarizing, thesis, outline, hook and conclusion tools. No ads, ever.",
                  },
                  {
                    q: "Can I cancel anytime?",
                    a: "Absolutely. Cancel in one click from your dashboard. No hidden cancellation flow, no continued billing after cancellation.",
                  },
                  {
                    q: "Do you support Bluebook for legal citations?",
                    a: "Yes — Bluebook 22nd Edition for cases, statutes, books, and journal articles, in both practitioner and law-review formats.",
                  },
                  {
                    q: "How accurate are the citations?",
                    a: "Our engine is rule-based and follows each style guide precisely. We still recommend reviewing citations before final submission — no tool is perfect for every edge case.",
                  },
                ].map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-border bg-background p-6">
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
