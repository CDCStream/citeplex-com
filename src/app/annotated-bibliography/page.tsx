import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AnnotatedBibliography } from "@/components/tools/annotated-bibliography";

const FAQS = [
  {
    q: "What is an annotated bibliography?",
    a: "An annotated bibliography is a list of citations to sources, where each citation is followed by a short paragraph (the annotation) that summarizes, evaluates, and reflects on the source's relevance to your research.",
  },
  {
    q: "How long should each annotation be?",
    a: "Most annotations are 100–200 words. A typical annotation summarizes the source, assesses its credibility or bias, and explains how it fits your project — but always follow your instructor's guidelines.",
  },
  {
    q: "Which citation styles are supported?",
    a: "All 11 styles in our generator — APA, MLA, Chicago, Turabian, Harvard, AMA, IEEE, ACS, CSE, ASA, and Bluebook. Switch styles at any time and every entry reformats instantly.",
  },
  {
    q: "Is this annotated bibliography generator free?",
    a: "Yes — it's free with no ads. Add your sources, write annotations, sort alphabetically, and copy the whole bibliography to your document.",
  },
];

export const metadata: Metadata = {
  title: "Free Annotated Bibliography Generator — APA, MLA & More | CitePlex",
  description:
    "Create an annotated bibliography free in APA, MLA, Chicago, and 8 more styles. Add sources, write annotations, sort alphabetically, and copy it all. No ads, no sign-up.",
  keywords: ["annotated bibliography generator", "annotated bibliography maker", "annotated bibliography", "apa annotated bibliography", "mla annotated bibliography"],
  alternates: { canonical: "/annotated-bibliography" },
  openGraph: {
    title: "Free Annotated Bibliography Generator",
    description: "Build an annotated bibliography in 11 citation styles — free and ad-free.",
    type: "website",
  },
};

export default function AnnotatedBibliographyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1 bg-muted/20">
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-14">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Annotated Bibliography Generator
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Add your sources, write an annotation for each, and get a clean, alphabetized annotated
              bibliography in APA, MLA, Chicago, and 8 more styles. Free, ad-free, no sign-up.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <AnnotatedBibliography />
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">How to write an annotated bibliography</h2>
          <ol className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            <li><strong className="text-foreground">1. Cite the source.</strong> Choose your style above and add each source — the citation is generated for you automatically.</li>
            <li><strong className="text-foreground">2. Summarize.</strong> In 2–4 sentences, explain the source&apos;s main argument or findings.</li>
            <li><strong className="text-foreground">3. Evaluate.</strong> Assess the author&apos;s credibility, the methodology, and any bias.</li>
            <li><strong className="text-foreground">4. Reflect.</strong> Explain how the source supports or fits into your own research.</li>
          </ol>

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-xl border border-border bg-background p-6">
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-background p-8 text-center">
            <h3 className="text-lg font-bold">Just need a single citation?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Use the citation generator for one-off references in any of 11 styles.
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
