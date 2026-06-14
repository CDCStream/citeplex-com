import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AiTool } from "@/components/tools/ai-tool";

const FAQS = [
  {
    q: "What is a text summarizer?",
    a: "A summarizer condenses long text into its key points, helping you quickly understand articles, papers, and notes without reading everything.",
  },
  {
    q: "Is the summarizer free?",
    a: "Yes — you can summarize up to 1,500 words at a time for free. Upgrade to Pro for longer documents and higher daily limits.",
  },
  {
    q: "Can I choose the summary length?",
    a: "Yes — pick Short, Medium, Long, or Key points (a bulleted list) depending on how much detail you need.",
  },
  {
    q: "Is it good for research and studying?",
    a: "Absolutely. Summarize journal articles or lecture notes to grasp the main ideas faster — then cite your sources with the citation generator.",
  },
];

export const metadata: Metadata = {
  title: "Free Text Summarizer — Summarize Articles & Essays | CitePlex",
  description:
    "Free online text summarizer. Condense long articles, papers, and notes into key points or a short summary. Choose your length. No ads, no sign-up.",
  keywords: ["summarizer", "text summarizer", "summarize tool", "article summarizer", "summary generator", "tldr tool"],
  alternates: { canonical: "/summarizer" },
  openGraph: {
    title: "Free Text Summarizer — Summarize Articles & Essays",
    description: "Condense long text into key points. Free and ad-free.",
    type: "website",
  },
};

export default function SummarizerPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Text Summarizer</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Condense long articles, papers, and notes into the key points. Choose a short summary,
              a detailed one, or a bulleted list. Free, ad-free, and fast.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <AiTool mode="summarize" />
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
            <h3 className="text-lg font-bold">Summarizing a source? Cite it.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Generate accurate citations for the articles you summarize — in 11 styles, free.
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
