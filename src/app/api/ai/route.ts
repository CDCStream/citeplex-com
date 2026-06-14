import { NextRequest, NextResponse } from "next/server";
import { callAI, isAIConfigured } from "@/lib/ai";
import { clientIp, dailyLimit } from "@/lib/rate-limit";
import { getProfile } from "@/lib/auth";
import { FREE_AI, PRO_AI } from "@/lib/plans";

const VALID_MODES = ["paraphrase", "summarize", "thesis", "outline", "hook", "conclusion"] as const;
type AiMode = (typeof VALID_MODES)[number];

// Free-tier input caps (words). Longer texts are a Pro feature.
const FREE_WORD_LIMIT: Record<AiMode, number> = {
  paraphrase: 500,
  summarize: 1500,
  thesis: 150,
  outline: 300,
  hook: 150,
  conclusion: 400,
};

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function buildPrompt(mode: AiMode, text: string, option: string) {
  if (mode === "summarize") {
    const lengthHint =
      option === "short" ? "in 1-2 concise sentences" : option === "long" ? "in a detailed paragraph" : "in 3-4 sentences";
    const format = option === "bullets" ? "as a short bulleted list of key points" : lengthHint;
    return {
      system: "You are a precise summarization assistant. Summarize the user's text faithfully without adding new information or opinions.",
      user: `Summarize the following text ${format}. Keep it clear and neutral.\n\n${text}`,
      maxTokens: 800,
    };
  }

  if (mode === "thesis") {
    const typeMap: Record<string, string> = {
      argumentative: "a clear, debatable argumentative thesis that takes a firm position",
      analytical: "an analytical thesis that breaks down how or why something works",
      expository: "an informative expository thesis that explains a topic clearly",
      persuasive: "a persuasive thesis designed to convince the reader",
    };
    const style = typeMap[option] || typeMap.argumentative;
    return {
      system: "You are an academic writing coach. Write strong, specific thesis statements suitable for high school and college essays. Return only the thesis statement — no preamble or explanation.",
      user: `Write ${style} for this topic:\n\n${text}\n\nReturn 1-2 sentences only.`,
      maxTokens: 200,
    };
  }

  if (mode === "outline") {
    const formatMap: Record<string, string> = {
      "five-paragraph": "a classic 5-paragraph essay outline (Introduction with hook + thesis, 3 body paragraphs with topic sentences, Conclusion)",
      argumentative: "an argumentative essay outline with Introduction, opposing view, rebuttal, supporting arguments, and Conclusion",
      research: "a research paper outline with Introduction, Literature context, Methods/approach, Key arguments, Counterarguments, and Conclusion",
      compare: "a compare-and-contrast essay outline with Introduction, Point-by-point or block comparison sections, and Conclusion",
    };
    const format = formatMap[option] || formatMap["five-paragraph"];
    return {
      system: "You are an academic writing coach. Create clear, structured essay outlines with Roman numerals or numbered sections and bullet points for key ideas. Return only the outline.",
      user: `Create ${format} for:\n\n${text}`,
      maxTokens: 900,
    };
  }

  if (mode === "conclusion") {
    const styleMap: Record<string, string> = {
      summary: "a conclusion that restates the thesis in fresh words and ties the main points together",
      "call-to-action": "a conclusion that summarizes the argument and ends with a clear call to action",
      reflective: "a reflective conclusion that considers the broader significance and implications of the topic",
      synthesis: "a conclusion that synthesizes the key points into a final insight rather than just summarizing",
    };
    const style = styleMap[option] || styleMap.summary;
    return {
      system:
        "You are an academic writing coach. Write a strong concluding paragraph for an essay based on the thesis and main points the user provides. Do not introduce new arguments or evidence. Return only the conclusion paragraph — no heading or preamble.",
      user: `Write ${style} for an essay with the following thesis and points:\n\n${text}\n\nReturn a single polished paragraph.`,
      maxTokens: 400,
    };
  }

  if (mode === "hook") {
    const hookMap: Record<string, string> = {
      question: "a thought-provoking opening question that draws the reader in",
      statistic: "an opening hook that leads with a surprising statistic or fact (you may use a plausible illustrative figure if needed, but keep it realistic)",
      anecdote: "a brief, vivid anecdotal opening (2-3 sentences) that sets up the topic",
      quote: "an opening hook that starts with a relevant quotation (attribute it generically if no specific source is given)",
      bold: "a bold, attention-grabbing opening statement",
    };
    const hook = hookMap[option] || hookMap.question;
    return {
      system: "You are an academic writing coach. Write compelling essay opening hooks for high school and college students. Return only the hook — 1-3 sentences, no explanation.",
      user: `Write ${hook} for an essay about:\n\n${text}`,
      maxTokens: 250,
    };
  }

  // paraphrase
  const toneMap: Record<string, string> = {
    standard: "in clear, natural language while preserving the original meaning",
    fluent: "to read more smoothly and fluently",
    formal: "in a formal, academic tone suitable for essays and papers",
    simple: "in simpler, easier-to-read language",
    creative: "with more varied and expressive wording",
  };
  const instruction = toneMap[option] || toneMap.standard;
  return {
    system: "You are a paraphrasing assistant. Rewrite the user's text without changing its meaning. Do not add commentary; return only the rewritten text.",
    user: `Paraphrase the following text ${instruction}. Return only the rewritten text.\n\n${text}`,
    maxTokens: 1200,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!isAIConfigured()) {
      return NextResponse.json(
        { configured: false, error: "AI features are not configured yet." },
        { status: 503 }
      );
    }

    const { mode, text, option } = (await request.json()) as {
      mode?: string;
      text?: string;
      option?: string;
    };

    if (!mode || !VALID_MODES.includes(mode as AiMode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const aiMode = mode as AiMode;
    const words = countWords(text);
    const limit = FREE_WORD_LIMIT[aiMode];
    if (words > limit) {
      return NextResponse.json(
        {
          error: `Free limit is ${limit} words for this tool (you pasted ${words}). Upgrade to Pro for longer texts.`,
          limited: true,
        },
        { status: 402 }
      );
    }

    // Per-day cost guard — every generation spends OpenAI tokens. Keyed by user
    // id when signed in (so it follows them across networks), else by IP.
    const profile = await getProfile();
    const isPro = profile?.plan === "pro" || profile?.plan === "team";
    const dailyCap = isPro ? PRO_AI.requestsPerDay : FREE_AI.requestsPerDay;
    const key = profile?.id ? `ai:user:${profile.id}` : `ai:ip:${clientIp(request.headers)}`;
    const rl = dailyLimit(key, dailyCap);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: isPro
            ? "You've reached today's AI limit. It resets within 24 hours."
            : "You've used your free AI generations for today. Upgrade to Pro for much higher limits, or come back tomorrow.",
          limited: true,
          resetAt: rl.resetAt,
        },
        { status: 429 }
      );
    }

    const { system, user, maxTokens } = buildPrompt(aiMode, text, option || "standard");
    const result = await callAI(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      maxTokens
    );

    if (!result) {
      return NextResponse.json({ error: "No result returned." }, { status: 502 });
    }

    return NextResponse.json({ result, remainingToday: rl.remaining });
  } catch {
    return NextResponse.json({ error: "Failed to process text." }, { status: 500 });
  }
}
