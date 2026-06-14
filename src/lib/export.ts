// Pure citation export helpers — produce BibTeX, RIS, and Word-ready HTML
// from saved citations. No DOM/browser APIs here so it stays SSR-safe; the
// actual file download lives in the client component.

import type { Citation } from "@/lib/supabase/types";
import type { Author, SourceData, SourceType } from "@/lib/citation-styles";

export type ExportFormat = "word" | "bibtex" | "ris" | "text";

export const EXPORT_FORMATS: { id: ExportFormat; label: string; ext: string; mime: string }[] = [
  { id: "word", label: "Word (.doc)", ext: "doc", mime: "application/msword" },
  { id: "bibtex", label: "BibTeX (.bib)", ext: "bib", mime: "application/x-bibtex" },
  { id: "ris", label: "RIS (.ris)", ext: "ris", mime: "application/x-research-info-systems" },
  { id: "text", label: "Plain text (.txt)", ext: "txt", mime: "text/plain" },
];

/** Strips the engine's `*italic*` markers for plain-text output. */
function stripMarkup(s: string): string {
  return s.replace(/\*(.*?)\*/g, "$1");
}

/** Converts the engine's `*italic*` markers to HTML <em> for Word output. */
function markupToHtml(s: string): string {
  return escapeHtml(s).replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function authorName(a: Author): string {
  if (a.isOrganization && a.organizationName) return a.organizationName;
  const first = [a.firstName, a.middleName].filter(Boolean).join(" ");
  return [a.lastName, first].filter(Boolean).join(", ");
}

// ─── BibTeX ───

const BIBTEX_TYPE: Record<SourceType, string> = {
  book: "book",
  journal: "article",
  newspaper: "article",
  website: "online",
  pdf: "techreport",
  dissertation: "phdthesis",
  video: "misc",
  case_law: "misc",
  statute: "misc",
};

function bibtexAuthors(authors?: Author[]): string {
  if (!authors?.length) return "";
  return authors
    .map((a) => (a.isOrganization && a.organizationName ? `{${a.organizationName}}` : authorName(a)))
    .join(" and ");
}

function bibtexKey(d: SourceData, index: number): string {
  const first = d.authors?.[0];
  const namePart = first
    ? (first.isOrganization ? first.organizationName : first.lastName) || "ref"
    : (d.title || d.caseName || d.statuteName || "ref");
  const slug = namePart.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) || "ref";
  return `${slug}${d.year || ""}${index > 0 ? `_${index}` : ""}`;
}

function bibtexField(name: string, value?: string): string | null {
  if (!value) return null;
  return `  ${name} = {${stripMarkup(value)}}`;
}

function toBibtexEntry(c: Citation, index: number): string {
  const d = c.source_data;
  const type = BIBTEX_TYPE[c.source_type] || "misc";
  const fields: (string | null)[] = [
    bibtexField("author", bibtexAuthors(d.authors)),
    bibtexField("title", d.title || c.title || d.caseName || d.statuteName || undefined),
    bibtexField("year", d.year || d.statuteYear),
    bibtexField("journal", d.journalName),
    bibtexField("volume", d.volume),
    bibtexField("number", d.issue),
    bibtexField("pages", d.pages?.replace(/-/g, "--")),
    bibtexField("publisher", d.publisher),
    bibtexField("address", d.publisherLocation),
    bibtexField("edition", d.edition),
    bibtexField("school", d.institution),
    bibtexField("doi", d.doi),
    bibtexField("isbn", d.isbn),
    bibtexField("url", d.url),
    bibtexField("urldate", d.accessDate),
    bibtexField("note", d.platform || d.channelName || d.court),
  ].filter(Boolean);

  return `@${type}{${bibtexKey(d, index)},\n${fields.join(",\n")}\n}`;
}

export function toBibTeX(citations: Citation[]): string {
  return citations.map((c, i) => toBibtexEntry(c, i)).join("\n\n") + "\n";
}

// ─── RIS ───

const RIS_TYPE: Record<SourceType, string> = {
  book: "BOOK",
  journal: "JOUR",
  newspaper: "NEWS",
  website: "ELEC",
  pdf: "RPRT",
  dissertation: "THES",
  video: "VIDEO",
  case_law: "CASE",
  statute: "STAT",
};

function risLine(tag: string, value?: string): string | null {
  if (!value) return null;
  return `${tag}  - ${stripMarkup(value)}`;
}

function toRisEntry(c: Citation): string {
  const d = c.source_data;
  const lines: (string | null)[] = [
    `TY  - ${RIS_TYPE[c.source_type] || "GEN"}`,
    ...(d.authors?.map((a) => risLine("AU", authorName(a))) || []),
    risLine("TI", d.title || c.title || d.caseName || d.statuteName || undefined),
    risLine("PY", d.year || d.statuteYear),
    risLine("JO", d.journalName),
    risLine("VL", d.volume),
    risLine("IS", d.issue),
    risLine("SP", d.pages?.split(/[-–]/)[0]?.trim()),
    risLine("EP", d.pages?.split(/[-–]/)[1]?.trim()),
    risLine("PB", d.publisher),
    risLine("CY", d.publisherLocation),
    risLine("ET", d.edition),
    risLine("DO", d.doi),
    risLine("SN", d.isbn),
    risLine("UR", d.url),
    risLine("Y2", d.accessDate),
    "ER  - ",
  ];
  return lines.filter(Boolean).join("\n");
}

export function toRIS(citations: Citation[]): string {
  return citations.map(toRisEntry).join("\n\n") + "\n";
}

// ─── Word (HTML doc) ───

/** A Word-openable HTML document with a hanging-indent reference list. */
export function toWordHTML(citations: Citation[], heading = "References"): string {
  const items = [...citations]
    .sort((a, b) => stripMarkup(a.formatted).localeCompare(stripMarkup(b.formatted)))
    .map((c) => `<p class="ref">${markupToHtml(c.formatted)}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>${escapeHtml(heading)}</title>
<style>
  body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 2; }
  h1 { font-size: 12pt; text-align: center; font-weight: bold; }
  p.ref { margin: 0 0 12pt 0; padding-left: 0.5in; text-indent: -0.5in; }
</style>
</head>
<body>
<h1>${escapeHtml(heading)}</h1>
${items}
</body>
</html>`;
}

// ─── Plain text ───

export function toPlainText(citations: Citation[]): string {
  return [...citations]
    .sort((a, b) => stripMarkup(a.formatted).localeCompare(stripMarkup(b.formatted)))
    .map((c) => stripMarkup(c.formatted))
    .join("\n\n") + "\n";
}

/** Builds the export payload for a given format. */
export function buildExport(citations: Citation[], format: ExportFormat): string {
  switch (format) {
    case "bibtex":
      return toBibTeX(citations);
    case "ris":
      return toRIS(citations);
    case "word":
      return toWordHTML(citations);
    case "text":
      return toPlainText(citations);
  }
}
