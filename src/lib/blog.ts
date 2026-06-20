import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  status: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number; // minutes
}

/** Raw shape of a blog_posts row (loose — Supabase returns snake_case). */
interface BlogRow {
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  image?: string | null;
  tags?: string[] | null;
  author?: string | null;
  status?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

/** Estimated reading time in minutes (200 wpm), from HTML or plain text. */
export function readingTime(content: string): number {
  const text = (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 1;
  const words = text.split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

/** Normalize a DB row into a typed BlogPost. */
export function parseBlogPost(row: BlogRow): BlogPost {
  const content = row.content ?? "";
  const published = row.published_at ?? row.created_at ?? new Date().toISOString();
  return {
    slug: row.slug ?? "",
    title: row.title ?? "Untitled",
    description: row.description ?? "",
    content,
    image: row.image ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: row.author ?? "Outrank",
    status: row.status ?? "published",
    publishedAt: published,
    updatedAt: row.updated_at ?? published,
    readingTime: readingTime(content),
  };
}

/** All published posts, newest first. Empty array if Supabase is unconfigured. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data.map(parseBlogPost);
  } catch {
    return [];
  }
}

/** Single published post by slug, or null. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) return null;
    return parseBlogPost(data);
  } catch {
    return null;
  }
}

/** Slugs of all published posts (for static generation). */
export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("status", "published");
    if (error || !data) return [];
    return data.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}
