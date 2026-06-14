import { NextRequest, NextResponse } from "next/server";

interface MetadataResult {
  title?: string;
  authors?: { firstName: string; lastName: string }[];
  year?: string;
  month?: string;
  day?: string;
  siteName?: string;
  url?: string;
  doi?: string;
  publisher?: string;
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  isbn?: string;
}

async function fetchOpenGraphMetadata(url: string): Promise<MetadataResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CitePlex/1.0; +https://citeplex.io)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeout);

    const html = await res.text();
    const result: MetadataResult = { url };

    const getMetaContent = (nameOrProperty: string): string | undefined => {
      const regex = new RegExp(
        `<meta[^>]*(?:name|property)=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProperty}["']`,
        "i"
      );
      const match = html.match(regex);
      return match?.[1] || match?.[2];
    };

    result.title =
      getMetaContent("og:title") ||
      getMetaContent("citation_title") ||
      getMetaContent("dc.title") ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();

    result.siteName =
      getMetaContent("og:site_name") ||
      getMetaContent("citation_journal_title");

    result.doi = getMetaContent("citation_doi") || getMetaContent("dc.identifier");

    const authorMeta = getMetaContent("citation_author") || getMetaContent("author") || getMetaContent("dc.creator");
    if (authorMeta) {
      const names = authorMeta.split(",").map((n) => n.trim());
      if (names.length >= 2) {
        result.authors = [{ lastName: names[0], firstName: names[1] }];
      } else if (names.length === 1) {
        const parts = names[0].split(" ");
        result.authors = [{
          firstName: parts.slice(0, -1).join(" "),
          lastName: parts[parts.length - 1],
        }];
      }
    }

    const dateStr =
      getMetaContent("citation_publication_date") ||
      getMetaContent("citation_date") ||
      getMetaContent("article:published_time") ||
      getMetaContent("dc.date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        result.year = String(date.getFullYear());
        result.month = String(date.getMonth() + 1);
        result.day = String(date.getDate());
      }
    }

    result.publisher = getMetaContent("citation_publisher") || getMetaContent("dc.publisher");
    result.journalName = getMetaContent("citation_journal_title");
    result.volume = getMetaContent("citation_volume");
    result.issue = getMetaContent("citation_issue");
    result.pages =
      getMetaContent("citation_firstpage") && getMetaContent("citation_lastpage")
        ? `${getMetaContent("citation_firstpage")}-${getMetaContent("citation_lastpage")}`
        : undefined;
    result.isbn = getMetaContent("citation_isbn");

    return result;
  } catch {
    return { url };
  }
}

async function fetchDOIMetadata(doi: string): Promise<MetadataResult> {
  try {
    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, "").trim();
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("DOI not found");

    const data = await res.json();
    const work = data.message;

    const result: MetadataResult = {
      doi: cleanDoi,
      title: work.title?.[0],
      journalName: work["container-title"]?.[0],
      volume: work.volume,
      issue: work.issue,
      publisher: work.publisher,
    };

    if (work.author) {
      result.authors = work.author.map((a: { given?: string; family?: string }) => ({
        firstName: a.given || "",
        lastName: a.family || "",
      }));
    }

    if (work.published?.["date-parts"]?.[0]) {
      const [year, month, day] = work.published["date-parts"][0];
      result.year = year ? String(year) : undefined;
      result.month = month ? String(month) : undefined;
      result.day = day ? String(day) : undefined;
    } else if (work["published-print"]?.["date-parts"]?.[0]) {
      const [year, month, day] = work["published-print"]["date-parts"][0];
      result.year = year ? String(year) : undefined;
      result.month = month ? String(month) : undefined;
      result.day = day ? String(day) : undefined;
    }

    if (work.page) {
      result.pages = work.page;
    }

    return result;
  } catch {
    return {};
  }
}

async function fetchISBNMetadata(isbn: string): Promise<MetadataResult> {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, "");
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`
    );
    const data = await res.json();
    const book = data[`ISBN:${cleanISBN}`];

    if (!book) return {};

    return {
      title: book.title,
      isbn: cleanISBN,
      publisher: book.publishers?.[0]?.name,
      year: book.publish_date?.match(/\d{4}/)?.[0],
      authors: book.authors?.map((a: { name: string }) => {
        const parts = a.name.split(" ");
        return {
          firstName: parts.slice(0, -1).join(" "),
          lastName: parts[parts.length - 1],
        };
      }),
      pages: book.number_of_pages ? String(book.number_of_pages) : undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = (body.input || "").trim();

    if (!input) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    let result: MetadataResult;

    if (input.match(/^10\.\d{4,}/)) {
      result = await fetchDOIMetadata(input);
    } else if (input.match(/^https?:\/\/doi\.org\//)) {
      result = await fetchDOIMetadata(input);
    } else if (input.match(/^[\d-]{10,17}$/)) {
      result = await fetchISBNMetadata(input);
    } else if (input.match(/^https?:\/\//)) {
      result = await fetchOpenGraphMetadata(input);
    } else {
      result = await fetchISBNMetadata(input);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
