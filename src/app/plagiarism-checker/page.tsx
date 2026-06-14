import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PlagiarismChecker } from "@/components/tools/plagiarism-checker";
import { FREE_PLAGIARISM } from "@/lib/plans";

const FAQS = [
  {
    q: "How does the plagiarism checker work?",
    a: "Paste your text and we compare it against billions of web pages and published sources to find matching or near-matching passages. You get an overall similarity score plus a list of the sources your text matched.",
  },
  {
    q: "Is the plagiarism checker free?",
    a: `You can run ${FREE_PLAGIARISM.scansPerDay} free scan per day on up to ${FREE_PLAGIARISM.wordLimit} words. Unlike most tools, plagiarism scanning has a real per-scan cost, so full-length papers and higher limits are part of Pro.`,
  },
  {
    q: "Does a high similarity score mean I plagiarized?",
    a: "Not necessarily. Quotes, common phrases, and properly cited material can raise your score. Review each matched source and make sure anything you borrowed is quoted and cited correctly.",
  },
  {
    q: "Is my text stored or shared?",
    a: "Your text is sent to the scanning service only to produce the report and is not published or added to a public database. Still, avoid pasting confidential or unpublished work you don't want scanned.",
  },
  {
    q: "How is this different from a grammar checker?",
    a: "A grammar checker fixes spelling and sentence issues. A plagiarism checker finds text that matches existing sources so you can quote and cite it properly.",
  },
];

export const metadata: Metadata = {
  title: "Free Plagiarism Checker — Scan Your Essay Online | CitePlex",
  description:
    "Check your essay for plagiarism against billions of web pages. Get a similarity score and matched sources, then cite them properly. Free scan, no ads.",
  keywords: [
    "plagiarism checker",
    "plagiarism checker free",
    "check plagiarism",
    "plagiarism detector",
    "similarity checker",
    "essay plagiarism check",
  ],
  alternates: { canonical: "/plagiarism-checker" },
  openGraph: {
    title: "Free Plagiarism Checker — Scan Your Essay Online",
    description: "Get a similarity score and matched sources, then cite them properly. Free and ad-free.",
    type: "website",
  },
};

export default function PlagiarismCheckerPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Plagiarism Checker</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Scan your writing against billions of web pages and published sources. See an
              originality score, find matched passages, and cite them the right way — free for short
              texts, ad-free.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <PlagiarismChecker />
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
            <h3 className="text-lg font-bold">Found a source? Cite it properly.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Turn matched sources into accurate references in 11 citation styles — free.
            </p>
            <Link
              href="/generate"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
            >
              Open the citation generator
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
