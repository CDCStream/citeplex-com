export type CitationStyle =
  | "apa7"
  | "mla9"
  | "chicago"
  | "turabian"
  | "bluebook"
  | "harvard"
  | "ama"
  | "ieee"
  | "acs"
  | "cse"
  | "asa";

export type SourceType =
  | "website"
  | "book"
  | "journal"
  | "case_law"
  | "statute"
  | "newspaper"
  | "video"
  | "pdf"
  | "dissertation";

export interface SourceData {
  sourceType: SourceType;
  // Common fields
  title?: string;
  authors?: Author[];
  year?: string;
  month?: string;
  day?: string;
  url?: string;
  accessDate?: string;
  doi?: string;
  isbn?: string;
  publisher?: string;
  publisherLocation?: string;
  // Journal / article specific
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  // Book specific
  edition?: string;
  editors?: Author[];
  chapter?: string;
  // Website specific
  siteName?: string;
  // Case law (Bluebook)
  caseName?: string;
  court?: string;
  reporter?: string;
  reporterVolume?: string;
  firstPage?: string;
  pinpointPage?: string;
  decisionDate?: string;
  docketNumber?: string;
  // Statute
  statuteName?: string;
  codeTitle?: string;
  codeSection?: string;
  codeAbbreviation?: string;
  statuteYear?: string;
  // Video
  channelName?: string;
  platform?: string;
  duration?: string;
  // Dissertation / thesis
  institution?: string;
  degreeType?: string;
  database?: string;
}

export interface Author {
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  isOrganization?: boolean;
  organizationName?: string;
}

export interface CitationResult {
  formatted: string;
  inText: string;
  style: CitationStyle;
  sourceType: SourceType;
}

export const CITATION_STYLES: Record<
  CitationStyle,
  { label: string; description: string; color: string }
> = {
  apa7: {
    label: "APA 7th Edition",
    description: "American Psychological Association — social sciences, psychology, education",
    color: "#2563eb",
  },
  mla9: {
    label: "MLA 9th Edition",
    description: "Modern Language Association — humanities, literature, arts",
    color: "#7c3aed",
  },
  chicago: {
    label: "Chicago 17th Edition",
    description: "Chicago Manual of Style — history, publishing, general academic",
    color: "#dc2626",
  },
  turabian: {
    label: "Turabian 9th Edition",
    description: "Student-focused Chicago variant — theses, dissertations, research papers",
    color: "#ea580c",
  },
  bluebook: {
    label: "Bluebook 22nd Edition",
    description: "Legal citation standard — law reviews, court briefs, memoranda",
    color: "#0891b2",
  },
  harvard: {
    label: "Harvard Referencing",
    description: "Author-date system — widely used in UK and Australia",
    color: "#059669",
  },
  ama: {
    label: "AMA 11th Edition",
    description: "American Medical Association — medicine, nursing, health sciences",
    color: "#e11d48",
  },
  ieee: {
    label: "IEEE",
    description: "Institute of Electrical and Electronics Engineers — engineering, computer science",
    color: "#4338ca",
  },
  acs: {
    label: "ACS",
    description: "American Chemical Society — chemistry and chemical sciences",
    color: "#0d9488",
  },
  cse: {
    label: "CSE 8th Edition",
    description: "Council of Science Editors — biology and the life sciences",
    color: "#65a30d",
  },
  asa: {
    label: "ASA 7th Edition",
    description: "American Sociological Association — sociology and social sciences",
    color: "#92400e",
  },
};

export const SOURCE_TYPES: Record<
  SourceType,
  { label: string; icon: string; fields: string[] }
> = {
  website: {
    label: "Website",
    icon: "Globe",
    fields: ["title", "authors", "siteName", "url", "year", "month", "day", "accessDate"],
  },
  book: {
    label: "Book",
    icon: "BookOpen",
    fields: ["title", "authors", "publisher", "publisherLocation", "year", "edition", "isbn", "editors", "chapter", "pages"],
  },
  journal: {
    label: "Journal Article",
    icon: "FileText",
    fields: ["title", "authors", "journalName", "year", "volume", "issue", "pages", "doi", "url"],
  },
  case_law: {
    label: "Case Law",
    icon: "Scale",
    fields: ["caseName", "reporterVolume", "reporter", "firstPage", "pinpointPage", "court", "decisionDate", "url"],
  },
  statute: {
    label: "Statute / Code",
    icon: "Landmark",
    fields: ["statuteName", "codeTitle", "codeAbbreviation", "codeSection", "statuteYear", "url"],
  },
  newspaper: {
    label: "Newspaper / Magazine",
    icon: "Newspaper",
    fields: ["title", "authors", "siteName", "year", "month", "day", "url", "pages"],
  },
  video: {
    label: "Video / YouTube",
    icon: "Video",
    fields: ["title", "authors", "channelName", "platform", "year", "month", "day", "url", "duration"],
  },
  pdf: {
    label: "PDF / Report",
    icon: "FileDown",
    fields: ["title", "authors", "publisher", "year", "url", "doi", "pages"],
  },
  dissertation: {
    label: "Dissertation / Thesis",
    icon: "GraduationCap",
    fields: ["title", "authors", "degreeType", "institution", "year", "database", "url", "doi"],
  },
};
