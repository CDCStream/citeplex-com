import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { GrammarChecker } from "@/components/tools/grammar-checker";

const FAQS = [
  {
    q: "Is this grammar and punctuation checker free?",
    a: "Yes — it's free to use with no sign-up. It checks spelling, grammar, punctuation, and style, and suggests fixes you can apply with one click.",
  },
  {
    q: "What does it check?",
    a: "It catches spelling mistakes, grammar errors, punctuation problems (commas, apostrophes, spacing), and common style issues. Each suggestion explains the problem and offers corrections.",
  },
  {
    q: "Does it work for essays and academic writing?",
    a: "Yes. It's well suited to essays, papers, and assignments. Run a check before you submit, then cite your sources with the citation generator.",
  },
  {
    q: "Is my text private?",
    a: "Your text is sent to a language-analysis service only to perform the check and is not stored by CitePlex. For sensitive documents, review the service's policy or self-host.",
  },
];

export const metadata: Metadata = {
  title: "Free Grammar & Punctuation Checker — Fix Your Writing | CitePlex",
  description:
    "Free online grammar and punctuation checker. Catch spelling, grammar, comma, and punctuation mistakes instantly and apply fixes with one click. No ads, no sign-up.",
  keywords: ["grammar checker", "punctuation checker", "grammar and punctuation checker", "comma checker", "spelling and grammar check", "free grammar checker"],
  alternates: { canonical: "/grammar-checker" },
  openGraph: {
    title: "Free Grammar & Punctuation Checker",
    description: "Catch spelling, grammar, and punctuation mistakes instantly. Free and ad-free.",
    type: "website",
  },
};

export default function GrammarCheckerPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Grammar &amp; Punctuation Checker
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Catch spelling, grammar, and punctuation mistakes in your writing — then apply
              corrections with one click. Free, ad-free, and great for essays and papers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <GrammarChecker />
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">What it checks</h2>
          <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground">
            <li><strong className="text-foreground">Spelling</strong> — typos and misspelled words.</li>
            <li><strong className="text-foreground">Grammar</strong> — subject–verb agreement, tense, articles, and more.</li>
            <li><strong className="text-foreground">Punctuation</strong> — commas, apostrophes, quotation marks, and spacing.</li>
            <li><strong className="text-foreground">Style</strong> — wordiness, redundancy, and clarity suggestions.</li>
          </ul>

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

          <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-lg font-bold">Finished editing? Cite your sources.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Generate accurate citations in APA, MLA, Chicago, and 8 more styles — free and ad-free.
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
