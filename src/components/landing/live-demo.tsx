"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = [
  { key: "apa", label: "APA 7", color: "#2563eb" },
  { key: "mla", label: "MLA 9", color: "#7c3aed" },
  { key: "chicago", label: "Chicago", color: "#dc2626" },
  { key: "bluebook", label: "Bluebook", color: "#0891b2" },
] as const;

const OUTPUT: Record<string, { ref: string; secondary: string; secondaryLabel: string }> = {
  apa: {
    ref: `Harari, Y. N. (2015). <em>Sapiens: A brief history of humankind</em>. Harper.`,
    secondary: "(Harari, 2015, p. 23)",
    secondaryLabel: "In-text",
  },
  mla: {
    ref: `Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. Harper, 2015.`,
    secondary: "(Harari 23)",
    secondaryLabel: "In-text",
  },
  chicago: {
    ref: `Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. New York: Harper, 2015.`,
    secondary: `Yuval Noah Harari, <em>Sapiens</em> (New York: Harper, 2015), 23.`,
    secondaryLabel: "Footnote",
  },
  bluebook: {
    ref: `YUVAL NOAH HARARI, SAPIENS: A BRIEF HISTORY OF HUMANKIND 23 (2015).`,
    secondary: `Harari, <em>supra</em> note 12, at 23.`,
    secondaryLabel: "Short form",
  },
};

export function LiveCitationDemo() {
  const [active, setActive] = useState("apa");
  const [copied, setCopied] = useState<string | null>(null);
  const out = OUTPUT[active];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ""));
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-zinc-900/5 overflow-hidden animate-float">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <span className="flex-1 text-center text-[11px] text-muted-foreground font-mono">
          citeplex.io
        </span>
        <div className="w-10" />
      </div>

      <div className="p-5 space-y-4">
        {/* Source indicator */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate">Sapiens: A Brief History of Humankind</p>
            <p className="text-[11px] text-muted-foreground">Yuval Noah Harari · 2015 · Harper</p>
          </div>
        </div>

        {/* Style switcher */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted/60">
          {STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-all",
                active === s.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </button>
          ))}
        </div>

        {/* Reference output */}
        <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Reference
            </span>
            <button
              onClick={() => handleCopy(out.ref, "ref")}
              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied === "ref" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <div className="px-4 py-3">
            <p
              className="text-[13px] leading-relaxed pl-4 -indent-4 citation-text"
              dangerouslySetInnerHTML={{ __html: out.ref }}
            />
          </div>
        </div>

        {/* Secondary output */}
        <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              {out.secondaryLabel}
            </span>
            <button
              onClick={() => handleCopy(out.secondary, "sec")}
              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied === "sec" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <div className="px-4 py-3">
            <p
              className="text-[13px] text-muted-foreground citation-text"
              dangerouslySetInnerHTML={{ __html: out.secondary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
