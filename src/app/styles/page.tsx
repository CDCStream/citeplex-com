import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CITATION_STYLES, type CitationStyle } from "@/lib/citation-styles";
import { STYLE_SEO } from "@/lib/style-seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const styleExamples: Record<CitationStyle, { biblio: string; inText: string; bestFor: string[] }> = {
  apa7: {
    biblio: "Smith, J. D. (2024). *The art of research*. Academic Press. https://doi.org/10.1234/example",
    inText: "(Smith, 2024, p. 45)",
    bestFor: ["Psychology", "Education", "Social Sciences", "Nursing", "Business"],
  },
  mla9: {
    biblio: 'Smith, John David. *The Art of Research*. Academic Press, 2024.',
    inText: "(Smith 45)",
    bestFor: ["English", "Literature", "Humanities", "Cultural Studies", "Philosophy"],
  },
  chicago: {
    biblio: "Smith, John David. *The Art of Research*. New York: Academic Press, 2024.",
    inText: "John David Smith, *The Art of Research* (New York: Academic Press, 2024), 45.",
    bestFor: ["History", "Fine Arts", "Publishing", "Social Sciences"],
  },
  turabian: {
    biblio: "Smith, John David. *The Art of Research*. New York: Academic Press, 2024.",
    inText: "John David Smith, *The Art of Research* (New York: Academic Press, 2024), 45.",
    bestFor: ["Student Papers", "Theses", "Dissertations", "Research Projects"],
  },
  bluebook: {
    biblio: "JOHN DAVID SMITH, THE ART OF LEGAL RESEARCH 45 (3d ed. 2024).",
    inText: "Smith, *supra* note 12, at 45.",
    bestFor: ["Law Reviews", "Court Briefs", "Legal Memoranda", "Statutory Analysis"],
  },
  harvard: {
    biblio: "Smith, J.D. (2024). *The Art of Research*. New York: Academic Press.",
    inText: "(Smith, 2024)",
    bestFor: ["UK Universities", "Australian Universities", "International Studies"],
  },
  ama: {
    biblio: "Smith JD, Doe RB. Advances in clinical research methods. *JAMA*. 2024;331(4):1234-1240. doi:10.1001/jama.2024.0123",
    inText: "¹ (superscript)",
    bestFor: ["Medicine", "Nursing", "Public Health", "Pharmacy", "Dentistry"],
  },
  ieee: {
    biblio: '[1] J. D. Smith and R. B. Doe, "A framework for neural architecture search," *IEEE Trans. Neural Netw.*, vol. 35, no. 4, pp. 1234-1240, 2024, doi: 10.1109/example.',
    inText: "[1]",
    bestFor: ["Electrical Engineering", "Computer Science", "Robotics", "Telecommunications"],
  },
  acs: {
    biblio: "Smith, J. D.; Doe, R. B. Catalytic Properties of Novel Compounds. *J. Am. Chem. Soc.* 2024, *146*, 1234-1240. DOI: 10.1021/example.",
    inText: "¹ (superscript)",
    bestFor: ["Chemistry", "Biochemistry", "Materials Science", "Chemical Engineering"],
  },
  cse: {
    biblio: "Smith JD, Doe RB. 2024. Cellular responses to environmental stress. J Cell Biol. 223(4):1234-1240.",
    inText: "¹ (superscript)",
    bestFor: ["Biology", "Ecology", "Genetics", "Zoology", "Botany"],
  },
  asa: {
    biblio: 'Smith, John David, and Robert B. Doe. 2024. "Social Networks and Mobility." *American Journal of Sociology* 100(4):1234-1260.',
    inText: "(Smith and Doe 2024:1245)",
    bestFor: ["Sociology", "Criminology", "Social Work", "Anthropology"],
  },
};

function formatHTML(text: string): string {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

export default function StylesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />

      <main className="flex-1">
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Citation Style Guides
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare formatting rules across all 11 supported styles. See examples and find the right style for your discipline.
              </p>
            </div>

            <div className="space-y-8">
              {(Object.entries(CITATION_STYLES) as [CitationStyle, typeof CITATION_STYLES[CitationStyle]][]).map(
                ([key, style]) => {
                  const example = styleExamples[key];
                  return (
                    <div
                      key={key}
                      className="rounded-2xl border border-border bg-background overflow-hidden transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: style.color }}
                        />
                        <h2 className="text-lg font-bold">{style.label}</h2>
                      </div>

                      <div className="p-6 space-y-5">
                        <p className="text-sm text-muted-foreground">{style.description}</p>

                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            {key === "bluebook" ? "Full Citation" : "Bibliography Entry"}
                          </h3>
                          <div
                            className="citation-text text-sm leading-relaxed bg-muted/30 rounded-lg p-4 pl-8 -indent-4"
                            dangerouslySetInnerHTML={{ __html: formatHTML(example.biblio) }}
                          />
                        </div>

                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            {key === "bluebook" ? "Short Form" : key === "chicago" || key === "turabian" ? "Footnote" : "In-Text Citation"}
                          </h3>
                          <div
                            className="citation-text text-sm leading-relaxed bg-muted/30 rounded-lg p-4"
                            dangerouslySetInnerHTML={{ __html: formatHTML(example.inText) }}
                          />
                        </div>

                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Best For
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {example.bestFor.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                                style={{ backgroundColor: `${style.color}15`, color: style.color }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href={`/styles/${STYLE_SEO[key].slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                          View {style.label.split(" ")[0]} guide &amp; generator
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
