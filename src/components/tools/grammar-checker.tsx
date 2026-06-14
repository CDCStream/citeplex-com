"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface Match {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
  category: string;
  issueType: string;
  context: string;
  contextOffset: number;
  contextLength: number;
}

const ISSUE_TONE: Record<string, { bg: string; text: string; label: string }> = {
  misspelling: { bg: "bg-red-500/10", text: "text-red-600", label: "Spelling" },
  typographical: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Punctuation" },
  grammar: { bg: "bg-amber-500/10", text: "text-amber-600", label: "Grammar" },
  style: { bg: "bg-violet-500/10", text: "text-violet-600", label: "Style" },
  misc: { bg: "bg-zinc-500/10", text: "text-zinc-600", label: "Other" },
};

function tone(issueType: string) {
  return ISSUE_TONE[issueType] || ISSUE_TONE.misc;
}

interface GrammarCheckerProps {
  /** When "punctuation", only punctuation/typography issues are returned. */
  focus?: "punctuation";
  placeholder?: string;
  emptyHint?: string;
  cleanMessage?: string;
}

export function GrammarChecker({ focus, placeholder, emptyHint, cleanMessage }: GrammarCheckerProps = {}) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const runCheck = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, language, focus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setMatches(data.matches);
      setChecked(true);
      if (data.matches.length === 0) toast.success(cleanMessage || "No issues found — looks great!");
    } catch {
      toast.error("Could not reach the grammar service");
    } finally {
      setLoading(false);
    }
  };

  const applyFix = (match: Match, replacement: string) => {
    const next = text.slice(0, match.offset) + replacement + text.slice(match.offset + match.length);
    setText(next);
    runCheck(next);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Editor */}
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setChecked(false);
          }}
          placeholder={placeholder || "Paste or type your text here, then click Check…"}
          className="min-h-[360px] w-full resize-y rounded-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-CA">English (Canada)</option>
              <option value="en-AU">English (Australia)</option>
            </select>
            <span className="text-[13px] text-muted-foreground">{wordCount.toLocaleString()} words</span>
          </div>
          <button
            type="button"
            onClick={() => runCheck(text)}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:opacity-80 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        {!checked && !loading && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {emptyHint || "Your suggestions will appear here after you run a check."}
          </div>
        )}

        {checked && matches.length === 0 && !loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-green-500/5 p-5">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">{cleanMessage || "No issues found. Your text looks great."}</span>
          </div>
        )}

        {matches.length > 0 && (
          <>
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-medium">
              {matches.length} {matches.length === 1 ? "suggestion" : "suggestions"}
            </div>
            <div className="space-y-3">
              {matches.map((m, i) => {
                const t = tone(m.issueType);
                const before = m.context.slice(0, m.contextOffset);
                const error = m.context.slice(m.contextOffset, m.contextOffset + m.contextLength);
                const after = m.context.slice(m.contextOffset + m.contextLength);
                return (
                  <div key={i} className="rounded-xl border border-border bg-background p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.bg} ${t.text}`}>
                        {t.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{m.message}</p>
                    <p className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-[13px] leading-relaxed text-muted-foreground">
                      …{before}
                      <span className="rounded bg-red-500/15 px-0.5 font-medium text-red-600 line-through decoration-red-400">
                        {error}
                      </span>
                      {after}…
                    </p>
                    {m.replacements.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.replacements.map((r, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => applyFix(m, r)}
                            className="rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-[13px] font-medium text-primary transition-colors hover:bg-primary/10"
                          >
                            {r || "(remove)"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Suggestions are automated — always use your judgment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
