// Provider-agnostic plagiarism helper.
// Default provider is Winston AI (https://gowinston.ai) which bills 2 credits/word.
// Configure via env: PLAGIARISM_API_KEY, PLAGIARISM_API_URL (optional).
//
// Plagiarism is the most expensive tool in CitePlex (real per-word API cost),
// so it is gated: a small free teaser + a Pro allowance. See plans.ts.

const API_KEY = process.env.PLAGIARISM_API_KEY || "";
const API_URL = process.env.PLAGIARISM_API_URL || "https://api.gowinston.ai/v2/plagiarism";

const PLACEHOLDER = /your_|_here|^$/i;

export function isPlagiarismConfigured(): boolean {
  return !!API_KEY && !PLACEHOLDER.test(API_KEY);
}

export interface PlagiarismSource {
  url: string;
  title: string;
  /** 0-100 share of the scanned text matched to this source. */
  percentage: number;
  matchedWords: number;
}

export interface PlagiarismResult {
  /** 0-100 overall similarity score. Higher = more text matched online. */
  score: number;
  scannedWords: number;
  matchedWords: number;
  sources: PlagiarismSource[];
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

interface WinstonSource {
  url?: string;
  title?: string;
  score?: number;
  percentage?: number;
  plagiarismWords?: number;
  totalNumberOfWords?: number;
}

interface WinstonResponse {
  status?: number;
  result?: {
    score?: number;
    textWordCounts?: number;
    totalPlagiarismWords?: number;
  };
  sources?: WinstonSource[];
}

/** Calls the configured plagiarism provider and normalizes the response. */
export async function checkPlagiarism(text: string): Promise<PlagiarismResult> {
  if (!isPlagiarismConfigured()) {
    throw new Error("Plagiarism checker is not configured");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ text, language: "en", country: "us" }),
  });

  if (res.status === 402) {
    // Provider credits exhausted — surface as a temporary outage, not a user error.
    throw new Error("Plagiarism service is temporarily unavailable (quota).");
  }
  if (!res.ok) {
    throw new Error(`Plagiarism request failed (${res.status})`);
  }

  const data = (await res.json()) as WinstonResponse;
  const scannedWords = data.result?.textWordCounts ?? countWords(text);
  const matchedWords = data.result?.totalPlagiarismWords ?? 0;

  const sources: PlagiarismSource[] = (data.sources || [])
    .map((s) => ({
      url: s.url || "",
      title: s.title || s.url || "Untitled source",
      percentage: Math.round(((s.percentage ?? s.score ?? 0) as number) * 10) / 10,
      matchedWords: s.plagiarismWords ?? 0,
    }))
    .filter((s) => s.url)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 25);

  return {
    score: Math.round((data.result?.score ?? 0) * 10) / 10,
    scannedWords,
    matchedWords,
    sources,
  };
}
