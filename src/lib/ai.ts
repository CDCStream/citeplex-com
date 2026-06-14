// Provider-agnostic LLM helper. Works with any OpenAI-compatible chat API.
// Configure via env: AI_API_KEY (or OPENAI_API_KEY), AI_BASE_URL, AI_MODEL.

const API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "";
const BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";
const MODEL = process.env.AI_MODEL || "gpt-4o-mini";

const PLACEHOLDER = /your_|_here|^$/i;

export function isAIConfigured(): boolean {
  return !!API_KEY && !PLACEHOLDER.test(API_KEY);
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export async function callAI(messages: ChatMessage[], maxTokens = 1024): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error("AI is not configured");
  }
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed (${res.status})`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}
