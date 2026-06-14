"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, ExternalLink, Lock, AlertCircle, Sparkles } from "lucide-react";
import { FREE_PLAGIARISM } from "@/lib/plans";

interface Source {
  url: string;
  title: string;
  percentage: number;
  matchedWords: number;
}

interface Result {
  score: number;
  scannedWords: number;
  matchedWords: number;
  sources: Source[];
}

function scoreTone(score: number) {
  if (score >= 25) return { ring: "text-red-600", bg: "bg-red-500/10", label: "High similarity" };
  if (score >= 10) return { ring: "text-amber-600", bg: "bg-amber-500/10", label: "Some similarity" };
  return { ring: "text-green-600", bg: "bg-green-500/10", label: "Looks original" };
}

export function PlagiarismChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [upsell, setUpsell] = useState<string | null>(null);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const overLimit = words > FREE_PLAGIARISM.wordLimit;

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setUpsell(null);
    setResult(null);
    try {
      const res = await fetch("/api/plagiarism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.limited || res.status === 429) {
          setUpsell(data.error || "You've reached the free limit.");
        } else {
          toast.error(data.error || "Something went wrong");
        }
        return;
      }
      setResult(data.result);
    } catch {
      toast.error("Could not reach the plagiarism service");
    } finally {
      setLoading(false);
    }
  };

  const tone = result ? scoreTone(result.score) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Editor */}
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setUpsell(null);
          }}
          placeholder="Paste your essay or paragraph here, then click Scan…"
          className="min-h-[360px] w-full resize-y rounded-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
        />
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[13px] ${overLimit ? "font-medium text-red-600" : "text-muted-foreground"}`}>
            {words.toLocaleString()} / {FREE_PLAGIARISM.wordLimit} words (free)
          </span>
          <button
            type="button"
            onClick={run}
            disabled={loading || !text.trim() || overLimit}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Scanning…" : "Scan for plagiarism"}
          </button>
        </div>
        {overLimit && (
          <p className="flex items-center gap-1.5 text-[13px] text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            The free scan covers up to {FREE_PLAGIARISM.wordLimit} words.{" "}
            <Link href="/pricing" className="underline underline-offset-2">
              Upgrade to Pro
            </Link>{" "}
            for full papers.
          </p>
        )}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        {!result && !loading && !upsell && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Your originality report will appear here after you scan.
          </div>
        )}

        {upsell && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <Lock className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm font-medium">{upsell}</p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80"
            >
              <Sparkles className="h-4 w-4" />
              See Pro plans
            </Link>
          </div>
        )}

        {result && tone && (
          <>
            <div className={`flex items-center gap-4 rounded-2xl border border-border ${tone.bg} p-5`}>
              <div className={`text-4xl font-bold tabular-nums ${tone.ring}`}>{result.score}%</div>
              <div>
                <p className="text-sm font-semibold">{tone.label}</p>
                <p className="text-[13px] text-muted-foreground">
                  {result.matchedWords.toLocaleString()} of {result.scannedWords.toLocaleString()} words matched online
                </p>
              </div>
            </div>

            {result.sources.length > 0 ? (
              <>
                <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-medium">
                  {result.sources.length} matched {result.sources.length === 1 ? "source" : "sources"}
                </div>
                <div className="space-y-2.5">
                  {result.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="line-clamp-2 text-sm font-medium">{s.title}</span>
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[12px] font-semibold tabular-nums">
                          {s.percentage}%
                        </span>
                      </div>
                      <span className="mt-1.5 flex items-center gap-1 truncate text-[12px] text-muted-foreground">
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        {s.url.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-green-500/5 p-5 text-sm font-medium">
                No matching sources found online. Looks original.
              </div>
            )}

            <p className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Automated matching isn&apos;t a guarantee — always cite sources and review manually.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
