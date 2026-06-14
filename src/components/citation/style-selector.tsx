"use client";

import { type CitationStyle, CITATION_STYLES } from "@/lib/citation-styles";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selected: CitationStyle;
  onChange: (style: CitationStyle) => void;
}

export function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">Citation Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {(Object.entries(CITATION_STYLES) as [CitationStyle, typeof CITATION_STYLES[CitationStyle]][]).map(
          ([key, style]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "relative flex flex-col items-center rounded-xl border-2 px-3 py-3 text-center transition-all",
                selected === key
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div
                className="mb-2 h-1.5 w-8 rounded-full"
                style={{ backgroundColor: style.color }}
              />
              <span className="text-xs font-bold leading-tight">{style.label.split(" ").slice(0, 2).join(" ")}</span>
              <span className="mt-0.5 text-[10px] text-muted-foreground leading-tight hidden sm:block">
                {style.label.split(" ").slice(2).join(" ")}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
