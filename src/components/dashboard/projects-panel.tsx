"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Plus, Folder, Layers, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, Citation } from "@/lib/supabase/types";
import { createProject, deleteProject } from "@/lib/actions/citations";

interface ProjectsPanelProps {
  projects: Project[];
  citations: Citation[];
  selected: string | null; // null = all, "none" = unfiled
  onSelect: (id: string | null) => void;
}

export function ProjectsPanel({ projects, citations, selected, onSelect }: ProjectsPanelProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  const countFor = (id: string | null) =>
    id === null
      ? citations.length
      : id === "none"
      ? citations.filter((c) => !c.project_id).length
      : citations.filter((c) => c.project_id === id).length;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const res = await createProject(trimmed);
      if (res.ok) {
        toast.success("Project created");
        setName("");
        setAdding(false);
      } else {
        toast.error(res.error || "Could not create");
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this project? Citations inside won't be deleted.")) return;
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.ok) {
        toast.success("Project deleted");
        if (selected === id) onSelect(null);
      } else {
        toast.error(res.error || "Could not delete");
      }
    });
  };

  const Row = ({
    id,
    label,
    icon,
    color,
  }: {
    id: string | null;
    label: string;
    icon: React.ReactNode;
    color?: string | null;
  }) => (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
        selected === id ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
      )}
    >
      <span className="flex items-center gap-2 truncate">
        {color ? (
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
        ) : (
          icon
        )}
        <span className="truncate">{label}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            selected === id ? "bg-background/20" : "bg-muted text-muted-foreground"
          )}
        >
          {countFor(id)}
        </span>
        {typeof id === "string" && id !== "none" && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              remove(id);
            }}
            className={cn(
              "rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100",
              selected === id ? "hover:bg-background/20" : "hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <Trash2 className="h-3 w-3" />
          </span>
        )}
      </span>
    </button>
  );

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Library
        </h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="New project"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-0.5">
        <Row id={null} label="All citations" icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />} />
        <Row id="none" label="Unfiled" icon={<Folder className="h-3.5 w-3.5 text-muted-foreground" />} />
      </div>

      {projects.length > 0 && (
        <>
          <div className="my-2 h-px bg-border" />
          <div className="space-y-0.5">
            {projects.map((p) => (
              <Row key={p.id} id={p.id} label={p.name} icon={null} color={p.color} />
            ))}
          </div>
        </>
      )}

      {adding && (
        <div className="mt-3 flex items-center gap-1.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Project name"
            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px] outline-none focus:border-foreground/40"
          />
          <button
            onClick={submit}
            disabled={pending}
            className="rounded-lg bg-foreground px-2.5 py-1.5 text-background disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
