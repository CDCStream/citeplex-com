"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Copy, Check, Trash2, FolderInput, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITATION_STYLES } from "@/lib/citation-styles";
import type { Citation, Project } from "@/lib/supabase/types";
import { deleteCitation, moveCitationToProject } from "@/lib/actions/citations";

function toHTML(text: string) {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function CitationCard({
  citation,
  projects,
}: {
  citation: Citation;
  projects: Project[];
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const styleInfo = CITATION_STYLES[citation.style];

  const copy = async () => {
    await navigator.clipboard.writeText(citation.formatted.replace(/\*(.*?)\*/g, "$1"));
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1800);
  };

  const remove = () => {
    if (!confirm("Delete this citation?")) return;
    startTransition(async () => {
      const res = await deleteCitation(citation.id);
      if (res.ok) toast.success("Deleted");
      else toast.error(res.error || "Could not delete");
    });
  };

  const move = (projectId: string) => {
    startTransition(async () => {
      const res = await moveCitationToProject(
        citation.id,
        projectId === "none" ? null : projectId
      );
      if (res.ok) toast.success("Moved");
      else toast.error(res.error || "Could not move");
    });
  };

  return (
    <div className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/20">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: styleInfo?.color }} />
          {styleInfo?.label ?? citation.style}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <select
            value={citation.project_id ?? "none"}
            onChange={(e) => move(e.target.value)}
            disabled={pending}
            title="Move to project"
            className="rounded-md border border-border bg-background px-1.5 py-1 text-[11px] text-muted-foreground outline-none"
          >
            <option value="none">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={copy}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              copied ? "text-emerald-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={remove}
            disabled={pending}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <p
        className="citation-text pl-6 -indent-6 text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: toHTML(citation.formatted) }}
      />
      {citation.in_text && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <FolderInput className="h-3 w-3" />
          <span dangerouslySetInnerHTML={{ __html: toHTML(citation.in_text) }} />
        </p>
      )}
    </div>
  );
}

export function CitationsList({
  citations,
  projects,
}: {
  citations: Citation[];
  projects: Project[];
}) {
  if (citations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No citations here yet</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
          Generate a citation and hit “Save” to build your library.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {citations.map((c) => (
        <CitationCard key={c.id} citation={c} projects={projects} />
      ))}
    </div>
  );
}
