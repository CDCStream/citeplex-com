import type { CitationStyle, SourceData } from "@/lib/citation-styles";

export interface StyleSeo {
  slug: string;
  /** Primary keyword shown in the H1, e.g. "APA Citation Generator". */
  keyword: string;
  /** One-paragraph intro for the landing page + meta description seed. */
  blurb: string;
  disciplines: string[];
  faqs: { q: string; a: string }[];
}

export const STYLE_SEO: Record<CitationStyle, StyleSeo> = {
  apa7: {
    slug: "apa",
    keyword: "APA Citation Generator",
    blurb:
      "Generate accurate APA 7th edition citations for websites, books, and journal articles in seconds. Free, ad-free, and built for psychology, education, nursing, and the social sciences.",
    disciplines: ["Psychology", "Education", "Nursing", "Business", "Social Sciences"],
    faqs: [
      { q: "What is APA 7th edition?", a: "APA (American Psychological Association) 7th edition is the citation style most widely used in psychology, education, nursing, and the social sciences. It uses an author–date in-text format and a reference list." },
      { q: "How do I cite a website in APA?", a: "List the author, year in parentheses, the page title in italics, the site name, and the URL. Our generator formats all of this automatically." },
      { q: "Does APA use in-text citations?", a: "Yes. APA uses author–date in-text citations such as (Smith, 2024, p. 45), paired with a full reference list entry." },
    ],
  },
  mla9: {
    slug: "mla",
    keyword: "MLA Citation Generator",
    blurb:
      "Create perfectly formatted MLA 9th edition works cited entries and in-text citations for free. Ideal for English, literature, and the humanities.",
    disciplines: ["English", "Literature", "Humanities", "Philosophy", "Cultural Studies"],
    faqs: [
      { q: "What is MLA 9th edition?", a: "MLA (Modern Language Association) 9th edition is the standard citation style for English, literature, and the humanities. It uses a Works Cited page and author–page in-text citations." },
      { q: "How do I cite a source in MLA?", a: "MLA follows a container-based system: author, title, container (e.g. journal or website), and publication details. Our generator handles the order and punctuation for you." },
      { q: "What does an MLA in-text citation look like?", a: "MLA in-text citations use the author's last name and page number, e.g. (Smith 45), with no comma between them." },
    ],
  },
  chicago: {
    slug: "chicago",
    keyword: "Chicago Citation Generator",
    blurb:
      "Generate Chicago Manual of Style (17th edition) citations — both notes-bibliography footnotes and bibliography entries — free and without ads.",
    disciplines: ["History", "Fine Arts", "Publishing", "Social Sciences"],
    faqs: [
      { q: "Which Chicago style does this support?", a: "We support the Chicago 17th edition notes-bibliography system, producing both a footnote and a bibliography entry for each source." },
      { q: "What's the difference between Chicago and Turabian?", a: "Turabian is a student-focused simplification of Chicago designed for theses and dissertations. The formatting is nearly identical." },
      { q: "How do I cite a book in Chicago?", a: "List the author, title in italics, and publication details (city, publisher, year). Our tool generates both the footnote and bibliography forms." },
    ],
  },
  turabian: {
    slug: "turabian",
    keyword: "Turabian Citation Generator",
    blurb:
      "Free Turabian 9th edition citation generator for student papers, theses, and dissertations. Produces footnotes and bibliography entries instantly.",
    disciplines: ["Student Papers", "Theses", "Dissertations", "Research Projects"],
    faqs: [
      { q: "What is Turabian style?", a: "Turabian is a student-oriented version of the Chicago Manual of Style, created by Kate Turabian for research papers, theses, and dissertations." },
      { q: "Is Turabian the same as Chicago?", a: "They are nearly identical. Turabian simplifies a few rules for students but follows Chicago's notes-bibliography structure." },
      { q: "Does Turabian use footnotes?", a: "Yes — Turabian commonly uses footnotes for citations along with a bibliography at the end of the paper." },
    ],
  },
  bluebook: {
    slug: "bluebook",
    keyword: "Bluebook Citation Generator",
    blurb:
      "Generate Bluebook (22nd edition) legal citations for cases, statutes, books, and law review articles. Free, fast, and made for law students and practitioners.",
    disciplines: ["Law Reviews", "Court Briefs", "Legal Memoranda", "Law School"],
    faqs: [
      { q: "What is Bluebook citation?", a: "The Bluebook is the standard legal citation system in the United States, used in law reviews, court briefs, and legal memoranda for cases, statutes, and secondary sources." },
      { q: "Can I cite a court case in Bluebook?", a: "Yes. Enter the case name, reporter volume, reporter, first page, court, and year, and our generator produces a correctly formatted case citation and short form." },
      { q: "Does this support statutes?", a: "Yes — we format U.S. Code and other statutory citations with the title, code abbreviation, section symbol, and year." },
    ],
  },
  harvard: {
    slug: "harvard",
    keyword: "Harvard Referencing Generator",
    blurb:
      "Create Harvard referencing style citations free. The author–date system widely used across UK and Australian universities.",
    disciplines: ["UK Universities", "Australian Universities", "International Studies"],
    faqs: [
      { q: "What is Harvard referencing?", a: "Harvard referencing is an author–date citation system used widely in UK, Australian, and international universities. It pairs in-text citations like (Smith, 2024) with a reference list." },
      { q: "Is there one official Harvard style?", a: "No single body governs Harvard referencing, so institutions vary slightly. Our generator follows the most common conventions; always check your university's guide." },
      { q: "How do I cite a website in Harvard?", a: "Include the author, year, title in italics, and 'Available at' URL with an access date. Our tool formats this automatically." },
    ],
  },
  ama: {
    slug: "ama",
    keyword: "AMA Citation Generator",
    blurb:
      "Free AMA (American Medical Association, 11th edition) citation generator for medicine, nursing, and health sciences. Numbered references with superscript in-text citations.",
    disciplines: ["Medicine", "Nursing", "Public Health", "Pharmacy", "Dentistry"],
    faqs: [
      { q: "What is AMA citation style?", a: "AMA (American Medical Association) style, currently in its 11th edition, is the standard for medical and health-science writing. It uses numbered references and superscript in-text citation numbers." },
      { q: "How are authors formatted in AMA?", a: "AMA lists the surname followed by initials with no periods, e.g. 'Smith JA'. List up to six authors, then use 'et al' for more." },
      { q: "How does AMA handle in-text citations?", a: "AMA uses superscript numbers (e.g. ¹) placed in the order sources are cited, corresponding to a numbered reference list." },
    ],
  },
  ieee: {
    slug: "ieee",
    keyword: "IEEE Citation Generator",
    blurb:
      "Generate IEEE citations free for engineering and computer science. Bracketed numbered references in the official IEEE reference format.",
    disciplines: ["Electrical Engineering", "Computer Science", "Robotics", "Telecommunications"],
    faqs: [
      { q: "What is IEEE citation style?", a: "IEEE style is used across engineering and computer science. References are numbered in the order they appear and cited in text with bracketed numbers like [1]." },
      { q: "How are authors written in IEEE?", a: "IEEE uses first and middle initials before the surname, e.g. 'J. A. Smith'. For more than six authors, list the first author followed by 'et al.'" },
      { q: "What does an IEEE in-text citation look like?", a: "IEEE in-text citations are bracketed numbers, e.g. [1], that match the numbered reference list." },
    ],
  },
  acs: {
    slug: "acs",
    keyword: "ACS Citation Generator",
    blurb:
      "Free ACS (American Chemical Society) citation generator for chemistry and the chemical sciences. Numbered references with superscript citations.",
    disciplines: ["Chemistry", "Biochemistry", "Materials Science", "Chemical Engineering"],
    faqs: [
      { q: "What is ACS citation style?", a: "ACS (American Chemical Society) style is the standard for chemistry publications. It uses abbreviated journal titles and supports numbered superscript in-text citations." },
      { q: "How are authors formatted in ACS?", a: "ACS lists the surname followed by initials with periods, separated by semicolons, e.g. 'Smith, J. A.; Doe, R. B.'" },
      { q: "Are journal titles abbreviated in ACS?", a: "Yes. ACS uses standardized CASSI journal abbreviations, set in italics, followed by the year, volume, and page range." },
    ],
  },
  cse: {
    slug: "cse",
    keyword: "CSE Citation Generator",
    blurb:
      "Free CSE (Council of Science Editors, 8th edition) citation generator for biology and the life sciences. Citation-sequence numbered references.",
    disciplines: ["Biology", "Ecology", "Genetics", "Zoology", "Botany"],
    faqs: [
      { q: "What is CSE citation style?", a: "CSE (Council of Science Editors) style is widely used in biology and the life sciences. This generator uses the citation-sequence system with numbered references." },
      { q: "How are authors formatted in CSE?", a: "CSE lists surnames followed by initials with no periods, e.g. 'Smith JA, Doe RB', with the year placed near the start of the reference." },
      { q: "What systems does CSE support?", a: "CSE offers name-year, citation-sequence, and citation-name systems. Our generator produces the commonly used citation-sequence format." },
    ],
  },
  asa: {
    slug: "asa",
    keyword: "ASA Citation Generator",
    blurb:
      "Free ASA (American Sociological Association, 7th edition) citation generator for sociology and the social sciences. Author–date references.",
    disciplines: ["Sociology", "Criminology", "Social Work", "Anthropology"],
    faqs: [
      { q: "What is ASA citation style?", a: "ASA (American Sociological Association) style is the standard for sociology. It uses an author–date in-text format with a references list, similar to APA with some differences." },
      { q: "How does ASA handle in-text citations?", a: "ASA uses author–date in-text citations like (Smith 2024) or with a page number (Smith 2024:45)." },
      { q: "How are authors formatted in ASA?", a: "The first author is inverted (Last, First) and subsequent authors are in natural order, joined with 'and'." },
    ],
  },
};

/** Sample sources used to render live, accurate examples on each style page. */
export const SEO_SAMPLES: { label: string; data: SourceData }[] = [
  {
    label: "Website",
    data: {
      sourceType: "website",
      title: "The effects of climate change on coral reefs",
      authors: [{ firstName: "Jane", lastName: "Goodall" }],
      siteName: "National Geographic",
      year: "2023",
      month: "5",
      day: "12",
      url: "https://www.nationalgeographic.com/environment/coral-reefs",
      accessDate: "June 1, 2024",
    },
  },
  {
    label: "Book",
    data: {
      sourceType: "book",
      title: "The Selfish Gene",
      authors: [{ firstName: "Richard", lastName: "Dawkins" }],
      publisher: "Oxford University Press",
      publisherLocation: "Oxford",
      year: "2016",
      edition: "4th",
    },
  },
  {
    label: "Journal article",
    data: {
      sourceType: "journal",
      title: "A programmable dual-RNA–guided DNA endonuclease",
      authors: [
        { firstName: "Jennifer", middleName: "A", lastName: "Doudna" },
        { firstName: "Emmanuelle", lastName: "Charpentier" },
      ],
      journalName: "Science",
      volume: "346",
      issue: "6213",
      pages: "1258096",
      year: "2014",
      doi: "10.1126/science.1258096",
    },
  },
];

export const slugToStyle: Record<string, CitationStyle> = Object.fromEntries(
  (Object.entries(STYLE_SEO) as [CitationStyle, StyleSeo][]).map(([style, seo]) => [seo.slug, style])
);

// ─── Source-type config for programmatic "how to cite a {source} in {style}" pages ───

import type { SourceType } from "@/lib/citation-styles";

export interface SourceSeo {
  /** SourceType key used by the engine. */
  type: SourceType;
  /** URL slug. */
  slug: string;
  /** Singular noun, e.g. "Website". */
  label: string;
  /** Article for natural phrasing, e.g. "a". */
  article: string;
  /** Fields a student typically needs to cite this source. */
  fields: string[];
  /** Sample source used to render a live example. */
  sample: SourceData;
}

export const SOURCE_SEO: Record<string, SourceSeo> = {
  website: {
    type: "website",
    slug: "website",
    label: "Website",
    article: "a",
    fields: ["Author or organization", "Page title", "Website name", "Publication date", "URL"],
    sample: {
      sourceType: "website",
      title: "The effects of climate change on coral reefs",
      authors: [{ firstName: "Jane", lastName: "Goodall" }],
      siteName: "National Geographic",
      year: "2023",
      month: "5",
      day: "12",
      url: "https://www.nationalgeographic.com/environment/coral-reefs",
      accessDate: "June 1, 2024",
    },
  },
  book: {
    type: "book",
    slug: "book",
    label: "Book",
    article: "a",
    fields: ["Author", "Book title", "Edition", "Publisher", "Place of publication", "Year"],
    sample: {
      sourceType: "book",
      title: "The Selfish Gene",
      authors: [{ firstName: "Richard", lastName: "Dawkins" }],
      publisher: "Oxford University Press",
      publisherLocation: "Oxford",
      year: "2016",
      edition: "4th",
    },
  },
  journal: {
    type: "journal",
    slug: "journal-article",
    label: "Journal Article",
    article: "a",
    fields: ["Author(s)", "Article title", "Journal name", "Volume", "Issue", "Page range", "Year", "DOI"],
    sample: {
      sourceType: "journal",
      title: "A programmable dual-RNA–guided DNA endonuclease",
      authors: [
        { firstName: "Jennifer", middleName: "A", lastName: "Doudna" },
        { firstName: "Emmanuelle", lastName: "Charpentier" },
      ],
      journalName: "Science",
      volume: "346",
      issue: "6213",
      pages: "1258096",
      year: "2014",
      doi: "10.1126/science.1258096",
    },
  },
  newspaper: {
    type: "newspaper",
    slug: "newspaper-article",
    label: "Newspaper Article",
    article: "a",
    fields: ["Author", "Article title", "Newspaper name", "Publication date", "URL"],
    sample: {
      sourceType: "newspaper",
      title: "Scientists warn of accelerating ice melt in Antarctica",
      authors: [{ firstName: "Maria", lastName: "Chen" }],
      journalName: "The New York Times",
      siteName: "The New York Times",
      year: "2024",
      month: "3",
      day: "8",
      url: "https://www.nytimes.com/2024/03/08/climate/antarctica-ice.html",
      accessDate: "June 1, 2024",
    },
  },
  video: {
    type: "video",
    slug: "youtube-video",
    label: "YouTube Video",
    article: "a",
    fields: ["Uploader or author", "Channel name", "Video title", "Platform", "Upload date", "URL"],
    sample: {
      sourceType: "video",
      title: "How CRISPR gene editing works",
      authors: [{ firstName: "Derek", lastName: "Muller" }],
      channelName: "Veritasium",
      platform: "YouTube",
      year: "2023",
      month: "6",
      day: "15",
      url: "https://www.youtube.com/watch?v=4YKFw2KZA5o",
      duration: "12:34",
      accessDate: "June 1, 2024",
    },
  },
  pdf: {
    type: "pdf",
    slug: "pdf",
    label: "PDF or Report",
    article: "a",
    fields: ["Author or organization", "Title", "Publisher", "Year", "URL or DOI"],
    sample: {
      sourceType: "pdf",
      title: "World Health Statistics 2024: Monitoring Health for the SDGs",
      authors: [{ firstName: "", lastName: "", isOrganization: true, organizationName: "World Health Organization" }],
      publisher: "World Health Organization",
      publisherLocation: "Geneva",
      year: "2024",
      url: "https://www.who.int/publications/world-health-statistics-2024.pdf",
    },
  },
  dissertation: {
    type: "dissertation",
    slug: "dissertation",
    label: "Dissertation or Thesis",
    article: "a",
    fields: ["Author", "Title", "Degree type", "University / institution", "Year", "Database or URL"],
    sample: {
      sourceType: "dissertation",
      title: "Essays on the Economics of Higher Education",
      authors: [{ firstName: "Sarah", middleName: "L", lastName: "Johnson" }],
      degreeType: "Doctoral dissertation",
      institution: "Stanford University",
      database: "ProQuest Dissertations & Theses",
      year: "2023",
      url: "https://www.proquest.com/dissertations/example",
    },
  },
};
