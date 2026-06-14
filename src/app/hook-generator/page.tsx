import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { EssayGenerator } from "@/components/tools/essay-generator";

const FAQS = [
  {
    q: "What is a hook in an essay?",
    a: "A hook is the opening sentence or two that grabs the reader's attention — a question, statistic, anecdote, quote, or bold statement before your thesis.",
  },
  {
    q: "What hook types can I generate?",
    a: "Question, statistic, anecdote, quote, and bold statement. Pick the style that fits your essay tone and topic.",
  },
  {
    q: "Is this hook generator free?",
    a: "Yes — generate essay hooks for free with no ads. Pair it with our thesis statement and outline tools to plan your full introduction.",
  },
];

export const metadata: Metadata = {
  title: "Free Hook Generator — Essay Opening Lines & Introductions | CitePlex",
  description:
    "Generate a compelling essay hook in seconds. Question, statistic, anecdote, quote, or bold statement openings. Free and ad-free.",
  keywords: ["hook generator", "essay hook generator", "introduction hook", "opening sentence generator", "essay introduction"],
  alternates: { canonical: "/hook-generator" },
};

export default function HookGeneratorPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hook Generator</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Write a compelling opening for your essay — question, statistic, anecdote, quote, or
              bold statement. Free and ad-free.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <EssayGenerator mode="hook" />
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
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/thesis-statement-generator" className="font-medium text-primary hover:underline">Thesis generator</Link>
              <Link href="/essay-outline-generator" className="font-medium text-primary hover:underline">Outline generator</Link>
            </div>
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
