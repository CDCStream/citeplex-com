import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { WordCounter } from "@/components/tools/word-counter";

const LIMITS = [
  { platform: "Tweet / X post", limit: "280", note: "Per post (Premium allows more)" },
  { platform: "SMS text message", limit: "160", note: "Splits into multiple beyond this" },
  { platform: "Meta description (SEO)", limit: "150–160", note: "Before Google truncates" },
  { platform: "Title tag (SEO)", limit: "50–60", note: "Before Google truncates" },
  { platform: "Instagram caption", limit: "2,200", note: "Only first ~125 shown collapsed" },
  { platform: "Instagram bio", limit: "150", note: "Profile bio limit" },
  { platform: "Facebook post", limit: "63,206", note: "Practical sweet spot is ~80" },
  { platform: "LinkedIn post", limit: "3,000", note: "Headline limit is 220" },
  { platform: "YouTube title", limit: "100", note: "~70 shown in search" },
  { platform: "YouTube description", limit: "5,000", note: "First ~157 shown in search" },
  { platform: "Google Ads headline", limit: "30", note: "Per headline" },
  { platform: "Google Ads description", limit: "90", note: "Per description line" },
];

const FAQS = [
  {
    q: "Is this character counter free?",
    a: "Yes — it's completely free, ad-free, and requires no sign-up. Everything runs in your browser, so your text stays private and is never uploaded.",
  },
  {
    q: "Does it count characters with and without spaces?",
    a: "Yes. The tool shows total characters (including spaces) and characters without spaces, so you can match any platform's specific rule.",
  },
  {
    q: "Can I use it to stay within a Twitter or meta description limit?",
    a: "Absolutely. Watch the live character count as you type and compare it to the platform limits in the reference table on this page.",
  },
  {
    q: "Does it count spaces, punctuation, and emojis?",
    a: "Total characters include spaces and punctuation. Note that some emojis count as two or more characters on certain platforms.",
  },
];

export const metadata: Metadata = {
  title: "Free Character Counter — Count Characters With & Without Spaces | CitePlex",
  description:
    "Free online character counter. Count characters with and without spaces in real time, plus words, sentences, and paragraphs. Includes Twitter, SEO, and social media character limits. No ads.",
  keywords: ["character counter", "letter counter", "character count", "count characters", "text counter", "twitter character counter"],
  alternates: { canonical: "/character-counter" },
  openGraph: {
    title: "Free Character Counter — With & Without Spaces",
    description: "Count characters in real time, with social media and SEO character limits. Free and ad-free.",
    type: "website",
  },
};

export default function CharacterCounterPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Character Counter</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Count characters with and without spaces in real time — plus words, sentences, and
              paragraphs. Perfect for tweets, meta descriptions, and any text with a strict limit.
              Free, ad-free, and private.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <WordCounter emphasis="characters" />
        </section>

        {/* Unique value: platform character limits */}
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Character limits by platform</h2>
          <p className="mt-2 text-muted-foreground">
            A quick reference for common character limits across social media, messaging, and SEO.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-semibold">Platform / field</th>
                  <th className="px-5 py-3 font-semibold">Character limit</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {LIMITS.map((row, i) => (
                  <tr key={row.platform} className={i % 2 ? "bg-muted/10" : ""}>
                    <td className="px-5 py-3 font-medium">{row.platform}</td>
                    <td className="px-5 py-3 tabular-nums">{row.limit}</td>
                    <td className="hidden px-5 py-3 text-muted-foreground sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Limits change over time — always verify against the platform&apos;s current guidelines.
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
            <h3 className="text-lg font-bold">Writing an essay instead?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Use the <Link href="/word-counter" className="text-primary hover:underline">word counter</Link>{" "}
              for word limits and reading time, or generate citations in 11 styles free.
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
