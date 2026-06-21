import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { COMPETITORS } from "@/lib/competitors";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

export const metadata: Metadata = {
  title: "CitePlex vs EasyBib, Citation Machine, Scribbr & More | CitePlex",
  description:
    "See how CitePlex compares to EasyBib, Citation Machine, Scribbr, MyBib, BibMe, and ZoteroBib — a free, ad-free citation generator with 11 styles, Bluebook, and AI writing tools.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "CitePlex vs the other citation generators",
    description: "Free, ad-free, 11 styles, Bluebook legal support, and AI writing tools.",
    type: "website",
    url: `${BASE}/compare`,
  },
};

const HIGHLIGHTS = [
  "All 11 citation styles free — no paywall on APA",
  "Zero ads, no forced sign-up",
  "Bluebook 22nd ed. for legal citations",
  "AI essay tools (thesis, outline, paraphrase, summarize)",
];

export default function CompareHubPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How CitePlex compares
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Honest, side-by-side comparisons with the most popular citation tools — so you can
              pick what actually fits your work.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COMPETITORS.map((c) => (
              <Link
                key={c.slug}
                href={`/vs/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight">CitePlex vs {c.name}</h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{c.blurb}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-lg font-bold">See for yourself</h3>
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
      </main>

      <Footer />
    </div>
  );
}
