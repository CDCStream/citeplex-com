import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/blog";

/** A normalized post ready to upsert into blog_posts. */
export interface UpsertPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  status: string;
  published_at: string;
  updated_at: string;
}

type Loose = Record<string, unknown>;

function str(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

function strArray(...vals: unknown[]): string[] {
  for (const v of vals) {
    if (Array.isArray(v)) {
      const arr = v.map((x) => (typeof x === "string" ? x : String(x))).filter(Boolean);
      if (arr.length) return arr;
    }
    if (typeof v === "string" && v.trim()) {
      return v.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/**
 * Pull article(s) out of an Outrank webhook payload. Outrank (and similar)
 * wrap articles in various shapes, so we probe several known locations.
 */
export function extractArticles(payload: unknown): Loose[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Loose;
  const data = (p.data && typeof p.data === "object" ? (p.data as Loose) : {}) as Loose;

  const candidates: unknown[] = [
    p.articles,
    data.articles,
    p.article,
    data.article,
    p.posts,
    data.posts,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length) return c.filter((x) => x && typeof x === "object") as Loose[];
    if (c && typeof c === "object") return [c as Loose];
  }
  // Fall back to treating the payload itself as a single article.
  if (str(p.title) || str(p.content_html, p.content, p.html, p.body)) return [p];
  return [];
}

/** Normalize a single loose article object into an UpsertPost. */
export function normalizeArticle(article: Loose): UpsertPost | null {
  const title = str(article.title, article.name, article.headline);
  const content = str(
    article.content_html,
    article.contentHtml,
    article.content,
    article.html,
    article.body,
    article.content_markdown
  );
  if (!title && !content) return null;

  const slug =
    str(article.slug, article.permalink) || slugify(title || "post");
  const description = str(
    article.description,
    article.meta_description,
    article.metaDescription,
    article.excerpt,
    article.summary
  );
  const image = str(
    article.image,
    article.image_url,
    article.imageUrl,
    article.cover_image,
    article.coverImage,
    article.featured_image,
    article.og_image
  );
  const tags = strArray(article.tags, article.keywords, article.categories);
  const author = str(article.author, article.author_name) || "Outrank";
  const publishedAt =
    str(article.published_at, article.publishedAt, article.created_at, article.createdAt) ||
    new Date().toISOString();
  // No content yet → keep as draft so it doesn't show on the live blog.
  const status = content ? str(article.status) || "published" : "draft";

  return {
    slug,
    title: title || "Untitled",
    description,
    content,
    image,
    tags,
    author,
    status,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };
}

/** Upsert posts by slug. Returns the number written. */
export async function upsertPosts(posts: UpsertPost[]): Promise<number> {
  if (!posts.length) return 0;
  const supabase = createAdminClient();
  const { error, data } = await supabase
    .from("blog_posts")
    .upsert(posts, { onConflict: "slug" })
    .select("slug");
  if (error) throw new Error(error.message);
  return data?.length ?? posts.length;
}

/**
 * Best-effort search-engine sitemap ping. Google & Bing have deprecated their
 * ping endpoints, so this is fire-and-forget and never blocks the response.
 */
export async function pingSitemaps(baseUrl: string): Promise<void> {
  const sitemap = encodeURIComponent(`${baseUrl}/sitemap.xml`);
  const urls = [
    `https://www.google.com/ping?sitemap=${sitemap}`,
    `https://www.bing.com/ping?sitemap=${sitemap}`,
  ];
  await Promise.allSettled(
    urls.map((u) => fetch(u, { method: "GET", cache: "no-store" }))
  );
}
