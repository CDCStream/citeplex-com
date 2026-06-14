import { generateCitation, generateAllStyles } from "./citation-engine";
import { type SourceData, type CitationStyle } from "./citation-styles";

const TEST_BOOK: SourceData = {
  sourceType: "book",
  title: "Sapiens: A Brief History of Humankind",
  authors: [{ firstName: "Yuval Noah", lastName: "Harari" }],
  year: "2015",
  publisher: "Harper",
  publisherLocation: "New York",
  edition: "1st",
  isbn: "978-0062316097",
};

const TEST_JOURNAL: SourceData = {
  sourceType: "journal",
  title: "Attention Is All You Need",
  authors: [
    { firstName: "Ashish", lastName: "Vaswani" },
    { firstName: "Noam", lastName: "Shazeer" },
    { firstName: "Niki", lastName: "Parmar" },
  ],
  year: "2017",
  journalName: "Advances in Neural Information Processing Systems",
  volume: "30",
  pages: "5998-6008",
  doi: "10.48550/arXiv.1706.03762",
};

const TEST_WEBSITE: SourceData = {
  sourceType: "website",
  title: "Climate Change 2024: Impacts and Adaptation",
  authors: [{ firstName: "Jane", lastName: "Smith" }],
  year: "2024",
  month: "3",
  day: "15",
  siteName: "Nature News",
  url: "https://www.nature.com/articles/climate-2024",
  accessDate: "June 7, 2026",
};

const TEST_CASE: SourceData = {
  sourceType: "case_law",
  caseName: "Brown v. Board of Education",
  reporterVolume: "347",
  reporter: "U.S.",
  firstPage: "483",
  pinpointPage: "495",
  court: "",
  decisionDate: "1954",
};

const TEST_STATUTE: SourceData = {
  sourceType: "statute",
  statuteName: "Clean Air Act",
  codeTitle: "42",
  codeAbbreviation: "U.S.C.",
  codeSection: "7401",
  statuteYear: "2018",
};

const TEST_TWO_AUTHORS: SourceData = {
  sourceType: "book",
  title: "The Elements of Style",
  authors: [
    { firstName: "William", lastName: "Strunk" },
    { firstName: "E.B.", lastName: "White" },
  ],
  year: "1999",
  publisher: "Longman",
  edition: "4th",
};

const TEST_NO_AUTHOR: SourceData = {
  sourceType: "website",
  title: "About Climate Change",
  year: "2024",
  siteName: "EPA",
  url: "https://www.epa.gov/climate",
};

const TEST_ORG_AUTHOR: SourceData = {
  sourceType: "website",
  title: "World Health Statistics 2024",
  authors: [{ firstName: "", lastName: "", isOrganization: true, organizationName: "World Health Organization" }],
  year: "2024",
  siteName: "WHO",
  url: "https://www.who.int/stats",
};

const STYLES: CitationStyle[] = ["apa7", "mla9", "chicago", "turabian", "bluebook", "harvard"];

interface TestResult {
  test: string;
  status: "PASS" | "FAIL";
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, test: string, details: string) {
  if (condition) {
    results.push({ test, status: "PASS", details });
  } else {
    results.push({ test, status: "FAIL", details });
  }
}

// ── Test 1: All styles generate output for book ──
for (const style of STYLES) {
  const result = generateCitation(TEST_BOOK, style);
  assert(
    result.formatted.length > 10,
    `[${style}] Book citation`,
    `Output: ${result.formatted.substring(0, 80)}...`
  );
  assert(
    result.inText.length > 3,
    `[${style}] Book in-text/footnote`,
    `Output: ${result.inText.substring(0, 60)}`
  );
}

// ── Test 2: All styles generate output for journal ──
for (const style of STYLES) {
  const result = generateCitation(TEST_JOURNAL, style);
  assert(
    result.formatted.length > 10,
    `[${style}] Journal citation`,
    `Output: ${result.formatted.substring(0, 80)}...`
  );
}

// ── Test 3: All styles generate output for website ──
for (const style of STYLES) {
  const result = generateCitation(TEST_WEBSITE, style);
  assert(
    result.formatted.length > 10,
    `[${style}] Website citation`,
    `Output: ${result.formatted.substring(0, 80)}...`
  );
}

// ── Test 4: Bluebook case law ──
{
  const result = generateCitation(TEST_CASE, "bluebook");
  assert(
    result.formatted.includes("347 U.S. 483"),
    "Bluebook case volume/reporter/page",
    `Output: ${result.formatted}`
  );
  assert(
    result.formatted.includes("Brown v. Board of Education") || result.formatted.includes("*Brown"),
    "Bluebook case name present",
    `Output: ${result.formatted}`
  );
  assert(
    result.formatted.includes("1954"),
    "Bluebook case year",
    `Output: ${result.formatted}`
  );
  assert(
    result.formatted.includes("495"),
    "Bluebook pinpoint page",
    `Output: ${result.formatted}`
  );
}

// ── Test 5: Bluebook statute ──
{
  const result = generateCitation(TEST_STATUTE, "bluebook");
  assert(
    result.formatted.includes("42 U.S.C. §"),
    "Bluebook statute code + section symbol",
    `Output: ${result.formatted}`
  );
  assert(
    result.formatted.includes("7401"),
    "Bluebook statute section number",
    `Output: ${result.formatted}`
  );
}

// ── Test 6: APA two-author formatting ──
{
  const result = generateCitation(TEST_TWO_AUTHORS, "apa7");
  assert(
    result.formatted.includes("Strunk") && result.formatted.includes("White"),
    "APA two-author names present",
    `Output: ${result.formatted}`
  );
  assert(
    result.formatted.includes("&"),
    "APA two-author ampersand",
    `Output: ${result.formatted}`
  );
  assert(
    result.inText.includes("Strunk") && result.inText.includes("White"),
    "APA two-author in-text",
    `In-text: ${result.inText}`
  );
}

// ── Test 7: MLA three+ authors (et al.) ──
{
  const result = generateCitation(TEST_JOURNAL, "mla9");
  assert(
    result.formatted.includes("et al."),
    "MLA 3+ authors uses et al.",
    `Output: ${result.formatted}`
  );
}

// ── Test 8: No author handling ──
{
  const apaResult = generateCitation(TEST_NO_AUTHOR, "apa7");
  assert(
    apaResult.formatted.length > 10,
    "APA no-author generates output",
    `Output: ${apaResult.formatted}`
  );
  assert(
    apaResult.inText.includes("About Climate"),
    "APA no-author in-text uses title",
    `In-text: ${apaResult.inText}`
  );
}

// ── Test 9: Organization author ──
{
  const result = generateCitation(TEST_ORG_AUTHOR, "apa7");
  assert(
    result.formatted.includes("World Health Organization"),
    "APA org author name in citation",
    `Output: ${result.formatted}`
  );
}

// ── Test 10: Generate all styles at once ──
{
  const allResults = generateAllStyles(TEST_BOOK);
  assert(
    allResults.length === 6,
    "generateAllStyles returns 6 results",
    `Count: ${allResults.length}`
  );
  const stylesReturned = allResults.map(r => r.style);
  for (const s of STYLES) {
    assert(
      stylesReturned.includes(s),
      `generateAllStyles includes ${s}`,
      `Styles: ${stylesReturned.join(", ")}`
    );
  }
}

// ── Test 11: Chicago footnote format ──
{
  const result = generateCitation(TEST_BOOK, "chicago");
  assert(
    result.inText.includes("Yuval Noah Harari"),
    "Chicago footnote has full first name",
    `Footnote: ${result.inText}`
  );
}

// ── Test 12: Harvard year in parentheses ──
{
  const result = generateCitation(TEST_BOOK, "harvard");
  assert(
    result.formatted.includes("(2015)"),
    "Harvard year in parentheses",
    `Output: ${result.formatted}`
  );
}

// ── Test 13: APA DOI format ──
{
  const result = generateCitation(TEST_JOURNAL, "apa7");
  assert(
    result.formatted.includes("https://doi.org/"),
    "APA includes DOI as URL",
    `Output: ${result.formatted}`
  );
}

// ── Test 14: Style and sourceType returned correctly ──
{
  const result = generateCitation(TEST_BOOK, "apa7");
  assert(result.style === "apa7", "Result style matches input", `Style: ${result.style}`);
  assert(result.sourceType === "book", "Result sourceType matches input", `Type: ${result.sourceType}`);
}

// ── Test 15: Edge case - empty source data ──
{
  const emptyData: SourceData = { sourceType: "website" };
  const result = generateCitation(emptyData, "apa7");
  assert(
    result.formatted.length > 0,
    "Empty source data still produces output (no crash)",
    `Output: ${result.formatted}`
  );
}

// ── Print results ──
console.log("\n" + "=".repeat(70));
console.log("  CITEPLEX CITATION ENGINE — TEST RESULTS");
console.log("=".repeat(70) + "\n");

const passed = results.filter(r => r.status === "PASS").length;
const failed = results.filter(r => r.status === "FAIL").length;

for (const r of results) {
  const icon = r.status === "PASS" ? "[PASS]" : "[FAIL]";
  console.log(`  ${icon} ${r.test}`);
  if (r.status === "FAIL") {
    console.log(`         ${r.details}`);
  }
}

console.log("\n" + "-".repeat(70));
console.log(`  TOTAL: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("-".repeat(70) + "\n");

if (failed > 0) {
  console.log("  FAILED TESTS:\n");
  for (const r of results.filter(r => r.status === "FAIL")) {
    console.log(`  [FAIL] ${r.test}`);
    console.log(`         ${r.details}\n`);
  }
}

process.exit(failed > 0 ? 1 : 0);
