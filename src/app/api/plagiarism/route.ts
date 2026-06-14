import { NextRequest, NextResponse } from "next/server";
import { checkPlagiarism, countWords, isPlagiarismConfigured } from "@/lib/plagiarism";
import { clientIp, dailyLimit } from "@/lib/rate-limit";
import { FREE_PLAGIARISM } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    if (!isPlagiarismConfigured()) {
      return NextResponse.json(
        { configured: false, error: "Plagiarism checking is not configured yet." },
        { status: 503 }
      );
    }

    const { text } = (await request.json()) as { text?: string };
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const words = countWords(text);
    if (words < 20) {
      return NextResponse.json(
        { error: "Please paste at least 20 words to scan." },
        { status: 400 }
      );
    }

    // Free word cap — longer documents are a Pro feature.
    if (words > FREE_PLAGIARISM.wordLimit) {
      return NextResponse.json(
        {
          error: `The free plagiarism check covers up to ${FREE_PLAGIARISM.wordLimit} words (you pasted ${words}). Upgrade to Pro to scan full papers.`,
          limited: true,
        },
        { status: 402 }
      );
    }

    // Free daily scan cap — each scan costs us real API credits.
    const ip = clientIp(request.headers);
    const rl = dailyLimit(`plagiarism:${ip}`, FREE_PLAGIARISM.scansPerDay);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `You've used your free plagiarism scan${
            FREE_PLAGIARISM.scansPerDay > 1 ? "s" : ""
          } for today. Upgrade to Pro for more, or come back tomorrow.`,
          limited: true,
          resetAt: rl.resetAt,
        },
        { status: 429 }
      );
    }

    const result = await checkPlagiarism(text);
    return NextResponse.json({ result, remainingToday: rl.remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to scan text.";
    const temporary = /temporarily unavailable/i.test(message);
    return NextResponse.json(
      { error: temporary ? message : "Failed to scan text. Please try again." },
      { status: temporary ? 503 : 500 }
    );
  }
}
