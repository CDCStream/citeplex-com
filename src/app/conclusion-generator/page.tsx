import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { EssayGenerator } from "@/components/tools/essay-generator";

const FAQS = [
  {
    q: "What is a conclusion generator?",
    a: "A conclusion generator turns your thesis and main points into a polished closing paragraph that restates your argument and leaves a strong final impression — without introducing new ideas.",
  },
  {
    q: "What should I paste in?",
    a: "Paste your thesis and the key points from your essay. The more specific your points, the more relevant your conclusion will be. You can pick a style — summary, call to action, reflective, or synthesis.",
  },
  {
    q: "Is the conclusion generator free?",
    a: "Yes — generate essay conclusions for free with no ads. Upgrade to Pro for longer inputs and higher daily limits.",
  },
  {
    q: "Will it add new information to my conclusion?",
    a: "No. A good conclusion wraps up what you've already argued. The tool restates and synthesizes your points rather than introducing new evidence — exactly what graders expect.",
  },
  {
    q: "How is it different from a summarizer?",
    a: "A summarizer condenses an existing text. A conclusion generator writes the final paragraph of an essay — restating your thesis and tying your argument together with a sense of closure.",
  },
];

export const metadata: Metadata = {
  title: "Free Conclusion Generator — Write Essay Conclusions | CitePlex",
  description:
    "Generate a strong essay conclusion in seconds. Restate your thesis, tie your points together, and end with impact. Summary, call-to-action & reflective styles. Free.",
  keywords: [
    "conclusion generator",
    "essay conclusion generator",
    "conclusion paragraph generator",
    "concluding sentence generator",
    "how to write a conclusion",
  ],
  alternates: { canonical: "/conclusion-generator" },
  openGraph: {
    title: "Free Conclusion Generator — Write Essay Conclusions",
    description: "Turn your thesis and points into a polished closing paragraph. Free and ad-free.",
    type: "website",
  },
};

export default function ConclusionGeneratorPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Conclusion Generator</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Turn your thesis and main points into a polished closing paragraph — restate your
              argument and end with impact. Choose a summary, call-to-action, reflective, or
              synthesis style. Free and ad-free.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <EssayGenerator mode="conclusion" />
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
            <h3 className="text-lg font-bold">Plan the whole essay</h3>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/thesis-statement-generator" className="font-medium text-primary hover:underline">
                Thesis generator
              </Link>
              <Link href="/essay-outline-generator" className="font-medium text-primary hover:underline">
                Outline generator
              </Link>
              <Link href="/hook-generator" className="font-medium text-primary hover:underline">
                Hook generator
              </Link>
            </div>
            <Link
              href="/generate"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-80"
            >
              Citation generator <ArrowRight className="h-4 w-4" />
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
