"use client";

import { useState } from "react";
import { type SourceData, type SourceType, type Author, SOURCE_TYPES } from "@/lib/citation-styles";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  authors: "Authors",
  siteName: "Website Name",
  url: "URL",
  year: "Year",
  month: "Month",
  day: "Day",
  accessDate: "Access Date",
  doi: "DOI",
  isbn: "ISBN",
  publisher: "Publisher",
  publisherLocation: "Publisher Location",
  journalName: "Journal Name",
  volume: "Volume",
  issue: "Issue",
  pages: "Pages",
  edition: "Edition",
  editors: "Editors",
  chapter: "Chapter",
  caseName: "Case Name",
  court: "Court",
  reporter: "Reporter",
  reporterVolume: "Reporter Volume",
  firstPage: "First Page",
  pinpointPage: "Pinpoint Page",
  decisionDate: "Decision Date",
  docketNumber: "Docket Number",
  statuteName: "Statute Name",
  codeTitle: "Title Number",
  codeAbbreviation: "Code Abbreviation",
  codeSection: "Section",
  statuteYear: "Year",
  channelName: "Channel Name",
  platform: "Platform",
  duration: "Duration",
  degreeType: "Degree Type",
  institution: "University / Institution",
  database: "Database / Archive",
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  title: "Enter the title of the source",
  url: "https://example.com/article",
  doi: "10.1234/example.5678",
  isbn: "978-0-123456-78-9",
  publisher: "Oxford University Press",
  publisherLocation: "New York, NY",
  journalName: "Journal of Modern Research",
  volume: "12",
  issue: "3",
  pages: "45-67",
  edition: "3rd",
  year: "2024",
  month: "6",
  day: "15",
  siteName: "Example News",
  accessDate: "June 15, 2024",
  caseName: "Brown v. Board of Education",
  court: "S. Ct.",
  reporter: "U.S.",
  reporterVolume: "347",
  firstPage: "483",
  pinpointPage: "495",
  decisionDate: "1954",
  docketNumber: "No. 21-1234",
  statuteName: "Clean Air Act",
  codeTitle: "42",
  codeAbbreviation: "U.S.C.",
  codeSection: "7401",
  statuteYear: "2018",
  channelName: "TED",
  platform: "YouTube",
  duration: "15:32",
  chapter: "Chapter 5",
  degreeType: "Doctoral dissertation",
  institution: "Harvard University",
  database: "ProQuest Dissertations & Theses",
};

interface SourceFormProps {
  sourceType: SourceType;
  onSubmit: (data: SourceData) => void;
}

function AuthorInput({
  author,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  author: Author;
  index: number;
  onChange: (index: number, author: Author) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={author.firstName}
          onChange={(e) => onChange(index, { ...author, firstName: e.target.value })}
          placeholder="First name"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        <input
          type="text"
          value={author.lastName}
          onChange={(e) => onChange(index, { ...author, lastName: e.target.value })}
          placeholder="Last name"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SourceForm({ sourceType, onSubmit }: SourceFormProps) {
  const fields = SOURCE_TYPES[sourceType].fields;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [authors, setAuthors] = useState<Author[]>([{ firstName: "", lastName: "" }]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthorChange = (index: number, author: Author) => {
    setAuthors((prev) => {
      const next = [...prev];
      next[index] = author;
      return next;
    });
  };

  const handleAddAuthor = () => {
    setAuthors((prev) => [...prev, { firstName: "", lastName: "" }]);
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: SourceData = {
      sourceType,
      ...formData,
      authors: authors.filter((a) => a.firstName || a.lastName),
    } as unknown as SourceData;
    onSubmit(data);
  };

  const renderField = (field: string) => {
    if (field === "authors" || field === "editors") {
      return (
        <div key={field} className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {FIELD_LABELS[field] || field}
          </label>
          <div className="space-y-2">
            {authors.map((author, index) => (
              <AuthorInput
                key={index}
                author={author}
                index={index}
                onChange={handleAuthorChange}
                onRemove={handleRemoveAuthor}
                canRemove={authors.length > 1}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddAuthor}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add another author
          </button>
        </div>
      );
    }

    const isSmallField = ["year", "month", "day", "volume", "issue", "edition", "reporterVolume", "firstPage", "pinpointPage", "codeTitle", "codeSection", "statuteYear"].includes(field);

    return (
      <div key={field} className={cn("space-y-1.5", isSmallField ? "col-span-1" : "col-span-2")}>
        <label className="text-sm font-medium text-foreground">
          {FIELD_LABELS[field] || field}
        </label>
        <input
          type="text"
          value={formData[field] || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={FIELD_PLACEHOLDERS[field] || ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {fields.map(renderField)}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Generate Citation
      </button>
    </form>
  );
}
