import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/blog";
import { upsertPosts, pingSitemaps, type UpsertPost } from "@/lib/blog-admin";

export const dynamic = "force-dynamic";

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return false; // admin save is disabled until a secret is set
  const provided =
    req.headers.get("x-admin-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return provided === secret;
}

// POST /api/blog/save — manual create/update of a blog post (admin only).
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const slug =
    (typeof body.slug === "string" && body.slug.trim()) ? slugify(body.slug) : slugify(title);

  if (!title || !content) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.map(String)
    : typeof body.tags === "string"
      ? body.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const now = new Date().toISOString();
  const post: UpsertPost = {
    slug,
    title,
    content,
    description: typeof body.description === "string" ? body.description : "",
    image: typeof body.image === "string" ? body.image : "",
    tags,
    author: typeof body.author === "string" && body.author.trim() ? body.author : "CitePlex",
    status: typeof body.status === "string" && body.status.trim() ? body.status : "published",
    published_at: typeof body.published_at === "string" ? body.published_at : now,
    updated_at: now,
  };

  try {
    await upsertPosts([post]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upsert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  if (post.status === "published") pingSitemaps(siteUrl(req)).catch(() => {});

  return NextResponse.json({ ok: true, slug });
}
