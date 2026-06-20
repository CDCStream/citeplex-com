const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "CitePlex",
      url: BASE,
      logo: `${BASE}/icon.svg`,
      email: "support@citeplex.com",
      description:
        "AI-powered citation generator and academic writing tools — APA, MLA, Chicago, Bluebook, and 7 more styles. Free, ad-free.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "CitePlex",
      description:
        "Generate accurate citations, check grammar, paraphrase, and write essays — 11 citation styles, zero ads.",
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE}/generate?style={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/#app`,
      name: "CitePlex Citation Generator",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/generate`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free unlimited citation generation",
      },
      featureList: [
        "APA 7 citation generator",
        "MLA 9 citation generator",
        "Chicago citation generator",
        "Bluebook legal citations",
        "Grammar checker",
        "Plagiarism checker",
        "AI paraphrasing",
        "Annotated bibliography",
        "Word BibTeX RIS export",
      ],
    },
  ],
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
