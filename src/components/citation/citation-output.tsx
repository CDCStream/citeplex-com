"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { type CitationResult, type SourceData, CITATION_STYLES } from "@/lib/citation-styles";
import { Copy, Check, FileText, Quote, Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { saveCitation } from "@/lib/actions/citations";

interface CitationOutputProps {
  results: CitationResult[];
  sourceData?: SourceData | null;
}

function formatCitationHTML(text: string): string {
  return text
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const plainText = text.replace(/\*(.*?)\*/g, "$1");
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
        copied
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function SaveButton({
  result,
  sourceData,
}: {
  result: CitationResult;
  sourceData?: SourceData | null;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!isSupabaseConfigured()) {
      toast("Accounts aren't connected yet. Add Supabase keys to enable saving.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast("Sign in to save citations to your library.");
        router.push("/login?redirect=/generate");
        return;
      }

      const res = await saveCitation({
        style: result.style,
        sourceType: result.sourceType,
        sourceData: sourceData ?? { sourceType: result.sourceType },
        formatted: result.formatted,
        inText: result.inText,
      });

      if (res.ok) {
        setSaved(true);
        toast.success("Saved to your library");
        setTimeout(() => setSaved(false), 2500);
      } else if (res.limitReached) {
        toast.error(res.error || "Monthly limit reached");
        router.push("/pricing");
      } else {
        toast.error(res.error || "Could not save citation");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving || saved}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
        saved
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      {saving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : saved ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function CitationOutput({ results, sourceData }: CitationOutputProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Your Citations
      </h3>

      {results.map((result, index) => {
        const styleInfo = CITATION_STYLES[result.style];
        return (
          <div
            key={`${result.style}-${index}`}
            className="group rounded-xl border border-border bg-background overflow-hidden transition-all hover:border-primary/20 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: styleInfo.color }}
                />
                <span className="text-sm font-semibold">{styleInfo.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <SaveButton result={result} sourceData={sourceData} />
                <CopyButton text={result.formatted} label="Copy" />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <FileText className="h-3 w-3" />
                  Reference / Bibliography Entry
                </div>
                <div
                  className="citation-text text-sm leading-relaxed pl-8 -indent-8"
                  dangerouslySetInnerHTML={{ __html: formatCitationHTML(result.formatted) }}
                />
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <Quote className="h-3 w-3" />
                      {result.style === "bluebook" ? "Short Form" : result.style === "chicago" || result.style === "turabian" ? "Footnote" : "In-Text Citation"}
                    </div>
                    <div
                      className="citation-text text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: formatCitationHTML(result.inText) }}
                    />
                  </div>
                  <CopyButton text={result.inText} label="Copy" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
