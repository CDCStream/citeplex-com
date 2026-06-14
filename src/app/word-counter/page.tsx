import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { WordCounter } from "@/components/tools/word-counter";

const FAQS = [
  {
    q: "Is this word counter free?",
    a: "Yes — completely free, with no ads and no sign-up required. It runs entirely in your browser, so your text is never uploaded to a server.",
  },
  {
    q: "How is reading time calculated?",
    a: "Reading time assumes an average silent reading speed of about 238 words per minute, and speaking time assumes roughly 130 words per minute for presentations.",
  },
  {
    q: "How are words and characters counted?",
    a: "Words are counted by splitting your text on spaces and line breaks. Characters are counted both with and without spaces so you can match strict limits.",
  },
  {
    q: "Does it work for essays and assignments?",
    a: "Absolutely. It's built for students and writers — track word limits for essays, papers, and applications, and check keyword density as you write.",
  },
];

export const metadata: Metadata = {
  title: "Free Word Counter — Words, Characters & Reading Time | CitePlex",
  description:
    "Free online word counter and character counter. Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. No ads, no sign-up.",
  keywords: ["word counter", "character counter", "word count", "character count", "count words", "letter counter"],
  alternates: { canonical: "/word-counter" },
  openGraph: {
    title: "Free Word Counter — Words, Characters & Reading Time",
    description: "Count words, characters, sentences, paragraphs, and reading time instantly. Free and ad-free.",
    type: "website",
  },
};

export default function WordCounterPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Word Counter</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Count words, characters, sentences, and paragraphs in real time — plus reading time and
              keyword density. Free, ad-free, and private (your text never leaves your browser).
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <WordCounter />
        </section>

        {/* SEO content */}
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">About this word counter</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Whether you&apos;re writing an essay with a strict word limit, drafting a college
            application, or optimizing content for readability, this free word counter gives you
            instant statistics as you type. It counts words and characters (with and without spaces),
            estimates reading and speaking time, and surfaces your most-used keywords so you can keep
            your writing tight and on-target.
          </p>

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
            <h3 className="text-lg font-bold">Need to cite your sources too?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Generate accurate citations in APA, MLA, Chicago, IEEE, and 7 more styles — free and
              without ads.
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
