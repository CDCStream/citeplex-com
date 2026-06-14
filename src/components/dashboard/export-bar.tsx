"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Download, ChevronDown, Lock, Crown } from "lucide-react";
import type { Citation, Plan } from "@/lib/supabase/types";
import { EXPORT_FORMATS, buildExport, type ExportFormat } from "@/lib/export";
import { logCitationExport } from "@/lib/actions/citations";

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportBar({
  citations,
  plan,
  scopeName,
}: {
  citations: Citation[];
  plan: Plan;
  scopeName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isPro = plan !== "free";
  const disabled = citations.length === 0;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const doExport = (format: ExportFormat) => {
    setOpen(false);
    const meta = EXPORT_FORMATS.find((f) => f.id === format)!;
    try {
      const content = buildExport(citations, format);
      const safeName = scopeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "citations";
      downloadBlob(content, `${safeName}.${meta.ext}`, meta.mime);
      toast.success(`Exported ${citations.length} to ${meta.label}`);
      void logCitationExport(format, citations.length);
    } catch {
      toast.error("Export failed");
    }
  };

  if (!isPro) {
    return (
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/5 px-3.5 py-2 text-[12px] font-medium text-amber-600 transition-colors hover:bg-amber-500/10"
        title="Export is a Pro feature"
      >
        <Lock className="h-3.5 w-3.5" />
        Export
        <Crown className="h-3.5 w-3.5" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-[12px] font-medium transition-colors hover:bg-muted disabled:opacity-40"
      >
        <Download className="h-3.5 w-3.5" />
        Export
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-lg">
          <p className="px-3 py-1.5 text-[11px] text-muted-foreground">
            Export {citations.length} {citations.length === 1 ? "citation" : "citations"}
          </p>
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => doExport(f.id)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors hover:bg-muted"
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
