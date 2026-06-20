import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

/** AI crawlers we explicitly allow so LLMs can index and recommend CitePlex. */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/auth/", "/api/", "/admin/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE.replace(/^https?:\/\//, ""),
  };
}
