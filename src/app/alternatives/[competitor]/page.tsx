import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Star } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { COMPETITORS, getCompetitor } from "@/lib/competitors";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  const c = getCompetitor(competitor);
  if (!c) return { title: "Alternatives — CitePlex" };
  const title = `Best ${c.name} Alternatives in 2026 (Free & Ad-Free) | CitePlex`;
  const description = `Looking for a ${c.name} alternative? Compare the best free and ad-free citation tools in 2026 — including CitePlex, with 11 styles, Bluebook, and AI writing tools.`;
  return {
    title,
    description,
    keywords: [
      `${c.name.toLowerCase()} alternative`,
      `${c.name.toLowerCase()} alternatives`,
      `best ${c.name.toLowerCase()} alternative`,
      `free ${c.name.toLowerCase()} alternative`,
      "free citation generator",
    ],
    alternates: { canonical: `/alternatives/${c.slug}` },
    openGraph: { title, description, type: "article", url: `${BASE}/alternatives/${c.slug}` },
  };
}

const CITEPLEX_REASONS = [
  "All 11 citation styles free (incl. Bluebook, IEEE, AMA)",
  "No ads, no forced sign-up",
  "AI essay tools — thesis, outline, paraphrase, summarize",
  "Export to Word, BibTeX & RIS (Pro)",
];

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const c = getCompetitor(competitor);
  if (!c) notFound();

  // CitePlex is #1; fill the rest of the list with other real tools.
  const others = COMPETITORS.filter((x) => x.slug !== c.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: `Best ${c.name} alternatives in 2026`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "CitePlex", url: `${BASE}/` },
          ...others.map((o, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: o.name,
          })),
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Compare", item: `${BASE}/compare` },
          { "@type": "ListItem", position: 2, name: `${c.name} alternatives`, item: `${BASE}/alternatives/${c.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8 lg:py-16">
            <div className="mb-4 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Link href="/compare" className="hover:text-foreground">
                Compare
              </Link>
              <span>/</span>
              <span>{c.name} alternatives</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Best {c.name} alternatives in 2026
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {c.summary} If you&apos;re looking for a {c.name} alternative, here are the best
              citation tools to consider — starting with our top pick.
            </p>
          </div>
        </section>

        {/* #1 CitePlex */}
        <section className="mx-auto max-w-3xl px-6 pt-12 lg:px-8">
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10 p-7">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-emerald-600">
              <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              Top pick
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">1. CitePlex</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              A free, ad-free citation and academic writing platform. The best all-round {c.name}{" "}
              alternative for students and researchers who want clean, accurate citations without
              ads or paywalls on the basics.
            </p>
            <ul className="mt-4 space-y-2.5">
              {CITEPLEX_REASONS.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[14px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
              >
                Try CitePlex free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/vs/${c.slug}`}
                className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See CitePlex vs {c.name} →
              </Link>
            </div>
          </div>
        </section>

        {/* Other alternatives */}
        <section className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
          <div className="space-y-4">
            {others.map((o, i) => (
              <div key={o.slug} className="rounded-2xl border border-border bg-background p-6">
                <h2 className="text-lg font-bold tracking-tight">
                  {i + 2}. {o.name}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{o.summary}</p>
                <Link
                  href={`/vs/${o.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  CitePlex vs {o.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* How to choose */}
        <section className="mx-auto max-w-3xl px-6 py-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="text-lg font-bold tracking-tight">How to choose a {c.name} alternative</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Check whether your citation style is free (many tools gate APA behind a paywall),
              whether the interface is ad-free, and whether you need extras like legal Bluebook
              citations, saved projects, or AI writing tools. CitePlex covers all of these for free;
              {" "}{c.name} may still suit you if {c.whenCompetitor.charAt(0).toLowerCase() + c.whenCompetitor.slice(1)}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {c.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      <Footer />
    </div>
  );
}
