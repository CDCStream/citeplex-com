"use client";

import { useMemo, useState } from "react";
import { Clipboard, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";

const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "her", "was", "one", "our",
  "out", "his", "has", "had", "him", "she", "they", "this", "that", "with", "from", "have", "were",
  "your", "their", "what", "which", "when", "will", "would", "there", "been", "them", "than", "then",
  "into", "more", "some", "such", "only", "also", "very", "just", "about",
]);

function analyze(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length).length : 0;
  const readingMin = wordCount / 238;
  const speakingMin = wordCount / 130;

  const freq: Record<string, number> = {};
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z0-9']/g, "");
    if (key.length > 2 && !STOPWORDS.has(key)) freq[key] = (freq[key] || 0) + 1;
  }
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    wordCount,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingMin,
    speakingMin,
    topWords,
  };
}

function fmtTime(min: number): string {
  if (min === 0) return "0s";
  const totalSeconds = Math.round(min * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

const STAT_LABELS = {
  wordCount: "Words",
  characters: "Characters",
  sentences: "Sentences",
  paragraphs: "Paragraphs",
} as const;

type StatKey = keyof typeof STAT_LABELS;

const ORDER_WORDS: StatKey[] = ["wordCount", "characters", "sentences", "paragraphs"];
const ORDER_CHARS: StatKey[] = ["characters", "wordCount", "sentences", "paragraphs"];

export function WordCounter({ emphasis = "words" }: { emphasis?: "words" | "characters" }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => analyze(text), [text]);
  const primaryStats = (emphasis === "characters" ? ORDER_CHARS : ORDER_WORDS).map((key) => ({
    key,
    label: STAT_LABELS[key],
  }));

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setText("");
    toast.success("Cleared");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* Editor */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2 rounded-t-2xl border border-b-0 border-border bg-muted/30 px-4 py-2.5">
          <span className="text-[13px] font-medium text-muted-foreground">
            {emphasis === "characters"
              ? `${stats.characters.toLocaleString()} characters · ${stats.wordCount.toLocaleString()} words`
              : `${stats.wordCount.toLocaleString()} words · ${stats.characters.toLocaleString()} characters`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
              Copy
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here…"
          spellCheck
          className="min-h-[360px] flex-1 resize-y rounded-b-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
        />
      </div>

      {/* Stats panel */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {primaryStats.map((s) => (
            <div key={s.key} className="rounded-xl border border-border bg-background p-4">
              <div className="text-2xl font-bold tabular-nums">
                {(stats[s.key] as number).toLocaleString()}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <Row label="Characters (no spaces)" value={stats.charactersNoSpaces.toLocaleString()} />
          <Row label="Reading time" value={fmtTime(stats.readingMin)} />
          <Row label="Speaking time" value={fmtTime(stats.speakingMin)} last />
        </div>

        {stats.topWords.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Keyword density
            </div>
            <div className="space-y-2">
              {stats.topWords.map(([word, count]) => {
                const pct = stats.wordCount ? (count / stats.wordCount) * 100 : 0;
                return (
                  <div key={word}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="font-medium">{word}</span>
                      <span className="text-muted-foreground">
                        {count}× · {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(pct * 4, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${last ? "" : "border-b border-border"}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
