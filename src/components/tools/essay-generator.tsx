"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Clipboard, Check, Loader2, Sparkles, Lock } from "lucide-react";

export type EssayMode = "thesis" | "outline" | "hook" | "conclusion";

const CONFIG: Record<
  EssayMode,
  {
    verb: string;
    placeholder: string;
    options: { value: string; label: string }[];
    resultHint: string;
  }
> = {
  thesis: {
    verb: "Generate thesis",
    placeholder: "Enter your essay topic or research question, e.g. “The impact of social media on teenage mental health”",
    options: [
      { value: "argumentative", label: "Argumentative" },
      { value: "analytical", label: "Analytical" },
      { value: "expository", label: "Expository" },
      { value: "persuasive", label: "Persuasive" },
    ],
    resultHint: "Your thesis statement will appear here.",
  },
  outline: {
    verb: "Generate outline",
    placeholder: "Enter your essay topic and optional thesis, e.g. “Topic: Climate change policy. Thesis: Carbon pricing is the most effective tool…”",
    options: [
      { value: "five-paragraph", label: "5-paragraph" },
      { value: "argumentative", label: "Argumentative" },
      { value: "research", label: "Research paper" },
      { value: "compare", label: "Compare & contrast" },
    ],
    resultHint: "Your essay outline will appear here.",
  },
  hook: {
    verb: "Generate hook",
    placeholder: "Enter your essay topic or thesis, e.g. “Why renewable energy must replace fossil fuels by 2040”",
    options: [
      { value: "question", label: "Question" },
      { value: "statistic", label: "Statistic" },
      { value: "anecdote", label: "Anecdote" },
      { value: "quote", label: "Quote" },
      { value: "bold", label: "Bold statement" },
    ],
    resultHint: "Your opening hook will appear here.",
  },
  conclusion: {
    verb: "Generate conclusion",
    placeholder:
      "Paste your thesis and main points, e.g. “Thesis: Remote work boosts productivity. Points: fewer distractions, flexible hours, lower commute stress.”",
    options: [
      { value: "summary", label: "Summary" },
      { value: "call-to-action", label: "Call to action" },
      { value: "reflective", label: "Reflective" },
      { value: "synthesis", label: "Synthesis" },
    ],
    resultHint: "Your concluding paragraph will appear here.",
  },
};

export function EssayGenerator({ mode }: { mode: EssayMode }) {
  const cfg = CONFIG[mode];
  const [text, setText] = useState("");
  const [option, setOption] = useState(cfg.options[0].value);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setUpgrade(false);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text, option }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setNotConfigured(true);
        return;
      }
      if (res.status === 402) {
        setUpgrade(true);
        toast.error("Free word limit reached");
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setResult(data.result);
    } catch {
      toast.error("Could not reach the AI service");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  if (notConfigured) {
    return (
      <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center">
        <Lock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
        <h3 className="font-semibold">AI features aren&apos;t enabled yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add <code className="rounded bg-muted px-1.5 py-0.5">AI_API_KEY</code> to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code> (any OpenAI-compatible API), restart the
          dev server, and reload.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {cfg.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setOption(o.value)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                option === o.value
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={cfg.placeholder}
          className="min-h-[220px] w-full resize-y rounded-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
        />
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">{words.toLocaleString()} words</span>
          <button
            type="button"
            onClick={run}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating…" : cfg.verb}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex h-9 items-center justify-between">
          <span className="text-[13px] font-medium text-muted-foreground">Result</span>
          {result && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
              Copy
            </button>
          )}
        </div>

        {upgrade ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-8 text-center">
            <Lock className="mb-3 h-6 w-6 text-muted-foreground" />
            <h3 className="font-semibold">Free word limit reached</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              Upgrade to Pro for longer inputs.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background hover:opacity-80"
            >
              See Pro plans
            </Link>
          </div>
        ) : (
          <div className="min-h-[300px] flex-1 whitespace-pre-wrap rounded-2xl border border-border bg-muted/20 p-5 text-[15px] leading-relaxed">
            {result || <span className="text-muted-foreground">{cfg.resultHint}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
