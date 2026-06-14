import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { EssayGenerator } from "@/components/tools/essay-generator";

const FAQS = [
  {
    q: "What is an essay outline?",
    a: "An essay outline is a structured plan of your introduction, body paragraphs, and conclusion — with topic sentences and key points — so you know what to write before drafting.",
  },
  {
    q: "Which outline formats are supported?",
    a: "5-paragraph, argumentative, research paper, and compare-and-contrast. Paste your topic (and thesis if you have one) and pick the format that fits your assignment.",
  },
  {
    q: "Is this essay outline generator free?",
    a: "Yes — free to use with no ads. Generate as many outlines as you need while planning your essay.",
  },
];

export const metadata: Metadata = {
  title: "Free Essay Outline Generator — 5-Paragraph, Argumentative & More | CitePlex",
  description:
    "Generate a structured essay outline in seconds. 5-paragraph, argumentative, research paper, and compare-contrast formats. Free and ad-free.",
  keywords: ["essay outline generator", "outline generator", "essay outline maker", "5 paragraph essay outline", "argumentative essay outline"],
  alternates: { canonical: "/essay-outline-generator" },
};

export default function EssayOutlinePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Essay Outline Generator</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Plan your essay with a clear, structured outline — 5-paragraph, argumentative, research,
              or compare-and-contrast. Free and ad-free.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <EssayGenerator mode="outline" />
        </section>
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <Link href="/thesis-statement-generator" className="text-sm font-medium text-primary hover:underline">Need a thesis first?</Link>
            <Link href="/generate" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-80">
              Citation generator <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
