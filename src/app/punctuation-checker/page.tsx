import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { GrammarChecker } from "@/components/tools/grammar-checker";

const FAQS = [
  {
    q: "What does a punctuation checker do?",
    a: "A punctuation checker scans your writing for misplaced or missing punctuation — commas, periods, apostrophes, quotation marks, semicolons, hyphens, and spacing — and suggests fixes you can apply in one click.",
  },
  {
    q: "Is the punctuation checker free?",
    a: "Yes — it's completely free and ad-free. Paste up to 10,000 characters and check as often as you like.",
  },
  {
    q: "What's the difference between this and the grammar checker?",
    a: "The punctuation checker focuses only on punctuation and spacing issues, so the suggestions stay clean and targeted. Use the full grammar checker when you also want spelling, grammar, and style feedback.",
  },
  {
    q: "Does it fix comma splices and missing commas?",
    a: "Yes. It flags missing commas, comma splices, run-on punctuation, and extra spaces, then offers corrections you can accept instantly.",
  },
  {
    q: "Is it good for essays and academic writing?",
    a: "Absolutely — clean punctuation makes academic writing clearer and more professional. When you quote a source, remember to cite it with our citation generator.",
  },
];

export const metadata: Metadata = {
  title: "Free Punctuation Checker — Fix Commas & Punctuation Online | CitePlex",
  description:
    "Free online punctuation checker. Catch missing commas, misplaced periods, apostrophes, quotation marks, and spacing errors — and fix them in one click. No ads.",
  keywords: [
    "punctuation checker",
    "punctuation corrector",
    "comma checker",
    "check punctuation",
    "punctuation checker free",
    "comma fixer",
  ],
  alternates: { canonical: "/punctuation-checker" },
  openGraph: {
    title: "Free Punctuation Checker — Fix Commas & Punctuation Online",
    description: "Catch and fix punctuation and spacing errors in one click. Free and ad-free.",
    type: "website",
  },
};

export default function PunctuationCheckerPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Punctuation Checker</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Catch missing commas, misplaced periods, stray apostrophes, and spacing slips — then
              fix them in one click. Free, ad-free, and built for essays and papers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <GrammarChecker
            focus="punctuation"
            placeholder="Paste your text here to check punctuation…"
            emptyHint="Your punctuation suggestions will appear here after you run a check."
            cleanMessage="No punctuation issues found — looks clean!"
          />
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-lg font-bold">Need full grammar feedback?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Check spelling, grammar, and style — not just punctuation — with our free grammar checker.
            </p>
            <Link
              href="/grammar-checker"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
            >
              Open the grammar checker
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
