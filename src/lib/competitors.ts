// Data for programmatic comparison / alternative pages (/vs/[competitor]).
// Claims are kept factual and hedged ("as of 2026", "per public reviews") to
// stay fair and defensible. CitePlex's own column is the single source of truth
// for our positioning across every comparison page.

export interface CompareRow {
  feature: string;
  citeplex: string;
  competitor: string;
  /** Which side this row favours — used to tint the cells. */
  win: "citeplex" | "competitor" | "tie";
}

export interface Competitor {
  slug: string;
  name: string;
  /** Short tagline shown under the H1. */
  blurb: string;
  /** One-paragraph intro framing the comparison. */
  intro: string;
  /** Meta description seed. */
  metaDescription: string;
  /** The headline reasons to pick CitePlex over this competitor. */
  whyCiteplex: string[];
  /** Where the competitor is genuinely a reasonable choice (builds trust). */
  whenCompetitor: string;
  rows: CompareRow[];
  faqs: { q: string; a: string }[];
}

const CITEPLEX = {
  ads: "No ads, ever",
  styles: "11 hand-tuned styles (incl. Bluebook, IEEE, AMA, ACS, CSE, ASA)",
  free: "Unlimited generate & copy, free forever",
  account: "No sign-up to generate",
  legal: "Bluebook 22nd ed. (cases, statutes)",
  ai: "AI essay tools (thesis, outline, paraphrase, summarize)",
  price: "Pro $9.99/mo (or $6.58/mo annual)",
  export: "Word, BibTeX & RIS (Pro)",
  speed: "Client-side engine (~80ms)",
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "easybib",
    name: "EasyBib",
    blurb: "A free, ad-free EasyBib alternative with 11 styles and no paywall on basic citations.",
    intro:
      "EasyBib is one of the oldest citation tools, now owned by Chegg. Its free tier is largely limited to MLA, with APA and other styles gated behind a paid plan, and the experience is heavy with ads. CitePlex generates citations in all 11 styles for free, with no ads and no account required.",
    metaDescription:
      "CitePlex vs EasyBib: a free, ad-free alternative with all 11 citation styles unlocked (APA, MLA, Chicago, Bluebook), no paywall, and AI writing tools. Compare side by side.",
    whyCiteplex: [
      "All 11 styles free — EasyBib gates APA and most styles behind a paid plan",
      "Zero ads vs EasyBib's ad-heavy interface",
      "Bluebook legal citations EasyBib doesn't offer",
      "No forced account to start citing",
    ],
    whenCompetitor:
      "EasyBib's browser extension and long history mean some students already have workflows built around it, and its grammar/plagiarism add-ons are bundled with a Chegg subscription.",
    rows: [
      { feature: "Ads", citeplex: CITEPLEX.ads, competitor: "Ad-supported interface", win: "citeplex" },
      { feature: "Free styles", citeplex: "All 11 styles free", competitor: "MLA free; APA & others paid", win: "citeplex" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Not supported", win: "citeplex" },
      { feature: "Account required", citeplex: CITEPLEX.account, competitor: "Pushed to sign up", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Via Chegg subscription", win: "tie" },
      { feature: "Export", citeplex: CITEPLEX.export, competitor: "Word (paid)", win: "citeplex" },
      { feature: "Price", citeplex: CITEPLEX.price, competitor: "~$9.95/mo for full styles", win: "citeplex" },
    ],
    faqs: [
      {
        q: "Is CitePlex a free EasyBib alternative?",
        a: "Yes. CitePlex lets you generate and copy citations in all 11 styles for free, with no ads and no account. EasyBib's free tier is largely limited to MLA, with APA and other styles behind a paid plan.",
      },
      {
        q: "Does CitePlex support APA for free?",
        a: "Yes — APA 7th edition is free on CitePlex, along with MLA, Chicago, Turabian, Bluebook, Harvard, AMA, IEEE, ACS, CSE, and ASA.",
      },
      {
        q: "Can I cite legal cases like on EasyBib?",
        a: "CitePlex supports Bluebook 22nd edition for cases, statutes, and law-review sources — something EasyBib does not offer.",
      },
    ],
  },
  {
    slug: "citation-machine",
    name: "Citation Machine",
    blurb: "A faster, ad-free Citation Machine alternative — all styles free, no clutter.",
    intro:
      "Citation Machine, also part of Chegg, follows the same model as EasyBib: a limited free tier, paid upgrades for full style support, and an ad-heavy interface that public reviews frequently rate poorly. CitePlex is a clean, ad-free alternative with every style free.",
    metaDescription:
      "CitePlex vs Citation Machine: ad-free, all 11 citation styles free, Bluebook legal support, and AI writing tools. A faster, cleaner Citation Machine alternative.",
    whyCiteplex: [
      "No ads — Citation Machine's interface is ad-heavy",
      "All 11 styles free, no paywall on APA",
      "Bluebook legal citations included",
      "Client-side engine generates instantly",
    ],
    whenCompetitor:
      "Citation Machine bundles grammar and plagiarism checking inside a Chegg subscription, which may suit users already paying for Chegg.",
    rows: [
      { feature: "Ads", citeplex: CITEPLEX.ads, competitor: "Ad-supported", win: "citeplex" },
      { feature: "Free styles", citeplex: "All 11 styles free", competitor: "Limited free; full styles paid", win: "citeplex" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Not supported", win: "citeplex" },
      { feature: "Speed", citeplex: CITEPLEX.speed, competitor: "Server round-trips + ads", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Via Chegg subscription", win: "tie" },
      { feature: "Account required", citeplex: CITEPLEX.account, competitor: "Encouraged", win: "citeplex" },
      { feature: "Price", citeplex: CITEPLEX.price, competitor: "~$9.95/mo", win: "citeplex" },
    ],
    faqs: [
      {
        q: "Is CitePlex a good Citation Machine alternative?",
        a: "Yes. CitePlex offers all 11 citation styles free with no ads and no sign-up, plus Bluebook legal citations and AI writing tools — a cleaner, faster alternative to Citation Machine.",
      },
      {
        q: "Do I need to pay for APA on CitePlex?",
        a: "No. APA and all other styles are free to generate and copy. You only need Pro to save unlimited citations and export to Word, BibTeX, or RIS.",
      },
    ],
  },
  {
    slug: "scribbr",
    name: "Scribbr",
    blurb: "A Scribbr alternative with more styles, Bluebook legal support, and AI writing tools.",
    intro:
      "Scribbr is well regarded for accurate APA citations and helpful guides, but its generator focuses on four styles (APA, MLA, Chicago, Harvard) and upsells paid proofreading and plagiarism services. CitePlex covers 11 styles — including legal Bluebook — and bundles AI essay tools.",
    metaDescription:
      "CitePlex vs Scribbr: 11 citation styles vs 4, Bluebook legal citations, AI essay tools, and free unlimited generation. Compare the two side by side.",
    whyCiteplex: [
      "11 styles vs Scribbr's 4 (adds IEEE, AMA, ACS, CSE, ASA, Turabian, Bluebook)",
      "Bluebook legal citations for law students",
      "Built-in AI writing tools (thesis, outline, paraphrase)",
      "No upsell to paid proofreading to use the tool",
    ],
    whenCompetitor:
      "Scribbr is an excellent choice if you specifically want its detailed APA guidance and editorial/proofreading services, which are a core part of its platform.",
    rows: [
      { feature: "Citation styles", citeplex: CITEPLEX.styles, competitor: "APA, MLA, Chicago, Harvard (4)", win: "citeplex" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Not supported", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Limited", win: "citeplex" },
      { feature: "Ads", citeplex: CITEPLEX.ads, competitor: "No ads", win: "tie" },
      { feature: "APA guidance", citeplex: "Style guides for all 11", competitor: "Very strong APA guides", win: "competitor" },
      { feature: "Export", citeplex: CITEPLEX.export, competitor: "Word, BibTeX", win: "tie" },
      { feature: "Price", citeplex: CITEPLEX.price, competitor: "Free generator; paid services", win: "tie" },
    ],
    faqs: [
      {
        q: "How is CitePlex different from Scribbr?",
        a: "CitePlex supports 11 citation styles (including Bluebook for legal sources) versus Scribbr's four, and bundles AI essay tools. Scribbr is known for in-depth APA guidance and paid proofreading services.",
      },
      {
        q: "Does CitePlex support Harvard referencing like Scribbr?",
        a: "Yes — Harvard referencing is one of the 11 styles CitePlex supports, alongside APA, MLA, Chicago, and seven more.",
      },
    ],
  },
  {
    slug: "mybib",
    name: "MyBib",
    blurb: "A MyBib alternative with curated, hand-tuned styles, legal citations, and AI tools.",
    intro:
      "MyBib is a popular free, ad-free generator with thousands of CSL styles. Its strength is breadth; its trade-off is that auto-generated CSL output can vary in quality. CitePlex focuses on 11 carefully hand-tuned styles, adds Bluebook legal support, and includes AI writing tools.",
    metaDescription:
      "CitePlex vs MyBib: hand-tuned citation styles, Bluebook legal support, and AI writing tools versus MyBib's broad CSL library. Compare side by side.",
    whyCiteplex: [
      "Hand-tuned styles for consistent, reviewed output",
      "Bluebook 22nd ed. legal citations",
      "AI essay tools built in",
      "Modern, fast, ad-free UI",
    ],
    whenCompetitor:
      "MyBib is a great pick if you need a rare or journal-specific CSL style outside our 11 supported formats, since it draws on thousands of community styles.",
    rows: [
      { feature: "Ads", citeplex: CITEPLEX.ads, competitor: "No ads", win: "tie" },
      { feature: "Style approach", citeplex: "11 hand-tuned styles", competitor: "9,000+ CSL styles (auto)", win: "tie" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Limited", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Not offered", win: "citeplex" },
      { feature: "Free generation", citeplex: CITEPLEX.free, competitor: "Free", win: "tie" },
      { feature: "Export", citeplex: CITEPLEX.export, competitor: "Word, BibTeX", win: "tie" },
      { feature: "Niche CSL styles", citeplex: "11 core styles", competitor: "Thousands of CSL styles", win: "competitor" },
    ],
    faqs: [
      {
        q: "Is CitePlex better than MyBib?",
        a: "It depends on your needs. CitePlex offers hand-tuned styles, Bluebook legal citations, and AI writing tools. MyBib offers a larger library of auto-generated CSL styles. For most students citing in major styles, CitePlex gives more consistent output plus essay tools.",
      },
      {
        q: "Does CitePlex have AI writing tools that MyBib lacks?",
        a: "Yes — CitePlex includes AI thesis, outline, hook, conclusion, paraphrasing, and summarizing tools alongside the citation generator.",
      },
    ],
  },
  {
    slug: "bibme",
    name: "BibMe",
    blurb: "A free, ad-free BibMe alternative with all 11 styles and no paywall.",
    intro:
      "BibMe is another Chegg-owned generator that follows the familiar pattern: free MLA, paid upgrades for APA and other styles, and ads throughout. CitePlex unlocks every style for free with no ads.",
    metaDescription:
      "CitePlex vs BibMe: a free, ad-free BibMe alternative with all 11 citation styles, Bluebook legal support, and AI writing tools. Compare side by side.",
    whyCiteplex: [
      "All 11 styles free vs BibMe's MLA-only free tier",
      "No ads",
      "Bluebook legal citations",
      "AI writing tools included",
    ],
    whenCompetitor:
      "BibMe integrates with Chegg's grammar and plagiarism tools, which may appeal to existing Chegg subscribers.",
    rows: [
      { feature: "Ads", citeplex: CITEPLEX.ads, competitor: "Ad-supported", win: "citeplex" },
      { feature: "Free styles", citeplex: "All 11 styles free", competitor: "MLA free; others paid", win: "citeplex" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Not supported", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Via Chegg", win: "tie" },
      { feature: "Account required", citeplex: CITEPLEX.account, competitor: "Encouraged", win: "citeplex" },
      { feature: "Price", citeplex: CITEPLEX.price, competitor: "~$9.95/mo", win: "citeplex" },
    ],
    faqs: [
      {
        q: "Is CitePlex a free BibMe alternative?",
        a: "Yes. CitePlex generates citations in all 11 styles for free with no ads or sign-up, while BibMe limits its free tier mainly to MLA.",
      },
    ],
  },
  {
    slug: "zoterobib",
    name: "ZoteroBib",
    blurb: "A ZoteroBib alternative that adds saving, projects, legal citations, and AI tools.",
    intro:
      "ZoteroBib is a fast, free, account-free generator from the Zotero team with thousands of CSL styles. It's excellent for one-off bibliographies but intentionally minimal — no accounts, no saved projects, no writing tools. CitePlex adds saved citations, projects, Bluebook, and AI essay tools on top of free generation.",
    metaDescription:
      "CitePlex vs ZoteroBib: free citations plus saved projects, citation history, Bluebook legal support, and AI writing tools. Compare side by side.",
    whyCiteplex: [
      "Save citations & organize projects (ZoteroBib is session-only)",
      "Bluebook legal citations",
      "AI essay tools (thesis, outline, paraphrase, summarize)",
      "Citation history with a free account",
    ],
    whenCompetitor:
      "ZoteroBib is ideal for a quick, one-off bibliography when you have DOIs/ISBNs and want maximum CSL style coverage with zero setup.",
    rows: [
      { feature: "Saved citations", citeplex: "Save & organize in projects", competitor: "Session-only (no account)", win: "citeplex" },
      { feature: "Bluebook (legal)", citeplex: CITEPLEX.legal, competitor: "Via CSL only", win: "citeplex" },
      { feature: "AI writing tools", citeplex: CITEPLEX.ai, competitor: "Not offered", win: "citeplex" },
      { feature: "Account-free generation", citeplex: CITEPLEX.account, competitor: "No account, ever", win: "tie" },
      { feature: "Style coverage", citeplex: "11 hand-tuned styles", competitor: "10,000+ CSL styles", win: "competitor" },
      { feature: "Export", citeplex: CITEPLEX.export, competitor: "Copy, RTF, HTML", win: "tie" },
    ],
    faqs: [
      {
        q: "How is CitePlex different from ZoteroBib?",
        a: "ZoteroBib is a minimal, session-based generator with a huge CSL library. CitePlex adds saved citations, organized projects, citation history, Bluebook legal support, and AI writing tools, while still letting you generate for free.",
      },
    ],
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}
