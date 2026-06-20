import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "Product",
    links: [
      { name: "All Tools", href: "/tools" },
      { name: "Generator", href: "/generate" },
      { name: "Thesis Generator", href: "/thesis-statement-generator" },
      { name: "Essay Outline", href: "/essay-outline-generator" },
      { name: "Hook Generator", href: "/hook-generator" },
      { name: "Conclusion Generator", href: "/conclusion-generator" },
      { name: "Plagiarism Checker", href: "/plagiarism-checker" },
      { name: "Grammar Checker", href: "/grammar-checker" },
      { name: "Punctuation Checker", href: "/punctuation-checker" },
      { name: "Paraphrasing Tool", href: "/paraphrasing-tool" },
      { name: "Summarizer", href: "/summarizer" },
      { name: "Annotated Bibliography", href: "/annotated-bibliography" },
      { name: "Word Counter", href: "/word-counter" },
      { name: "Character Counter", href: "/character-counter" },
      { name: "Case Converter", href: "/case-converter" },
      { name: "Pricing", href: "/pricing" },
      { name: "Style Guides", href: "/styles" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Styles",
    links: [
      { name: "APA 7th", href: "/styles/apa" },
      { name: "MLA 9th", href: "/styles/mla" },
      { name: "Chicago", href: "/styles/chicago" },
      { name: "Bluebook", href: "/styles/bluebook" },
      { name: "AMA", href: "/styles/ama" },
      { name: "IEEE", href: "/styles/ieee" },
      { name: "ACS", href: "/styles/acs" },
      { name: "All styles", href: "/styles" },
    ],
  },
  {
    title: "Sources",
    links: [
      { name: "Website", href: "/generate?type=website" },
      { name: "Book", href: "/generate?type=book" },
      { name: "Journal", href: "/generate?type=journal" },
      { name: "Case Law", href: "/generate?type=case_law" },
      { name: "Statute", href: "/generate?type=statute" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Logo markClassName="h-5 w-5" />

          <p className="text-[11px] text-zinc-400">
            &copy; {new Date().getFullYear()} CitePlex. Always verify citations before submission.
          </p>
        </div>
      </div>
    </footer>
  );
}
