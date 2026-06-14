import { type CitationStyle, type SourceData, type CitationResult, type Author } from "./citation-styles";

function formatAuthorAPA(author: Author): string {
  if (author.isOrganization && author.organizationName) {
    return author.organizationName;
  }
  const last = author.lastName;
  const firstInitial = author.firstName ? `${author.firstName.charAt(0)}.` : "";
  const middleInitial = author.middleName ? ` ${author.middleName.charAt(0)}.` : "";
  return `${last}, ${firstInitial}${middleInitial}`;
}

function formatAuthorMLA(author: Author, isFirst: boolean): string {
  if (author.isOrganization && author.organizationName) {
    return author.organizationName;
  }
  if (isFirst) {
    return `${author.lastName}, ${author.firstName}${author.middleName ? ` ${author.middleName}` : ""}`;
  }
  return `${author.firstName}${author.middleName ? ` ${author.middleName}` : ""} ${author.lastName}`;
}

function formatAuthorChicago(author: Author, isFirst: boolean): string {
  if (author.isOrganization && author.organizationName) {
    return author.organizationName;
  }
  if (isFirst) {
    return `${author.lastName}, ${author.firstName}${author.middleName ? ` ${author.middleName}` : ""}`;
  }
  return `${author.firstName}${author.middleName ? ` ${author.middleName}` : ""} ${author.lastName}`;
}

function formatAuthorsAPA(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  if (authors.length === 1) return formatAuthorAPA(authors[0]);
  if (authors.length === 2) {
    return `${formatAuthorAPA(authors[0])} & ${formatAuthorAPA(authors[1])}`;
  }
  if (authors.length <= 20) {
    const allButLast = authors.slice(0, -1).map(formatAuthorAPA).join(", ");
    return `${allButLast}, & ${formatAuthorAPA(authors[authors.length - 1])}`;
  }
  const first19 = authors.slice(0, 19).map(formatAuthorAPA).join(", ");
  return `${first19}, . . . ${formatAuthorAPA(authors[authors.length - 1])}`;
}

function formatAuthorsMLA(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  if (authors.length === 1) return formatAuthorMLA(authors[0], true);
  if (authors.length === 2) {
    return `${formatAuthorMLA(authors[0], true)}, and ${formatAuthorMLA(authors[1], false)}`;
  }
  return `${formatAuthorMLA(authors[0], true)}, et al.`;
}

function formatAuthorsChicago(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  if (authors.length === 1) return formatAuthorChicago(authors[0], true);
  if (authors.length === 2) {
    return `${formatAuthorChicago(authors[0], true)} and ${formatAuthorChicago(authors[1], false)}`;
  }
  if (authors.length <= 3) {
    const allButLast = authors.slice(0, -1).map((a, i) => formatAuthorChicago(a, i === 0)).join(", ");
    return `${allButLast}, and ${formatAuthorChicago(authors[authors.length - 1], false)}`;
  }
  return `${formatAuthorChicago(authors[0], true)} et al.`;
}

function formatDate(year?: string, month?: string, day?: string): string {
  if (!year) return "n.d.";
  if (!month) return year;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = months[parseInt(month) - 1] || month;
  if (!day) return `${monthName} ${year}`;
  return `${monthName} ${day}, ${year}`;
}

function formatDateMLA(year?: string, month?: string, day?: string): string {
  if (!year) return "";
  if (!month) return year;
  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  const monthAbbr = months[parseInt(month) - 1] || month;
  if (!day) return `${monthAbbr} ${year}`;
  return `${day} ${monthAbbr} ${year}`;
}

// ─── APA 7th Edition ───

function generateAPAWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsAPA(data.authors || []);
  const date = data.year ? `(${formatDate(data.year, data.month, data.day)})` : "(n.d.)";
  const title = data.title ? `*${data.title}*` : "";
  const siteName = data.siteName || "";
  const url = data.url ? data.url : "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}`);
  parts.push(date);
  if (title) parts.push(`${title}.`);
  if (siteName && siteName !== (data.authors?.[0]?.organizationName || "")) parts.push(`${siteName}.`);
  if (url) parts.push(url);

  const inText = data.authors?.length
    ? data.authors.length >= 3
      ? `(${data.authors[0].lastName} et al., ${data.year || "n.d."})`
      : data.authors.length === 2
        ? `(${data.authors[0].lastName} & ${data.authors[1].lastName}, ${data.year || "n.d."})`
        : `(${data.authors[0].isOrganization ? data.authors[0].organizationName : data.authors[0].lastName}, ${data.year || "n.d."})`
    : `("${(data.title || "").substring(0, 30)}," ${data.year || "n.d."})`;

  return { formatted: parts.join(" "), inText, style: "apa7", sourceType: data.sourceType };
}

function generateAPABook(data: SourceData): CitationResult {
  const authors = formatAuthorsAPA(data.authors || []);
  const date = data.year ? `(${data.year})` : "(n.d.)";
  const title = data.title ? `*${data.title}*` : "";
  const edition = data.edition ? ` (${data.edition} ed.)` : "";
  const publisher = data.publisher || "";
  const doi = data.doi ? `https://doi.org/${data.doi}` : "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}`);
  parts.push(`${date}.`);
  if (title) parts.push(`${title}${edition}.`);
  if (publisher) parts.push(`${publisher}.`);
  if (doi) parts.push(doi);

  const inText = data.authors?.length
    ? `(${data.authors[0].lastName}${data.authors.length === 2 ? ` & ${data.authors[1].lastName}` : data.authors.length > 2 ? " et al." : ""}, ${data.year || "n.d."})`
    : `("${(data.title || "").substring(0, 30)}," ${data.year || "n.d."})`;

  return { formatted: parts.join(" "), inText, style: "apa7", sourceType: data.sourceType };
}

function generateAPAJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsAPA(data.authors || []);
  const date = data.year ? `(${data.year})` : "(n.d.)";
  const title = data.title || "";
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const volIssue = data.volume
    ? data.issue ? `*${data.volume}*(${data.issue})` : `*${data.volume}*`
    : "";
  const pages = data.pages || "";
  const doi = data.doi ? `https://doi.org/${data.doi}` : "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}`);
  parts.push(`${date}.`);
  if (title) parts.push(`${title}.`);
  if (journal) {
    let journalPart = journal;
    if (volIssue) journalPart += `, ${volIssue}`;
    if (pages) journalPart += `, ${pages}`;
    parts.push(`${journalPart}.`);
  }
  if (doi) parts.push(doi);

  const inText = data.authors?.length
    ? `(${data.authors[0].lastName}${data.authors.length === 2 ? ` & ${data.authors[1].lastName}` : data.authors.length > 2 ? " et al." : ""}, ${data.year || "n.d."})`
    : `("${(data.title || "").substring(0, 30)}," ${data.year || "n.d."})`;

  return { formatted: parts.join(" "), inText, style: "apa7", sourceType: data.sourceType };
}

// ─── MLA 9th Edition ───

function generateMLAWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsMLA(data.authors || []);
  const title = data.title ? `"${data.title}."` : "";
  const siteName = data.siteName ? `*${data.siteName}*,` : "";
  const date = formatDateMLA(data.year, data.month, data.day);
  const url = data.url || "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (siteName) parts.push(siteName);
  if (date) parts.push(`${date},`);
  if (url) parts.push(`${url}.`);

  const inText = data.authors?.length
    ? data.authors.length >= 3
      ? `(${data.authors[0].lastName} et al.)`
      : data.authors.length === 2
        ? `(${data.authors[0].lastName} and ${data.authors[1].lastName})`
        : `(${data.authors[0].isOrganization ? data.authors[0].organizationName : data.authors[0].lastName})`
    : `("${(data.title || "").substring(0, 30)}")`;

  return { formatted: parts.join(" "), inText, style: "mla9", sourceType: data.sourceType };
}

function generateMLABook(data: SourceData): CitationResult {
  const authors = formatAuthorsMLA(data.authors || []);
  const title = data.title ? `*${data.title}*.` : "";
  const edition = data.edition ? `${data.edition} ed.,` : "";
  const publisher = data.publisher ? `${data.publisher},` : "";
  const year = data.year || "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (edition) parts.push(edition);
  if (publisher) parts.push(publisher);
  if (year) parts.push(`${year}.`);

  const inText = data.authors?.length
    ? `(${data.authors[0].lastName}${data.pages ? ` ${data.pages}` : ""})`
    : `("${(data.title || "").substring(0, 30)}")`;

  return { formatted: parts.join(" "), inText, style: "mla9", sourceType: data.sourceType };
}

function generateMLAJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsMLA(data.authors || []);
  const title = data.title ? `"${data.title}."` : "";
  const journal = data.journalName ? `*${data.journalName}*,` : "";
  const vol = data.volume ? `vol. ${data.volume},` : "";
  const issue = data.issue ? `no. ${data.issue},` : "";
  const year = data.year || "";
  const pages = data.pages ? `pp. ${data.pages}.` : "";
  const doi = data.doi ? `https://doi.org/${data.doi}.` : "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (journal) parts.push(journal);
  if (vol) parts.push(vol);
  if (issue) parts.push(issue);
  if (year) parts.push(`${year},`);
  if (pages) parts.push(pages);
  if (doi) parts.push(doi);

  const inText = data.authors?.length
    ? `(${data.authors[0].lastName}${data.pages ? ` ${data.pages.split("-")[0]}` : ""})`
    : `("${(data.title || "").substring(0, 30)}")`;

  return { formatted: parts.join(" "), inText, style: "mla9", sourceType: data.sourceType };
}

// ─── Chicago / Turabian ───

function generateChicagoWebsite(data: SourceData, style: "chicago" | "turabian"): CitationResult {
  const authors = formatAuthorsChicago(data.authors || []);
  const title = data.title ? `"${data.title}."` : "";
  const siteName = data.siteName ? `${data.siteName}.` : "";
  const date = formatDate(data.year, data.month, data.day);
  const url = data.url || "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (siteName) parts.push(siteName);
  if (date !== "n.d.") parts.push(`${date}.`);
  if (url) parts.push(url);

  const footnote = `${authors ? `${data.authors?.[0]?.firstName || ""} ${data.authors?.[0]?.lastName || ""}` : ""}, "${data.title || ""}," ${data.siteName || ""}, ${date !== "n.d." ? date : ""}${url ? `, ${url}` : ""}.`;

  return { formatted: parts.join(" "), inText: footnote, style, sourceType: data.sourceType };
}

function generateChicagoBook(data: SourceData, style: "chicago" | "turabian"): CitationResult {
  const authors = formatAuthorsChicago(data.authors || []);
  const title = data.title ? `*${data.title}*.` : "";
  const edition = data.edition ? `${data.edition} ed.` : "";
  const location = data.publisherLocation || "";
  const publisher = data.publisher || "";
  const year = data.year || "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (edition) parts.push(edition);
  const pubInfo = [location, publisher].filter(Boolean).join(": ");
  if (pubInfo || year) parts.push(`${pubInfo}${pubInfo ? ", " : ""}${year}.`);

  const footnoteAuthor = data.authors?.[0] ? `${data.authors[0].firstName || ""} ${data.authors[0].lastName || ""}` : "";
  const footnote = `${footnoteAuthor}, *${data.title || ""}* (${pubInfo}${pubInfo ? ", " : ""}${year}), ${data.pages || ""}.`;

  return { formatted: parts.join(" "), inText: footnote, style, sourceType: data.sourceType };
}

function generateChicagoJournal(data: SourceData, style: "chicago" | "turabian"): CitationResult {
  const authors = formatAuthorsChicago(data.authors || []);
  const title = data.title ? `"${data.title}."` : "";
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const vol = data.volume || "";
  const issue = data.issue ? `, no. ${data.issue}` : "";
  const year = data.year ? `(${data.year})` : "";
  const pages = data.pages ? `: ${data.pages}` : "";
  const doi = data.doi ? `https://doi.org/${data.doi}.` : "";

  let parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (title) parts.push(title);
  if (journal) parts.push(`${journal} ${vol}${issue} ${year}${pages}.`);
  if (doi) parts.push(doi);

  const footnoteAuthor = data.authors?.[0] ? `${data.authors[0].firstName || ""} ${data.authors[0].lastName || ""}` : "";
  const footnote = `${footnoteAuthor}, "${data.title || ""}," *${data.journalName || ""}* ${vol}${issue} ${year}${pages}.`;

  return { formatted: parts.join(" "), inText: footnote, style, sourceType: data.sourceType };
}

// ─── Bluebook ───

function generateBluebookCase(data: SourceData): CitationResult {
  const caseName = data.caseName ? `*${data.caseName}*` : "";
  const vol = data.reporterVolume || "";
  const reporter = data.reporter || "";
  const page = data.firstPage || "";
  const pinpoint = data.pinpointPage ? `, ${data.pinpointPage}` : "";
  const court = data.court || "";
  const date = data.decisionDate || "";
  const courtDate = [court, date].filter(Boolean).join(" ");

  const formatted = `${caseName}, ${vol} ${reporter} ${page}${pinpoint} (${courtDate}).`;
  const shortForm = `${caseName}, ${vol} ${reporter} at ${data.pinpointPage || page}.`;

  return { formatted, inText: shortForm, style: "bluebook", sourceType: data.sourceType };
}

function generateBluebookStatute(data: SourceData): CitationResult {
  const name = data.statuteName || "";
  const title = data.codeTitle || "";
  const code = data.codeAbbreviation || "";
  const section = data.codeSection || "";
  const year = data.statuteYear || "";

  const formatted = `${name}${name ? ", " : ""}${title} ${code} § ${section} (${year}).`;
  const shortForm = `${title} ${code} § ${section}.`;

  return { formatted, inText: shortForm, style: "bluebook", sourceType: data.sourceType };
}

function generateBluebookBook(data: SourceData): CitationResult {
  const authors = data.authors?.map(a => `${a.firstName || ""} ${a.lastName || ""}`.trim()).join(", ") || "";
  const title = data.title || "";
  const page = data.pages || "";
  const edition = data.edition || "";
  const year = data.year || "";
  const edYear = [edition ? `${edition} ed.` : "", year].filter(Boolean).join(" ");

  const formatted = `${authors}, ${title.toUpperCase()} ${page ? `${page} ` : ""}(${edYear}).`;
  const shortForm = `${data.authors?.[0]?.lastName || ""}, *supra* note __, at ${page}.`;

  return { formatted, inText: shortForm, style: "bluebook", sourceType: data.sourceType };
}

function generateBluebookJournal(data: SourceData): CitationResult {
  const authors = data.authors?.map(a => `${a.firstName || ""} ${a.lastName || ""}`.trim()).join(", ") || "";
  const title = data.title || "";
  const journal = data.journalName || "";
  const vol = data.volume || "";
  const page = data.pages?.split("-")[0] || "";
  const pinpoint = data.pinpointPage || "";
  const year = data.year || "";

  const formatted = `${authors}, *${title}*, ${vol} ${journal} ${page}${pinpoint ? `, ${pinpoint}` : ""} (${year}).`;
  const shortForm = `${data.authors?.[0]?.lastName || ""}, *supra* note __, at ${pinpoint || page}.`;

  return { formatted, inText: shortForm, style: "bluebook", sourceType: data.sourceType };
}

// ─── Harvard ───

function generateHarvardWebsite(data: SourceData): CitationResult {
  const authors = data.authors?.map(a =>
    a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName?.charAt(0)}.`
  ).join(", ") || "";
  const year = data.year || "n.d.";
  const title = data.title ? `*${data.title}*` : "";
  const available = data.url ? `Available at: ${data.url}` : "";
  const accessed = data.accessDate ? `[Accessed ${data.accessDate}]` : "";

  const formatted = `${authors} (${year}). ${title}. [online] ${available} ${accessed}.`.replace(/\s+/g, " ").trim();
  const inText = `(${data.authors?.[0]?.lastName || data.title?.substring(0, 20) || ""}, ${year})`;

  return { formatted, inText, style: "harvard", sourceType: data.sourceType };
}

function generateHarvardBook(data: SourceData): CitationResult {
  const authors = data.authors?.map(a =>
    a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName?.charAt(0)}.`
  ).join(", ") || "";
  const year = data.year || "n.d.";
  const title = data.title ? `*${data.title}*` : "";
  const edition = data.edition ? `${data.edition} ed.` : "";
  const location = data.publisherLocation || "";
  const publisher = data.publisher || "";

  const formatted = `${authors} (${year}). ${title}. ${edition}${edition ? " " : ""}${location}${location ? ": " : ""}${publisher}.`;
  const inText = `(${data.authors?.[0]?.lastName || ""}, ${year})`;

  return { formatted, inText, style: "harvard", sourceType: data.sourceType };
}

function generateHarvardJournal(data: SourceData): CitationResult {
  const authors = data.authors?.map(a =>
    a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName?.charAt(0)}.`
  ).join(", ") || "";
  const year = data.year || "n.d.";
  const title = data.title || "";
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const vol = data.volume || "";
  const issue = data.issue ? `(${data.issue})` : "";
  const pages = data.pages || "";

  const formatted = `${authors} (${year}). ${title}. ${journal}, ${vol}${issue}, pp.${pages}.`;
  const inText = `(${data.authors?.[0]?.lastName || ""}, ${year})`;

  return { formatted, inText, style: "harvard", sourceType: data.sourceType };
}

// ─── Video / online media ───

function videoDateAPA(year?: string, month?: string, day?: string): string {
  if (!year) return "n.d.";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (!month) return year;
  const monthName = months[parseInt(month) - 1] || month;
  return day ? `${year}, ${monthName} ${day}` : `${year}, ${monthName}`;
}

function videoUploader(data: SourceData): string {
  if (data.authors?.length) return formatAuthorsAPA(data.authors);
  return data.channelName || "";
}

function generateAPAVideo(data: SourceData): CitationResult {
  const uploader = videoUploader(data);
  const date = videoDateAPA(data.year, data.month, data.day);
  const platform = data.platform || "";
  const parts: string[] = [];
  if (uploader) parts.push(uploader.endsWith(".") ? uploader : `${uploader}.`);
  parts.push(`(${date}).`);
  if (data.title) parts.push(`*${data.title}* [Video].`);
  if (platform) parts.push(`${platform}.`);
  if (data.url) parts.push(data.url);
  const name = data.authors?.[0]?.lastName || data.channelName || (data.title || "").substring(0, 20);
  return { formatted: parts.join(" "), inText: `(${name}, ${data.year || "n.d."})`, style: "apa7", sourceType: data.sourceType };
}

function generateMLAVideo(data: SourceData): CitationResult {
  const title = data.title ? `"${data.title}."` : "";
  const platform = data.platform ? `*${data.platform}*,` : "";
  const channel = data.channelName ? `uploaded by ${data.channelName},` : "";
  const date = formatDateMLA(data.year, data.month, data.day);
  const parts: string[] = [];
  if (title) parts.push(title);
  if (platform) parts.push(platform);
  if (channel) parts.push(channel);
  if (date) parts.push(`${date},`);
  if (data.url) parts.push(`${data.url}.`);
  return { formatted: parts.join(" "), inText: `("${(data.title || "").substring(0, 30)}")`, style: "mla9", sourceType: data.sourceType };
}

function generateChicagoVideo(data: SourceData, style: "chicago" | "turabian"): CitationResult {
  const channel = data.channelName || (data.authors?.length ? formatAuthorsChicago(data.authors) : "");
  const title = data.title ? `"${data.title}."` : "";
  const platform = data.platform ? `${data.platform} video` : "Video";
  const duration = data.duration ? `, ${data.duration}` : "";
  const date = formatDate(data.year, data.month, data.day);
  const parts: string[] = [];
  if (channel) parts.push(`${channel}.`);
  if (title) parts.push(title);
  parts.push(`${platform}${duration}.`);
  if (date !== "n.d.") parts.push(`${date}.`);
  if (data.url) parts.push(data.url);
  const footnote = `${channel}, "${data.title || ""}," ${platform}${duration}, ${date !== "n.d." ? date : ""}${data.url ? `, ${data.url}` : ""}.`;
  return { formatted: parts.join(" "), inText: footnote, style, sourceType: data.sourceType };
}

function generateHarvardVideo(data: SourceData): CitationResult {
  const author = data.channelName || (data.authors?.length ? data.authors.map((a) => (a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName?.charAt(0)}.`)).join(", ") : "");
  const year = data.year || "n.d.";
  const title = data.title ? `*${data.title}*` : "";
  const platform = data.platform || "online video";
  const available = data.url ? `Available at: ${data.url}` : "";
  const accessed = data.accessDate ? `[Accessed ${data.accessDate}]` : "";
  const formatted = tidy(`${author} (${year}). ${title}. [${platform}] ${available} ${accessed}.`);
  return { formatted, inText: `(${data.channelName || data.authors?.[0]?.lastName || ""}, ${year})`, style: "harvard", sourceType: data.sourceType };
}

function generateGenericVideo(data: SourceData, style: CitationStyle): CitationResult {
  const author = videoUploader(data);
  const platform = data.platform || "Video";
  const formatted = tidy(`${author ? `${author}.` : ""} ${data.title ? `${data.title} [video].` : ""} ${platform}; ${data.year || ""}. ${data.url || ""}`);
  const isNumeric = style === "ama" || style === "ieee" || style === "acs" || style === "cse";
  const inText = isNumeric
    ? style === "ieee" ? "[1]" : "¹"
    : `(${data.channelName || data.authors?.[0]?.lastName || ""} ${data.year || "n.d."})`;
  return { formatted: style === "ieee" ? `[1] ${formatted}` : formatted, inText, style, sourceType: data.sourceType };
}

// ─── Dissertation / thesis ───

function generateAPADissertation(data: SourceData): CitationResult {
  const authors = formatAuthorsAPA(data.authors || []);
  const degree = data.degreeType || "Doctoral dissertation";
  const inst = data.institution || "";
  const parts: string[] = [];
  if (authors) parts.push(authors.endsWith(".") ? authors : `${authors}.`);
  parts.push(`(${data.year || "n.d."}).`);
  if (data.title) parts.push(`*${data.title}*`);
  parts.push(`[${degree}${inst ? `, ${inst}` : ""}].`);
  if (data.database) parts.push(`${data.database}.`);
  if (data.url) parts.push(data.url);
  const name = data.authors?.[0]?.lastName || (data.title || "").substring(0, 20);
  return { formatted: tidy(parts.join(" ")), inText: `(${name}, ${data.year || "n.d."})`, style: "apa7", sourceType: data.sourceType };
}

function generateMLADissertation(data: SourceData): CitationResult {
  const authors = formatAuthorsMLA(data.authors || []);
  const degree = data.degreeType || "PhD dissertation";
  const parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (data.title) parts.push(`*${data.title}*.`);
  if (data.year) parts.push(`${data.year}.`);
  if (data.institution) parts.push(`${data.institution},`);
  parts.push(`${degree}.`);
  const inText = data.authors?.length ? `(${data.authors[0].lastName})` : `("${(data.title || "").substring(0, 30)}")`;
  return { formatted: tidy(parts.join(" ")), inText, style: "mla9", sourceType: data.sourceType };
}

function generateChicagoDissertation(data: SourceData, style: "chicago" | "turabian"): CitationResult {
  const authors = formatAuthorsChicago(data.authors || []);
  const degree = data.degreeType || "PhD diss.";
  const inst = data.institution || "";
  const year = data.year || "";
  const parts: string[] = [];
  if (authors) parts.push(`${authors}.`);
  if (data.title) parts.push(`"${data.title}."`);
  parts.push(`${degree},${inst ? ` ${inst},` : ""} ${year}.`);
  if (data.url) parts.push(data.url);
  const footnoteAuthor = data.authors?.[0] ? `${data.authors[0].firstName || ""} ${data.authors[0].lastName || ""}`.trim() : "";
  const footnote = tidy(`${footnoteAuthor}, "${data.title || ""}" (${degree},${inst ? ` ${inst},` : ""} ${year})${data.pages ? `, ${data.pages}` : ""}.`);
  return { formatted: tidy(parts.join(" ")), inText: footnote, style, sourceType: data.sourceType };
}

function generateHarvardDissertation(data: SourceData): CitationResult {
  const authors = data.authors?.map((a) => (a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName?.charAt(0)}.`)).join(", ") || "";
  const year = data.year || "n.d.";
  const degree = data.degreeType || "PhD thesis";
  const inst = data.institution || "";
  const formatted = tidy(`${authors} (${year}). *${data.title || ""}*. ${degree}. ${inst}.`);
  return { formatted, inText: `(${data.authors?.[0]?.lastName || ""}, ${year})`, style: "harvard", sourceType: data.sourceType };
}

function generateGenericDissertation(data: SourceData, style: CitationStyle): CitationResult {
  const isNumeric = style === "ama" || style === "ieee" || style === "acs" || style === "cse";
  const degree = data.degreeType || "dissertation";
  const inst = data.institution || "";
  let authors: string;
  if (style === "asa") authors = formatAuthorsASA(data.authors || []);
  else authors = formatAuthorsVancouver(data.authors || [], 6);
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${style === "asa" && data.year ? `${data.year}.` : ""} ${data.title ? `${data.title}` : ""} [${degree}].${style === "asa" ? "" : ` ${inst ? `${inst};` : ""} ${data.year || ""}.`}${style === "asa" && inst ? ` ${inst}.` : ""} ${data.url || ""}`
  );
  const inText = isNumeric
    ? style === "ieee" ? "[1]" : "¹"
    : `(${data.authors?.[0]?.lastName || ""} ${data.year || "n.d."})`;
  return { formatted: style === "ieee" ? `[1] ${formatted}` : formatted, inText, style, sourceType: data.sourceType };
}

// ─── Author helpers for science / numeric styles ───

function initialsTight(a: Author): string {
  return `${a.firstName ? a.firstName.charAt(0) : ""}${a.middleName ? a.middleName.charAt(0) : ""}`;
}

function initialsSpaced(a: Author): string {
  return [a.firstName?.charAt(0), a.middleName?.charAt(0)]
    .filter(Boolean)
    .map((c) => `${c}.`)
    .join(" ");
}

// AMA / CSE: "Smith JA"
function authorVancouver(a: Author): string {
  if (a.isOrganization && a.organizationName) return a.organizationName;
  return `${a.lastName} ${initialsTight(a)}`.trim();
}

function formatAuthorsVancouver(authors: Author[], max: number): string {
  if (!authors?.length) return "";
  const arr = authors.map(authorVancouver);
  if (arr.length <= max) return arr.join(", ");
  return `${arr.slice(0, 3).join(", ")}, et al`;
}

// ACS: "Smith, J. A."
function authorACS(a: Author): string {
  if (a.isOrganization && a.organizationName) return a.organizationName;
  const init = initialsSpaced(a);
  return `${a.lastName}${init ? `, ${init}` : ""}`;
}

// IEEE: "J. A. Smith"
function authorIEEE(a: Author): string {
  if (a.isOrganization && a.organizationName) return a.organizationName;
  const init = initialsSpaced(a);
  return `${init ? `${init} ` : ""}${a.lastName}`;
}

function formatAuthorsIEEE(authors: Author[]): string {
  if (!authors?.length) return "";
  const arr = authors.map(authorIEEE);
  if (arr.length === 1) return arr[0];
  if (arr.length > 6) return `${arr[0]} et al.`;
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}

// ASA: first author inverted, rest natural
function formatAuthorsASA(authors: Author[]): string {
  if (!authors?.length) return "";
  const first = authors[0].isOrganization
    ? authors[0].organizationName || ""
    : `${authors[0].lastName}, ${authors[0].firstName || ""}${authors[0].middleName ? ` ${authors[0].middleName}` : ""}`;
  if (authors.length === 1) return first;
  const rest = authors.slice(1).map((a) =>
    a.isOrganization ? a.organizationName || "" : `${a.firstName || ""}${a.middleName ? ` ${a.middleName}` : ""} ${a.lastName}`.trim()
  );
  if (authors.length === 2) return `${first} and ${rest[0]}`;
  return `${first}, ${rest.slice(0, -1).join(", ")}, and ${rest[rest.length - 1]}`;
}

const tidy = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .trim();

// ─── AMA 11th Edition (numeric superscript) ───

function generateAMAJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 6);
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const year = data.year || "";
  const vol = data.volume || "";
  const issue = data.issue ? `(${data.issue})` : "";
  const pages = data.pages || "";
  const doi = data.doi ? ` doi:${data.doi}` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${data.title ? `${data.title}.` : ""} ${journal ? `${journal}.` : ""} ${year}${vol ? `;${vol}${issue}` : ""}${pages ? `:${pages}` : ""}.${doi}`
  );
  return { formatted, inText: "¹", style: "ama", sourceType: data.sourceType };
}

function generateAMABook(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 6);
  const title = data.title ? `*${data.title}*` : "";
  const edition = data.edition ? `${data.edition} ed.` : "";
  const publisher = data.publisher || "";
  const year = data.year || "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${title ? `${title}.` : ""} ${edition ? `${edition}` : ""} ${publisher ? `${publisher};` : ""} ${year}.`
  );
  return { formatted, inText: "¹", style: "ama", sourceType: data.sourceType };
}

function generateAMAWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 6);
  const site = data.siteName || "";
  const accessed = data.accessDate ? `Accessed ${data.accessDate}.` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${data.title ? `${data.title}.` : ""} ${site ? `${site}.` : ""} ${data.year ? `${data.year}.` : ""} ${accessed} ${data.url || ""}`
  );
  return { formatted, inText: "¹", style: "ama", sourceType: data.sourceType };
}

// ─── IEEE (numeric [n]) ───

function generateIEEEJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsIEEE(data.authors || []);
  const title = data.title ? `"${data.title},"` : "";
  const journal = data.journalName ? `*${data.journalName}*,` : "";
  const vol = data.volume ? `vol. ${data.volume},` : "";
  const issue = data.issue ? `no. ${data.issue},` : "";
  const pages = data.pages ? `pp. ${data.pages},` : "";
  const year = data.year || "";
  const doi = data.doi ? `, doi: ${data.doi}` : "";
  const formatted = tidy(
    `[1] ${authors ? `${authors},` : ""} ${title} ${journal} ${vol} ${issue} ${pages} ${year}${doi}.`
  );
  return { formatted, inText: "[1]", style: "ieee", sourceType: data.sourceType };
}

function generateIEEEBook(data: SourceData): CitationResult {
  const authors = formatAuthorsIEEE(data.authors || []);
  const title = data.title ? `*${data.title}*,` : "";
  const edition = data.edition ? `${data.edition} ed.` : "";
  const location = data.publisherLocation ? `${data.publisherLocation}:` : "";
  const publisher = data.publisher ? `${data.publisher},` : "";
  const year = data.year || "";
  const formatted = tidy(
    `[1] ${authors ? `${authors},` : ""} ${title} ${edition} ${location} ${publisher} ${year}.`
  );
  return { formatted, inText: "[1]", style: "ieee", sourceType: data.sourceType };
}

function generateIEEEWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsIEEE(data.authors || []);
  const title = data.title ? `"${data.title},"` : "";
  const site = data.siteName ? `*${data.siteName}*,` : "";
  const year = data.year ? `${data.year}.` : "";
  const url = data.url ? `[Online]. Available: ${data.url}` : "";
  const formatted = tidy(`[1] ${authors ? `${authors},` : ""} ${title} ${site} ${year} ${url}`);
  return { formatted, inText: "[1]", style: "ieee", sourceType: data.sourceType };
}

// ─── ACS (numeric superscript) ───

function formatAuthorsACSList(authors: Author[]): string {
  if (!authors?.length) return "";
  return authors.map(authorACS).join("; ");
}

function generateACSJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsACSList(data.authors || []);
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const year = data.year || "";
  const vol = data.volume ? `*${data.volume}*` : "";
  const pages = data.pages || "";
  const doi = data.doi ? ` DOI: ${data.doi}.` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${data.title ? `${data.title}.` : ""} ${journal ? `${journal}` : ""} ${year}${vol ? `, ${vol}` : ""}${pages ? `, ${pages}` : ""}.${doi}`
  );
  return { formatted, inText: "¹", style: "acs", sourceType: data.sourceType };
}

function generateACSBook(data: SourceData): CitationResult {
  const authors = formatAuthorsACSList(data.authors || []);
  const title = data.title ? `*${data.title}*` : "";
  const edition = data.edition ? `${data.edition} ed.;` : "";
  const publisher = data.publisher ? `${data.publisher}:` : "";
  const location = data.publisherLocation || "";
  const year = data.year || "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${title ? `${title},` : ""} ${edition} ${publisher} ${location}${location && year ? ", " : ""}${year}.`
  );
  return { formatted, inText: "¹", style: "acs", sourceType: data.sourceType };
}

function generateACSWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsACSList(data.authors || []);
  const site = data.siteName || "";
  const accessed = data.accessDate ? ` (accessed ${data.accessDate})` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${data.title ? `${data.title}.` : ""} ${site ? `${site}.` : ""} ${data.url || ""}${accessed}.`
  );
  return { formatted, inText: "¹", style: "acs", sourceType: data.sourceType };
}

// ─── CSE 8th Edition (citation-sequence, numeric superscript) ───

function generateCSEJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 10);
  const journal = data.journalName || "";
  const year = data.year || "";
  const vol = data.volume || "";
  const issue = data.issue ? `(${data.issue})` : "";
  const pages = data.pages || "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${year ? `${year}.` : ""} ${data.title ? `${data.title}.` : ""} ${journal ? `${journal}.` : ""} ${vol}${issue}${pages ? `:${pages}` : ""}.`
  );
  return { formatted, inText: "¹", style: "cse", sourceType: data.sourceType };
}

function generateCSEBook(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 10);
  const title = data.title || "";
  const edition = data.edition ? `${data.edition} ed.` : "";
  const location = data.publisherLocation || "";
  const publisher = data.publisher || "";
  const year = data.year || "";
  const pub = [location, publisher].filter(Boolean).join(": ");
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${year ? `${year}.` : ""} ${title ? `${title}.` : ""} ${edition} ${pub ? `${pub}.` : ""}`
  );
  return { formatted, inText: "¹", style: "cse", sourceType: data.sourceType };
}

function generateCSEWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsVancouver(data.authors || [], 10);
  const site = data.siteName || "";
  const accessed = data.accessDate ? `[accessed ${data.accessDate}].` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${data.year ? `${data.year}.` : ""} ${data.title ? `${data.title}.` : ""} ${site ? `${site};` : ""} ${accessed} ${data.url || ""}`
  );
  return { formatted, inText: "¹", style: "cse", sourceType: data.sourceType };
}

// ─── ASA 7th Edition (author-date) ───

function generateASAJournal(data: SourceData): CitationResult {
  const authors = formatAuthorsASA(data.authors || []);
  const journal = data.journalName ? `*${data.journalName}*` : "";
  const vol = data.volume || "";
  const issue = data.issue ? `(${data.issue})` : "";
  const pages = data.pages || "";
  const year = data.year || "n.d.";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${year}. ${data.title ? `"${data.title}."` : ""} ${journal} ${vol}${issue}${pages ? `:${pages}` : ""}.`
  );
  const first = data.authors?.[0];
  const last = first ? (first.isOrganization ? first.organizationName : first.lastName) : data.title?.substring(0, 20);
  return { formatted, inText: `(${last} ${data.year || "n.d."}${data.pages ? `:${data.pages.split("-")[0]}` : ""})`, style: "asa", sourceType: data.sourceType };
}

function generateASABook(data: SourceData): CitationResult {
  const authors = formatAuthorsASA(data.authors || []);
  const title = data.title ? `*${data.title}*` : "";
  const location = data.publisherLocation || "";
  const publisher = data.publisher || "";
  const year = data.year || "n.d.";
  const pub = [location, publisher].filter(Boolean).join(": ");
  const formatted = tidy(`${authors ? `${authors}.` : ""} ${year}. ${title ? `${title}.` : ""} ${pub ? `${pub}.` : ""}`);
  const first = data.authors?.[0];
  const last = first ? (first.isOrganization ? first.organizationName : first.lastName) : data.title?.substring(0, 20);
  return { formatted, inText: `(${last} ${data.year || "n.d."})`, style: "asa", sourceType: data.sourceType };
}

function generateASAWebsite(data: SourceData): CitationResult {
  const authors = formatAuthorsASA(data.authors || []);
  const site = data.siteName || "";
  const year = data.year || "n.d.";
  const retrieved = data.accessDate ? `Retrieved ${data.accessDate}` : "";
  const formatted = tidy(
    `${authors ? `${authors}.` : ""} ${year}. ${data.title ? `"${data.title}."` : ""} ${site ? `${site}.` : ""} ${retrieved}${data.url ? ` (${data.url}).` : "."}`
  );
  const first = data.authors?.[0];
  const last = first ? (first.isOrganization ? first.organizationName : first.lastName) : data.title?.substring(0, 20);
  return { formatted, inText: `(${last} ${data.year || "n.d."})`, style: "asa", sourceType: data.sourceType };
}

// ─── Generic fallback for unsupported combos ───

function generateGenericCitation(data: SourceData, style: CitationStyle): CitationResult {
  const authors = data.authors?.map(a =>
    a.isOrganization ? a.organizationName : `${a.lastName}, ${a.firstName}`
  ).join("; ") || "[No Author]";
  const year = data.year || "n.d.";
  const title = data.title || data.caseName || data.statuteName || "[No Title]";

  return {
    formatted: `${authors} (${year}). ${title}.`,
    inText: `(${data.authors?.[0]?.lastName || title.substring(0, 20)}, ${year})`,
    style,
    sourceType: data.sourceType,
  };
}

// ─── Main generator ───

export function generateCitation(data: SourceData, style: CitationStyle): CitationResult {
  try {
    switch (style) {
      case "apa7":
        switch (data.sourceType) {
          case "website": return generateAPAWebsite(data);
          case "book": case "pdf": return generateAPABook(data);
          case "journal": case "newspaper": return generateAPAJournal(data);
          case "video": return generateAPAVideo(data);
          case "dissertation": return generateAPADissertation(data);
          default: return generateGenericCitation(data, style);
        }

      case "mla9":
        switch (data.sourceType) {
          case "website": return generateMLAWebsite(data);
          case "book": case "pdf": return generateMLABook(data);
          case "journal": case "newspaper": return generateMLAJournal(data);
          case "video": return generateMLAVideo(data);
          case "dissertation": return generateMLADissertation(data);
          default: return generateGenericCitation(data, style);
        }

      case "chicago":
      case "turabian":
        switch (data.sourceType) {
          case "website": return generateChicagoWebsite(data, style);
          case "book": case "pdf": return generateChicagoBook(data, style);
          case "journal": case "newspaper": return generateChicagoJournal(data, style);
          case "video": return generateChicagoVideo(data, style);
          case "dissertation": return generateChicagoDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      case "bluebook":
        switch (data.sourceType) {
          case "case_law": return generateBluebookCase(data);
          case "statute": return generateBluebookStatute(data);
          case "book": case "pdf": return generateBluebookBook(data);
          case "journal": return generateBluebookJournal(data);
          default: return generateGenericCitation(data, style);
        }

      case "harvard":
        switch (data.sourceType) {
          case "website": return generateHarvardWebsite(data);
          case "book": case "pdf": return generateHarvardBook(data);
          case "journal": case "newspaper": return generateHarvardJournal(data);
          case "video": return generateHarvardVideo(data);
          case "dissertation": return generateHarvardDissertation(data);
          default: return generateGenericCitation(data, style);
        }

      case "ama":
        switch (data.sourceType) {
          case "website": return generateAMAWebsite(data);
          case "book": case "pdf": return generateAMABook(data);
          case "journal": case "newspaper": return generateAMAJournal(data);
          case "video": return generateGenericVideo(data, style);
          case "dissertation": return generateGenericDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      case "ieee":
        switch (data.sourceType) {
          case "website": return generateIEEEWebsite(data);
          case "book": case "pdf": return generateIEEEBook(data);
          case "journal": case "newspaper": return generateIEEEJournal(data);
          case "video": return generateGenericVideo(data, style);
          case "dissertation": return generateGenericDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      case "acs":
        switch (data.sourceType) {
          case "website": return generateACSWebsite(data);
          case "book": case "pdf": return generateACSBook(data);
          case "journal": case "newspaper": return generateACSJournal(data);
          case "video": return generateGenericVideo(data, style);
          case "dissertation": return generateGenericDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      case "cse":
        switch (data.sourceType) {
          case "website": return generateCSEWebsite(data);
          case "book": case "pdf": return generateCSEBook(data);
          case "journal": case "newspaper": return generateCSEJournal(data);
          case "video": return generateGenericVideo(data, style);
          case "dissertation": return generateGenericDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      case "asa":
        switch (data.sourceType) {
          case "website": return generateASAWebsite(data);
          case "book": case "pdf": return generateASABook(data);
          case "journal": case "newspaper": return generateASAJournal(data);
          case "video": return generateGenericVideo(data, style);
          case "dissertation": return generateGenericDissertation(data, style);
          default: return generateGenericCitation(data, style);
        }

      default:
        return generateGenericCitation(data, style);
    }
  } catch {
    return generateGenericCitation(data, style);
  }
}

export function generateAllStyles(data: SourceData): CitationResult[] {
  const styles: CitationStyle[] = [
    "apa7", "mla9", "chicago", "turabian", "bluebook", "harvard",
    "ama", "ieee", "acs", "cse", "asa",
  ];
  return styles.map(style => generateCitation(data, style));
}
