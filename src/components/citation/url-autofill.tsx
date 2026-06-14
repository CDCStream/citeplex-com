"use client";

import { useState } from "react";
import { Sparkles, Loader2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface URLAutofillProps {
  onAutofill: (data: Record<string, string>) => void;
}

export function URLAutofill({ onAutofill }: URLAutofillProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAutofill = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const data = await res.json();
      onAutofill(data);
    } catch {
      setError("Could not auto-fill. Please enter details manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAutofill();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Quick Fill (URL, DOI, or ISBN)
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a URL, DOI (10.xxxx/...), or ISBN..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
          />
        </div>
        <button
          type="button"
          onClick={handleAutofill}
          disabled={loading || !input.trim()}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
            loading || !input.trim()
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Auto-fill
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
