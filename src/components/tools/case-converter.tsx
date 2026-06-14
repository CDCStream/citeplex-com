"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Clipboard, Trash2, Check } from "lucide-react";

// Minor words kept lowercase in title case (unless first/last word).
const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of",
  "off", "on", "or", "per", "so", "the", "to", "up", "via", "yet", "vs", "vs.",
  "with", "from", "into", "than", "over",
]);

const transforms = {
  sentence: (t: string) =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  lower: (t: string) => t.toLowerCase(),
  upper: (t: string) => t.toUpperCase(),
  capitalized: (t: string) =>
    t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  title: (t: string) => titleCase(t),
  alternating: (t: string) =>
    t
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
  inverse: (t: string) =>
    t
      .split("")
      .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
};

function titleCase(text: string): string {
  return text
    .split(/(\n)/)
    .map((line) => {
      if (line === "\n") return line;
      const tokens = line.split(/(\s+)/);
      const lastWordPos = tokens.reduce((acc, t, i) => (/\S/.test(t) ? i : acc), -1);
      let seen = -1;
      return tokens
        .map((tok, i) => {
          if (!/\S/.test(tok)) return tok;
          seen++;
          const lower = tok.toLowerCase();
          const isFirst = seen === 0;
          const isLast = i === lastWordPos;
          if (!isFirst && !isLast && MINOR_WORDS.has(lower)) return lower;
          return lower.replace(/[a-z]/, (c) => c.toUpperCase());
        })
        .join("");
    })
    .join("");
}

const BUTTONS: { key: keyof typeof transforms; label: string }[] = [
  { key: "sentence", label: "Sentence case" },
  { key: "lower", label: "lowercase" },
  { key: "upper", label: "UPPERCASE" },
  { key: "capitalized", label: "Capitalized Case" },
  { key: "title", label: "Title Case" },
  { key: "alternating", label: "aLtErNaTiNg" },
  { key: "inverse", label: "InVeRsE cAsE" },
];

export function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const apply = (key: keyof typeof transforms) => {
    if (!text) return;
    setText(transforms[key](text));
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here, then choose a case below…"
        className="min-h-[220px] w-full resize-y rounded-2xl border border-border bg-background p-5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary/40"
      />

      <div className="flex flex-wrap gap-2">
        {BUTTONS.map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => apply(b.key)}
            disabled={!text}
            className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/20 px-4 py-2.5">
        <span className="text-[13px] text-muted-foreground">
          {words.toLocaleString()} words · {text.length.toLocaleString()} characters
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
            onClick={() => setText("")}
            disabled={!text}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
