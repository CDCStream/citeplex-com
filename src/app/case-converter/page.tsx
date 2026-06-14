import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CaseConverter } from "@/components/tools/case-converter";

const CASES = [
  { name: "Sentence case", example: "The quick brown fox jumps." },
  { name: "lowercase", example: "the quick brown fox jumps." },
  { name: "UPPERCASE", example: "THE QUICK BROWN FOX JUMPS." },
  { name: "Capitalized Case", example: "The Quick Brown Fox Jumps." },
  { name: "Title Case", example: "The Quick Brown Fox Jumps" },
  { name: "aLtErNaTiNg cAsE", example: "tHe qUiCk bRoWn" },
  { name: "InVeRsE cAsE", example: "tHE qUICK bROWN" },
];

const FAQS = [
  {
    q: "What is title case?",
    a: "Title case capitalizes the first letter of major words while keeping minor words (a, an, the, and, of, in, etc.) lowercase, unless they're the first or last word. It's the standard for titles in APA, MLA, and Chicago.",
  },
  {
    q: "What's the difference between Title Case and Capitalized Case?",
    a: "Capitalized Case capitalizes every word, while Title Case follows grammar rules and leaves short minor words lowercase — which is what most citation styles require for titles.",
  },
  {
    q: "Is this case converter free?",
    a: "Yes — it's free, ad-free, and runs entirely in your browser, so your text is never uploaded anywhere.",
  },
  {
    q: "Can I convert UPPERCASE to lowercase?",
    a: "Yes. Paste your text and click lowercase to convert everything to lowercase, or UPPERCASE to do the reverse.",
  },
];

export const metadata: Metadata = {
  title: "Free Case Converter — Title Case, UPPERCASE, lowercase | CitePlex",
  description:
    "Free online case converter. Instantly change text to Title Case, Sentence case, UPPERCASE, lowercase, and more. Proper title case for APA, MLA, and Chicago titles. No ads.",
  keywords: ["case converter", "title case converter", "uppercase to lowercase", "lowercase to uppercase", "text case converter", "capitalize text"],
  alternates: { canonical: "/case-converter" },
  openGraph: {
    title: "Free Case Converter — Title Case, UPPERCASE & More",
    description: "Convert text between Title Case, Sentence case, UPPERCASE, lowercase and more. Free and ad-free.",
    type: "website",
  },
};

export default function CaseConverterPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Case Converter</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Instantly convert text between Title Case, Sentence case, UPPERCASE, lowercase, and
              more. Includes proper title case for APA, MLA, and Chicago titles. Free, ad-free, and
              private.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <CaseConverter />
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Case types explained</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-semibold">Case</th>
                  <th className="px-5 py-3 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c, i) => (
                  <tr key={c.name} className={i % 2 ? "bg-muted/10" : ""}>
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            <h3 className="text-lg font-bold">Formatting a paper?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Title-case your source titles here, then generate citations in 11 styles — or check your
              length with the <Link href="/word-counter" className="text-primary hover:underline">word counter</Link>.
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
