import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { EssayGenerator } from "@/components/tools/essay-generator";

const FAQS = [
  {
    q: "What is a thesis statement?",
    a: "A thesis statement is the central argument or claim of your essay, usually one or two sentences at the end of your introduction. It tells the reader what you'll argue and why it matters.",
  },
  {
    q: "Is this thesis statement generator free?",
    a: "Yes — generate thesis statements for free. Choose argumentative, analytical, expository, or persuasive styles to match your assignment.",
  },
  {
    q: "Can I use the thesis for my essay?",
    a: "Use it as a starting point and refine it to match your argument and your instructor's requirements. Always review and personalize before submitting.",
  },
];

export const metadata: Metadata = {
  title: "Free Thesis Statement Generator — Argumentative, Analytical & More | CitePlex",
  description:
    "Generate a strong thesis statement for your essay in seconds. Argumentative, analytical, expository, and persuasive styles. Free, ad-free, no sign-up.",
  keywords: ["thesis statement generator", "thesis generator", "thesis statement maker", "argumentative thesis", "essay thesis"],
  alternates: { canonical: "/thesis-statement-generator" },
};

export default function ThesisStatementPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Thesis Statement Generator</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Enter your topic and get a clear, debatable thesis statement — argumentative, analytical,
              expository, or persuasive. Free and ad-free.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <EssayGenerator mode="thesis" />
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
            <p className="text-sm text-muted-foreground">Need an outline or citations next?</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/essay-outline-generator" className="text-sm font-medium text-primary hover:underline">Essay outline generator</Link>
              <Link href="/generate" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-80">
                Citation generator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
