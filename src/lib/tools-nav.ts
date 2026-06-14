export interface ToolLink {
  name: string;
  href: string;
  desc: string;
  tag?: string;
}

export const TOOL_GROUPS: { label: string; tools: ToolLink[] }[] = [
  {
    label: "Citations",
    tools: [
      { name: "Citation Generator", href: "/generate", desc: "11 styles · instant · free" },
      { name: "Annotated Bibliography", href: "/annotated-bibliography", desc: "Cite + write annotations" },
      { name: "Style Guides", href: "/styles", desc: "APA, MLA, IEEE, AMA & more" },
    ],
  },
  {
    label: "Essay writing",
    tools: [
      { name: "Thesis Statement", href: "/thesis-statement-generator", desc: "Argumentative & more", tag: "AI" },
      { name: "Essay Outline", href: "/essay-outline-generator", desc: "5-paragraph & research", tag: "AI" },
      { name: "Hook Generator", href: "/hook-generator", desc: "Opening lines that grab", tag: "AI" },
      { name: "Conclusion Generator", href: "/conclusion-generator", desc: "Strong closing paragraphs", tag: "AI" },
    ],
  },
  {
    label: "Writing & editing",
    tools: [
      { name: "Plagiarism Checker", href: "/plagiarism-checker", desc: "Scan for matched sources", tag: "Pro" },
      { name: "Grammar Checker", href: "/grammar-checker", desc: "Spelling, grammar, punctuation" },
      { name: "Punctuation Checker", href: "/punctuation-checker", desc: "Commas, periods & spacing" },
      { name: "Paraphrasing Tool", href: "/paraphrasing-tool", desc: "Rewrite in your tone", tag: "AI" },
      { name: "Summarizer", href: "/summarizer", desc: "Condense long texts", tag: "AI" },
    ],
  },
  {
    label: "Utilities",
    tools: [
      { name: "Word Counter", href: "/word-counter", desc: "Words, reading time, density" },
      { name: "Character Counter", href: "/character-counter", desc: "With & without spaces" },
      { name: "Case Converter", href: "/case-converter", desc: "Title case, uppercase & more" },
    ],
  },
];

export const ALL_TOOLS = TOOL_GROUPS.flatMap((g) => g.tools);
