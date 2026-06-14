import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { TOOL_GROUPS } from "@/lib/tools-nav";

export const metadata: Metadata = {
  title: "Free Academic Writing Tools — Citations, Grammar, Essay & More | CitePlex",
  description:
    "All CitePlex writing tools in one place: citation generator, grammar checker, paraphrasing, summarizer, essay outline, thesis statement, word counter, and more. Free and ad-free.",
  keywords: ["academic writing tools", "citation tools", "essay tools", "grammar checker", "free writing tools"],
  alternates: { canonical: "/tools" },
};

export default function ToolsHubPage() {
  const totalTools = TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {totalTools} free tools
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Academic writing tools</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Citations, essay planning, grammar, paraphrasing, and utilities — everything you need
              for a paper, without ads or clutter.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
          <div className="space-y-14">
            {TOOL_GROUPS.map((group) => (
              <div key={group.label}>
                <h2 className="text-xl font-bold tracking-tight">{group.label}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{tool.name}</h3>
                        <div className="flex items-center gap-2">
                          {tool.tag && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {tool.tag}
                            </span>
                          )}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-lg font-bold">Start with citations</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Our citation generator is free, unlimited, and supports 11 styles — APA, MLA, IEEE, AMA, and more.
            </p>
            <Link
              href="/generate"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-80"
            >
              Open citation generator
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
