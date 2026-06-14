"use client";

import { useState, useCallback, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { StyleSelector } from "@/components/citation/style-selector";
import { SourceTypeSelector } from "@/components/citation/source-type-selector";
import { SourceForm } from "@/components/citation/source-form";
import { CitationOutput } from "@/components/citation/citation-output";
import { URLAutofill } from "@/components/citation/url-autofill";
import { type CitationStyle, type SourceType, type SourceData, type CitationResult, CITATION_STYLES, SOURCE_TYPES } from "@/lib/citation-styles";
import { generateCitation, generateAllStyles } from "@/lib/citation-engine";
import { BookOpen, RotateCcw, Layers } from "lucide-react";

export default function GeneratePage() {
  const [style, setStyle] = useState<CitationStyle>("apa7");
  const [sourceType, setSourceType] = useState<SourceType>("website");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("style");
    if (s && s in CITATION_STYLES) setStyle(s as CitationStyle);
    const t = params.get("type");
    if (t && t in SOURCE_TYPES) setSourceType(t as SourceType);
  }, []);
  const [results, setResults] = useState<CitationResult[]>([]);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [autofillData, setAutofillData] = useState<Record<string, string>>({});
  const [lastSourceData, setLastSourceData] = useState<SourceData | null>(null);

  const handleGenerate = useCallback(
    (data: SourceData) => {
      setLastSourceData(data);
      if (showAllStyles) {
        const allResults = generateAllStyles(data);
        setResults(allResults);
      } else {
        const result = generateCitation(data, style);
        setResults([result]);
      }
      const el = document.getElementById("citation-results");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    },
    [style, showAllStyles]
  );

  const handleReset = () => {
    setResults([]);
    setAutofillData({});
    setLastSourceData(null);
  };

  const handleAutofill = (data: Record<string, string>) => {
    setAutofillData(data);
  };

  return (
    <div className="flex flex-col min-h-full">
      <Toaster position="bottom-right" />
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-12">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Citation Generator</h1>
            </div>
            <p className="text-muted-foreground">
              Generate perfectly formatted citations in seconds. Choose your style, source type, and fill in the details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left column — form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Style selector */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <StyleSelector selected={style} onChange={setStyle} />
              </div>

              {/* Source type selector */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <SourceTypeSelector selected={sourceType} onChange={setSourceType} style={style} />
              </div>

              {/* URL Autofill */}
              <div className="rounded-2xl border border-primary/20 bg-primary/2 p-6">
                <URLAutofill onAutofill={handleAutofill} />
              </div>

              {/* Source form */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-foreground">Source Details</h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAllStyles(!showAllStyles)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        showAllStyles
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      All styles
                    </button>
                    {results.length > 0 && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <SourceForm
                  key={`${sourceType}-${JSON.stringify(autofillData)}`}
                  sourceType={sourceType}
                  onSubmit={handleGenerate}
                />
              </div>
            </div>

            {/* Right column — output */}
            <div className="lg:col-span-2" id="citation-results">
              {results.length > 0 ? (
                <div className="sticky top-24">
                  <CitationOutput results={results} sourceData={lastSourceData} />
                </div>
              ) : (
                <div className="sticky top-24 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">No citations yet</h3>
                  <p className="mt-2 text-xs text-muted-foreground max-w-[200px] mx-auto">
                    Fill in the source details on the left and click &ldquo;Generate Citation&rdquo; to see your formatted reference here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
