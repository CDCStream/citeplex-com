import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";
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
  if (!c) return { title: "Compare — CitePlex" };
  const title = `CitePlex vs ${c.name} — Free, Ad-Free Alternative (2026) | CitePlex`;
  return {
    title,
    description: c.metaDescription,
    keywords: [
      `citeplex vs ${c.name.toLowerCase()}`,
      `${c.name.toLowerCase()} alternative`,
      `free ${c.name.toLowerCase()} alternative`,
      `${c.name.toLowerCase()} vs citeplex`,
      "free citation generator",
    ],
    alternates: { canonical: `/vs/${c.slug}` },
    openGraph: { title, description: c.metaDescription, type: "article", url: `${BASE}/vs/${c.slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const c = getCompetitor(competitor);
  if (!c) notFound();

  const others = COMPETITORS.filter((x) => x.slug !== c.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Compare", item: `${BASE}/compare` },
          { "@type": "ListItem", position: 2, name: `CitePlex vs ${c.name}`, item: `${BASE}/vs/${c.slug}` },
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
          <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8 lg:py-16">
            <div className="mb-4 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Link href="/compare" className="hover:text-foreground">
                Compare
              </Link>
              <span>/</span>
              <span>CitePlex vs {c.name}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              CitePlex vs {c.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.blurb}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
              >
                Try CitePlex free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-6 pt-12 lg:px-8">
          <p className="text-[15px] leading-relaxed text-muted-foreground">{c.intro}</p>
        </section>

        {/* Why CitePlex */}
        <section className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Why choose CitePlex over {c.name}
          </h2>
          <ul className="mt-5 space-y-3">
            {c.whyCiteplex.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-[15px]">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Comparison table */}
        <section className="mx-auto max-w-3xl px-6 py-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold text-foreground">CitePlex</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">{c.name}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td
                      className={`px-4 py-3 ${
                        row.win === "citeplex" ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="inline-flex items-start gap-1.5">
                        {row.win === "citeplex" && (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        )}
                        {row.citeplex}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        row.win === "competitor" ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="inline-flex items-start gap-1.5">
                        {row.win === "competitor" ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                        )}
                        {row.competitor}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            Comparison based on publicly available information as of 2026. Features and pricing for{" "}
            {c.name} may change — check their site for the latest.
          </p>
        </section>

        {/* When competitor is a fair pick */}
        <section className="mx-auto max-w-3xl px-6 py-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="text-lg font-bold tracking-tight">When {c.name} might be the better fit</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{c.whenCompetitor}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-4">
            {c.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-10 lg:px-8">
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-lg font-bold">Switch to a cleaner citation tool</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Generate accurate citations in 11 styles — free, no ads, no sign-up required.
            </p>
            <Link
              href="/generate"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
            >
              Start citing — free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Other comparisons */}
        <section className="mx-auto max-w-3xl px-6 pb-16 lg:px-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            More comparisons
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/vs/${o.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40"
              >
                CitePlex vs {o.name}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
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
