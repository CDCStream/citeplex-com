import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CITATION_STYLES, type CitationStyle } from "@/lib/citation-styles";
import { generateCitation } from "@/lib/citation-engine";
import { STYLE_SEO, SOURCE_SEO, slugToStyle } from "@/lib/style-seo";

export function generateStaticParams() {
  const params: { source: string; style: string }[] = [];
  for (const source of Object.values(SOURCE_SEO)) {
    for (const seo of Object.values(STYLE_SEO)) {
      params.push({ source: source.slug, style: seo.slug });
    }
  }
  return params;
}

function resolve(sourceSlug: string, styleSlug: string) {
  const source = Object.values(SOURCE_SEO).find((s) => s.slug === sourceSlug);
  const style = slugToStyle[styleSlug];
  if (!source || !style) return null;
  return { source, style, styleSeo: STYLE_SEO[style], meta: CITATION_STYLES[style] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ source: string; style: string }>;
}): Promise<Metadata> {
  const { source, style } = await params;
  const r = resolve(source, style);
  if (!r) return { title: "Citation Guide — CitePlex" };
  const styleName = r.meta.label.split(" ")[0];
  const title = `How to Cite ${r.source.article} ${r.source.label} in ${styleName} | CitePlex`;
  const description = `Step-by-step guide to citing ${r.source.article} ${r.source.label.toLowerCase()} in ${styleName} format, with a real example and a free generator. No ads, no sign-up.`;
  return {
    title,
    description,
    keywords: [
      `${styleName.toLowerCase()} ${r.source.label.toLowerCase()} citation`,
      `how to cite ${r.source.article} ${r.source.label.toLowerCase()} in ${styleName.toLowerCase()}`,
      `${styleName.toLowerCase()} citation generator`,
    ],
    alternates: { canonical: `/cite/${r.source.slug}/${r.styleSeo.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

function toHTML(text: string) {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

export default async function CiteGuidePage({
  params,
}: {
  params: Promise<{ source: string; style: string }>;
}) {
  const { source, style } = await params;
  const r = resolve(source, style);
  if (!r) notFound();

  const { source: src, style: styleKey, styleSeo, meta } = r;
  const styleName = meta.label.split(" ")[0];
  const result = generateCitation(src.sample, styleKey);
  const inTextLabel =
    styleKey === "bluebook" ? "Short form" : styleKey === "chicago" || styleKey === "turabian" ? "Footnote" : "In-text citation";

  const otherStyles = Object.values(STYLE_SEO).filter((s) => s.slug !== styleSeo.slug);
  const otherSources = Object.values(SOURCE_SEO).filter((s) => s.slug !== src.slug);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8 lg:py-16">
            <div className="mb-4 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Link href={`/styles/${styleSeo.slug}`} className="hover:text-foreground">
                {styleName}
              </Link>
              <span>/</span>
              <span>{src.label}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How to cite {src.article} {src.label.toLowerCase()} in {styleName}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A quick, accurate guide to formatting {src.article} {src.label.toLowerCase()} citation in{" "}
              {meta.label} — with a real example you can copy, plus a free generator that does it for you.
            </p>
            <Link
              href={`/generate?style=${styleKey}&type=${src.type}`}
              className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
            >
              Generate this citation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Live example */}
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {styleName} {src.label.toLowerCase()} citation example
          </h2>
          <div className="mt-6 rounded-2xl border border-border bg-background overflow-hidden">
            <div className="space-y-4 p-6">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Reference entry
                </p>
                <p
                  className="citation-text pl-8 -indent-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: toHTML(result.formatted) }}
                />
              </div>
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {inTextLabel}
                </p>
                <p
                  className="citation-text leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: toHTML(result.inText) }}
                />
              </div>
            </div>
          </div>

          {/* Fields needed */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight">
            What you need to cite {src.article} {src.label.toLowerCase()}
          </h2>
          <ul className="mt-5 space-y-2.5">
            {src.fields.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[15px]">
                <Check className="h-4 w-4 shrink-0" style={{ color: meta.color }} />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            Missing some details? Our generator can auto-fill most fields from a URL, DOI, or ISBN —{" "}
            <Link href={`/generate?style=${styleKey}&type=${src.type}`} className="text-primary hover:underline">
              try it free
            </Link>
            .
          </p>
        </section>

        {/* Related links for internal linking */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
            <h2 className="text-lg font-bold">Cite {src.article} {src.label.toLowerCase()} in other styles</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {otherStyles.map((s) => (
                <Link
                  key={s.slug}
                  href={`/cite/${src.slug}/${s.slug}`}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s.keyword.split(" ")[0]}
                </Link>
              ))}
            </div>

            <h2 className="mt-8 text-lg font-bold">Cite other sources in {styleName}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {otherSources.map((s) => (
                <Link
                  key={s.slug}
                  href={`/cite/${s.slug}/${styleSeo.slug}`}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: `How to cite ${src.article} ${src.label.toLowerCase()} in ${styleName}`,
              step: [
                { "@type": "HowToStep", name: "Gather the source details", text: `Collect: ${src.fields.join(", ")}.` },
                { "@type": "HowToStep", name: "Format the reference entry", text: result.formatted },
                { "@type": "HowToStep", name: "Add the in-text citation", text: result.inText },
              ],
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
