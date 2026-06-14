import { NextRequest, NextResponse } from "next/server";

// Defaults to LanguageTool's free public API. For production scale, self-host
// LanguageTool (open source) and set LANGUAGETOOL_API_URL to your instance.
const LT_URL = process.env.LANGUAGETOOL_API_URL || "https://api.languagetool.org";
const MAX_CHARS = 10000;

interface LTMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule?: { id: string; issueType?: string; category?: { id: string; name: string } };
  context: { text: string; offset: number; length: number };
}

// LanguageTool category ids / issue types that count as punctuation.
const PUNCT_CATEGORIES = new Set(["PUNCTUATION", "TYPOGRAPHY"]);
const PUNCT_ISSUE_TYPES = new Set(["typographical", "whitespace"]);

export async function POST(request: NextRequest) {
  try {
    const { text, language, focus } = (await request.json()) as {
      text?: string;
      language?: string;
      focus?: string;
    };

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    if (text.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Text is too long. Please keep it under ${MAX_CHARS.toLocaleString()} characters.` },
        { status: 413 }
      );
    }

    const body = new URLSearchParams({
      text,
      language: language || "en-US",
      level: "picky",
    });

    const res = await fetch(`${LT_URL}/v2/check`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Grammar service is temporarily unavailable." }, { status: 502 });
    }

    const data = (await res.json()) as { matches: LTMatch[] };

    let rawMatches = data.matches || [];
    if (focus === "punctuation") {
      rawMatches = rawMatches.filter(
        (m) =>
          PUNCT_CATEGORIES.has(m.rule?.category?.id || "") ||
          PUNCT_ISSUE_TYPES.has(m.rule?.issueType || "")
      );
    }

    const matches = rawMatches.map((m) => ({
      message: m.message,
      shortMessage: m.shortMessage || "",
      offset: m.offset,
      length: m.length,
      replacements: m.replacements.slice(0, 5).map((r) => r.value),
      category: m.rule?.category?.name || "Other",
      issueType: m.rule?.issueType || "misc",
      context: m.context.text,
      contextOffset: m.context.offset,
      contextLength: m.context.length,
    }));

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ error: "Failed to check text." }, { status: 500 });
  }
}
