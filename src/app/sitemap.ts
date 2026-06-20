import type { MetadataRoute } from "next";
import { STYLE_SEO, SOURCE_SEO } from "@/lib/style-seo";
import { getPublishedPosts } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

// Regenerate hourly so deleted/added blog posts don't leave stale (404) URLs
// in the sitemap. Also revalidated on demand by the Outrank webhook.
export const revalidate = 3600;

/** Marketing + tool pages (excludes auth/dashboard). */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/generate", priority: 0.95, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/styles", priority: 0.85, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/plagiarism-checker", priority: 0.85, changeFrequency: "weekly" },
  { path: "/grammar-checker", priority: 0.85, changeFrequency: "weekly" },
  { path: "/punctuation-checker", priority: 0.85, changeFrequency: "weekly" },
  { path: "/paraphrasing-tool", priority: 0.85, changeFrequency: "weekly" },
  { path: "/summarizer", priority: 0.85, changeFrequency: "weekly" },
  { path: "/thesis-statement-generator", priority: 0.85, changeFrequency: "weekly" },
  { path: "/essay-outline-generator", priority: 0.85, changeFrequency: "weekly" },
  { path: "/hook-generator", priority: 0.85, changeFrequency: "weekly" },
  { path: "/conclusion-generator", priority: 0.85, changeFrequency: "weekly" },
  { path: "/annotated-bibliography", priority: 0.85, changeFrequency: "weekly" },
  { path: "/word-counter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/character-counter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/case-converter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/llms.txt", priority: 0.5, changeFrequency: "monthly" },
  { path: "/llms-full.txt", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Blog posts (auto-published via Outrank) — /blog/{slug}
  const posts = await getPublishedPosts();
  for (const post of posts) {
    entries.push({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Style landing pages — /styles/apa, /styles/ieee, …
  for (const seo of Object.values(STYLE_SEO)) {
    entries.push({
      url: `${BASE}/styles/${seo.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    });
  }

  // Programmatic cite guides — /cite/website/apa, …
  const styleSlugs = Object.values(STYLE_SEO).map((s) => s.slug);
  for (const source of Object.values(SOURCE_SEO)) {
    for (const styleSlug of styleSlugs) {
      entries.push({
        url: `${BASE}/cite/${source.slug}/${styleSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.72,
      });
    }
  }

  return entries;
}
