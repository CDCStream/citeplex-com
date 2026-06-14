"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Clipboard, Check, Loader2, Sparkles, Lock } from "lucide-react";

type Mode = "paraphrase" | "summarize";

const PARAPHRASE_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "fluent", label: "Fluent" },
  { value: "formal", label: "Formal" },
  { value: "simple", label: "Simple" },
  { value: "creative", label: "Creative" },
];

const SUMMARIZE_OPTIONS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
  { value: "bullets", label: "Key points" },
];

export function AiTool({ mode }: { mode: Mode }) {
  const options = mode === "paraphrase" ? PARAPHRASE_OPTIONS : SUMMARIZE_OPTIONS;
  const [text, setText] = useState("");
  const [option, setOption] = useState(options[0].value);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);

  const verb = mode === "paraphrase" ? "Paraphrase" : "Summarize";
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
          This tool needs an AI provider key. Add <code className="rounded bg-muted px-1.5 py-0.5">AI_API_KEY</code>{" "}
          (any OpenAI-compatible API) to your environment, then reload.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Input */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {options.map((o) => (
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
          placeholder={`Paste the text you want to ${mode}…`}
          className="min-h-[300px] w-full resize-y rounded-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
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
            {loading ? `${verb}…` : verb}
          </button>
        </div>
      </div>

      {/* Output */}
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
              Upgrade to Pro to {mode} longer texts without limits.
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
            {result || <span className="text-muted-foreground">Your {mode === "paraphrase" ? "paraphrased" : "summarized"} text will appear here.</span>}
          </div>
        )}
      </div>
    </div>
  );
}
