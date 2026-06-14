"use client";

import { type SourceType, SOURCE_TYPES } from "@/lib/citation-styles";
import { cn } from "@/lib/utils";
import {
  Globe,
  BookOpen,
  FileText,
  Scale,
  Landmark,
  Newspaper,
  Video,
  FileDown,
  GraduationCap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  BookOpen,
  FileText,
  Scale,
  Landmark,
  Newspaper,
  Video,
  FileDown,
  GraduationCap,
};

interface SourceTypeSelectorProps {
  selected: SourceType;
  onChange: (type: SourceType) => void;
  style: string;
}

export function SourceTypeSelector({ selected, onChange, style }: SourceTypeSelectorProps) {
  const isLegalStyle = style === "bluebook";

  const orderedTypes: SourceType[] = isLegalStyle
    ? ["case_law", "statute", "book", "journal", "website", "newspaper", "video", "pdf", "dissertation"]
    : ["website", "book", "journal", "newspaper", "video", "pdf", "dissertation", "case_law", "statute"];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">Source Type</label>
      <div className="flex flex-wrap gap-2">
        {orderedTypes.map((key) => {
          const sourceType = SOURCE_TYPES[key];
          const Icon = iconMap[sourceType.icon];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
                selected === key
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {sourceType.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
