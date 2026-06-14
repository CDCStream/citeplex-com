"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Clipboard, Check, X, ArrowDownAZ } from "lucide-react";
import { StyleSelector } from "@/components/citation/style-selector";
import { SourceTypeSelector } from "@/components/citation/source-type-selector";
import { SourceForm } from "@/components/citation/source-form";
import { generateCitation } from "@/lib/citation-engine";
import {
  type CitationStyle,
  type SourceType,
  type SourceData,
} from "@/lib/citation-styles";

interface Entry {
  id: string;
  data: SourceData;
  annotation: string;
}

function renderHTML(text: string) {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function plain(text: string) {
  return text.replace(/\*(.*?)\*/g, "$1");
}

export function AnnotatedBibliography() {
  const [style, setStyle] = useState<CitationStyle>("apa7");
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [adding, setAdding] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(true);
  const [copied, setCopied] = useState(false);

  const rendered = useMemo(() => {
    const list = entries.map((e) => ({
      id: e.id,
      annotation: e.annotation,
      result: generateCitation(e.data, style),
    }));
    if (sortAlpha) {
      list.sort((a, b) =>
        plain(a.result.formatted).replace(/^["']/, "").localeCompare(plain(b.result.formatted).replace(/^["']/, ""))
      );
    }
    return list;
  }, [entries, style, sortAlpha]);

  const handleAdd = (data: SourceData) => {
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), data, annotation: "" }]);
    setAdding(false);
    toast.success("Source added");
  };

  const handleAnnotation = (id: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, annotation: value } : e)));
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCopyAll = async () => {
    const text = rendered
      .map((e) => {
        const citation = plain(e.result.formatted);
        const annotation = e.annotation.trim();
        return annotation ? `${citation}\n\t${annotation}` : citation;
      })
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Annotated bibliography copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
        <StyleSelector selected={style} onChange={setStyle} />
      </div>

      {/* Add source */}
      {adding ? (
        <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Add a source</h2>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="space-y-5">
            <SourceTypeSelector selected={sourceType} onChange={setSourceType} style={style} />
            <SourceForm key={sourceType} sourceType={sourceType} onSubmit={handleAdd} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add another source
        </button>
      )}

      {/* Bibliography */}
      {entries.length > 0 && (
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-5 py-3">
            <span className="text-sm font-semibold">
              Annotated Bibliography · {entries.length} {entries.length === 1 ? "source" : "sources"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSortAlpha((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                  sortAlpha ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ArrowDownAZ className="h-3.5 w-3.5" />
                A–Z
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                Copy all
              </button>
            </div>
          </div>

          <div className="divide-y divide-border">
            {rendered.map((e) => (
              <div key={e.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className="citation-text pl-8 -indent-8 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderHTML(e.result.formatted) }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(e.id)}
                    className="mt-0.5 shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={e.annotation}
                  onChange={(ev) => handleAnnotation(e.id, ev.target.value)}
                  placeholder="Write your annotation here — summarize the source, evaluate its credibility, and explain its relevance to your research…"
                  className="mt-3 ml-8 w-[calc(100%-2rem)] min-h-[90px] resize-y rounded-lg border border-border bg-muted/20 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-primary/40"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
