import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { LiveCitationDemoStatic } from "@/components/landing/live-demo-static";
import { TOOL_GROUPS } from "@/lib/tools-nav";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />

      <main className="flex-1">
        {/* ─────────────────── HERO ─────────────────── */}
        <section className="relative grain">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left — copy */}
              <div className="lg:col-span-5">
                <h1 className="text-[2.75rem] sm:text-[3.25rem] lg:text-[3.5rem] font-bold tracking-[-0.035em] leading-[1.08]">
                  Write your paper.
                  <br />
                  Cite your sources.
                  <br />
                  <span className="text-zinc-400 dark:text-zinc-500">
                    Skip the
                    <br />
                    clutter.
                  </span>
                </h1>

                <p className="mt-6 text-[15px] text-muted-foreground leading-relaxed max-w-sm">
                  Citations, grammar, paraphrasing, essay tools, and more —
                  11 citation styles, zero ads, built for students and researchers.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href="/generate"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-all hover:opacity-80"
                  >
                    Start citing — free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/styles"
                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View styles
                  </Link>
                </div>

                <p className="mt-3 text-[11px] text-zinc-400">
                  Unlimited citations free · No sign-up required
                </p>
              </div>

              {/* Right — product demo */}
              <div className="lg:col-span-7 flex justify-center lg:justify-end">
                <div className="w-full max-w-md lg:max-w-none">
                  <LiveCitationDemoStatic />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── TRUST BAR ─────────── */}
        <section className="border-y border-border">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-8 text-[12px] text-muted-foreground">
              <span>Used by students at <strong className="text-foreground font-medium">120+ universities</strong></span>
              <div className="hidden sm:flex items-center gap-5 flex-wrap justify-end">
                {["APA", "MLA", "Chicago", "IEEE", "AMA", "Bluebook", "+5 more"].map((s) => (
                  <span key={s} className="font-medium text-foreground/60">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── WRITING TOOLS ─────────── */}
        <section id="tools" className="content-auto py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                  Writing tools
                </p>
                <h2 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.15]">
                  Everything for your paper.
                  <br />
                  <span className="text-zinc-400 dark:text-zinc-500">One clean place.</span>
                </h2>
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all tools
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOOL_GROUPS.flatMap((g) => g.tools).map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-semibold group-hover:text-foreground">
                      {tool.name}
                    </h3>
                    {tool.tag && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {tool.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12px] text-muted-foreground">{tool.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                    Open tool
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── WHY THIS EXISTS ─────────── */}
        <section className="content-auto border-t border-border py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                Why we built this
              </p>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.15]">
                The tools you know
                <br />
                <span className="text-zinc-400 dark:text-zinc-500">stopped caring about you.</span>
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quote card 1 */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">r/</div>
                    <span className="text-[11px] text-muted-foreground">r/college · 3.2k upvotes</span>
                  </div>
                  <p className="text-[14px] leading-relaxed">
                    &ldquo;I remember when EasyBib had two buttons — cite and search.
                    Now I have to watch a <strong>30-second ad just to cite
                    one source</strong>.&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[11px] text-zinc-400">EasyBib user review</p>
                </div>
              </div>

              {/* Quote card 2 */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-5 rounded-full bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center text-white dark:text-zinc-800 text-[9px] font-bold">G2</div>
                    <span className="text-[11px] text-muted-foreground">Verified review</span>
                  </div>
                  <p className="text-[14px] leading-relaxed">
                    &ldquo;The site runs <strong>a lot slower</strong> and the ads
                    frequently make it crash. It used to work so much better.&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[11px] text-zinc-400">Citation Machine · rated 1.8/5</p>
                </div>
              </div>

              {/* Quote card 3 */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[9px] font-bold">FTC</div>
                    <span className="text-[11px] text-muted-foreground">Federal Trade Commission</span>
                  </div>
                  <p className="text-[14px] leading-relaxed">
                    Chegg (owner of EasyBib) was fined <strong>$7.5 million</strong>{" "}
                    in 2025 for billing ~200k users after they requested cancellation.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[11px] text-zinc-400">Sept 2025 · FTC Settlement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── PRODUCT BENTO ─────────── */}
        <section className="content-auto border-t border-border bg-muted/30 grain py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="max-w-lg mb-14">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                Product
              </p>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.15]">
                What you get.
              </h2>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Auto-fill — wide */}
              <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-7 sm:p-8 overflow-hidden">
                <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] mb-2">
                  Auto-fill
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-1.5">
                  Paste a URL. Get everything.
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md mb-6">
                  We pull title, authors, date, publisher, and journal from CrossRef,
                  OpenLibrary, and page metadata — so you don&apos;t have to type it.
                </p>
                {/* Mini UI mock */}
                <div className="rounded-xl border border-border bg-muted/30 overflow-hidden text-[12px] font-mono">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/50 flex items-center gap-2">
                    <span className="text-[10px] font-sans font-semibold text-muted-foreground uppercase tracking-widest">
                      Input
                    </span>
                  </div>
                  <div className="px-4 py-3 text-muted-foreground">
                    https://doi.org/10.1038/s41586-024-07421-0
                  </div>
                  <div className="px-4 py-2.5 border-t border-b border-border bg-muted/50 flex items-center gap-2">
                    <span className="text-[10px] font-sans font-semibold text-muted-foreground uppercase tracking-widest">
                      Extracted
                    </span>
                    <span className="text-[10px] font-sans text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      auto
                    </span>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <p><span className="text-zinc-400">title </span><span className="text-foreground">Scaling language models with...</span></p>
                    <p><span className="text-zinc-400">authors </span><span className="text-foreground">Chen, M. · Radford, A. · Wu, J.</span></p>
                    <p><span className="text-zinc-400">journal </span><span className="text-foreground">Nature</span></p>
                    <p><span className="text-zinc-400">year </span><span className="text-foreground">2024</span></p>
                  </div>
                </div>
              </div>

              {/* Speed — narrow */}
              <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-7 sm:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.15em] mb-2">
                    Speed
                  </p>
                  <h3 className="text-lg font-bold tracking-tight mb-1.5">
                    Client-side engine
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Citations generate in your browser. No server round-trip,
                    no loading spinners. Just click and copy.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex items-end gap-[3px] h-16">
                    {[
                      { h: 56, label: "EasyBib", color: "bg-zinc-200 dark:bg-zinc-700" },
                      { h: 48, label: "Citation Machine", color: "bg-zinc-200 dark:bg-zinc-700" },
                      { h: 32, label: "BibGuru", color: "bg-zinc-200 dark:bg-zinc-700" },
                      { h: 4, label: "CitePlex", color: "bg-emerald-500" },
                    ].map((bar) => (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-sm ${bar.color} transition-all`}
                          style={{ height: `${bar.h}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-[3px] mt-2">
                    {["~12s", "~10s", "~3s", "~80ms"].map((t, i) => (
                      <span key={t} className={`flex-1 text-center text-[9px] font-mono ${i === 3 ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Bluebook */}
              <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
                <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.15em] mb-2">
                  Legal
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-1.5">
                  Bluebook 22nd Ed.
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
                  Cases, statutes, regulations — practitioner briefs and law review footnotes.
                </p>
                <div className="rounded-lg border border-cyan-200/50 dark:border-cyan-800/30 bg-cyan-50/50 dark:bg-cyan-950/20 px-4 py-3">
                  <p className="text-[12px] leading-relaxed font-mono">
                    <em>Brown v. Bd. of Educ.</em>, 347 U.S. 483, 495 (1954).
                  </p>
                </div>
              </div>

              {/* Styles */}
              <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
                <p className="text-[11px] font-mono text-violet-600 dark:text-violet-400 uppercase tracking-[0.15em] mb-2">
                  Formats
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-4">
                  Eleven styles, one tool
                </h3>
                <div className="space-y-2.5">
                  {[
                    { name: "APA 7th Edition", color: "#2563eb" },
                    { name: "MLA 9th Edition", color: "#7c3aed" },
                    { name: "Chicago 17th", color: "#dc2626" },
                    { name: "IEEE", color: "#4338ca" },
                    { name: "AMA 11th", color: "#e11d48" },
                    { name: "Bluebook 22nd", color: "#0891b2" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center gap-2.5">
                      <span className="h-[6px] w-[6px] rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-[13px]">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source types */}
              <div className="sm:col-span-2 lg:col-span-1 rounded-2xl border border-border bg-card p-7 sm:p-8">
                <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-[0.15em] mb-2">
                  Sources
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-4">
                  Nine source types
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Website", "Book", "Journal", "Dissertation",
                    "Case Law", "Statute", "Newspaper", "Video", "PDF"
                  ].map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── BEFORE / AFTER ─────────── */}
        <section className="content-auto py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="max-w-lg mb-14">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                Comparison
              </p>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.15]">
                What changes.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="rounded-2xl border border-red-200/60 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 p-7 sm:p-8">
                <p className="text-[11px] font-mono text-red-400 uppercase tracking-[0.15em] mb-5">
                  Legacy tools
                </p>
                <ul className="space-y-3.5">
                  {[
                    "10+ second page loads",
                    "Full-screen video ads per citation",
                    "Forced account creation",
                    "$19.95/mo for basic features",
                    "No Bluebook support",
                    "Lighthouse performance: 22/100",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px]">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-red-300 dark:bg-red-700 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 p-7 sm:p-8">
                <p className="text-[11px] font-mono text-emerald-500 uppercase tracking-[0.15em] mb-5">
                  CitePlex
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Instant load — zero ads, zero trackers",
                    "Citation in ~80ms, client-side",
                    "No account needed to start",
                    "Unlimited generate free, Pro at $9.99/mo",
                    "11 styles incl. IEEE, AMA, ACS, CSE, ASA",
                    "Accessible, fast, modern UI",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px]">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── STYLE PREVIEWS ─────────── */}
        <section className="content-auto border-t border-border bg-muted/30 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                  Citation Styles
                </p>
                <h2 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.15]">
                  Same source,
                  <br />
                  eleven formats.
                </h2>
              </div>
              <Link
                href="/styles"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all style guides
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "APA 7th", color: "#2563eb", cite: "Harari, Y. N. (2015). <em>Sapiens: A brief history of humankind</em>. Harper." },
                { name: "MLA 9th", color: "#7c3aed", cite: "Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. Harper, 2015." },
                { name: "Chicago", color: "#dc2626", cite: "Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. New York: Harper, 2015." },
                { name: "Turabian", color: "#ea580c", cite: "Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. New York: Harper, 2015." },
                { name: "Bluebook", color: "#0891b2", cite: "YUVAL NOAH HARARI, SAPIENS: A BRIEF HISTORY OF HUMANKIND (2015)." },
                { name: "Harvard", color: "#059669", cite: "Harari, Y.N. (2015). <em>Sapiens: A Brief History of Humankind</em>. New York: Harper." },
              ].map((s) => (
                <div
                  key={s.name}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[12px] font-bold">{s.name}</span>
                  </div>
                  <p
                    className="text-[12px] leading-relaxed text-muted-foreground citation-text pl-3 -indent-3"
                    dangerouslySetInnerHTML={{ __html: s.cite }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── FINAL CTA ─────────── */}
        <section className="py-24 sm:py-32 grain">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="max-w-xl">
              <h2 className="text-[2rem] sm:text-[2.75rem] font-bold tracking-[-0.03em] leading-[1.12]">
                Your paper is due.
                <br />
                <span className="text-zinc-400 dark:text-zinc-500">
                  Your citations shouldn&apos;t
                  <br />
                  be the hard part.
                </span>
              </h2>
              <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-sm">
                Citations, essay tools, grammar check, and more — free to start.
                No account required. No ads.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-semibold text-background transition-all hover:opacity-80"
                >
                  Start citing now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
