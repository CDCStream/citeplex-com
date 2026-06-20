import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  extractArticles,
  normalizeArticle,
  upsertPosts,
  pingSitemaps,
  type UpsertPost,
} from "@/lib/blog-admin";

export const dynamic = "force-dynamic";

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

/** Verify the Outrank webhook secret. Accepts everything if no secret is set. */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.OUTRANK_WEBHOOK_SECRET;
  if (!secret) return true; // not configured → open (dev / first setup)

  const sig = req.headers.get("x-webhook-signature");
  if (sig && sig === secret) return true;

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.replace(/^Bearer\s+/i, "");
  return bearer === secret;
}

// POST — Outrank sends published articles here.
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const articles = extractArticles(payload);
  if (!articles.length) {
    return NextResponse.json({ error: "No articles found in payload" }, { status: 400 });
  }

  const posts = articles
    .map(normalizeArticle)
    .filter((p): p is UpsertPost => p !== null);

  if (!posts.length) {
    return NextResponse.json({ error: "Articles missing title/content" }, { status: 400 });
  }

  let written = 0;
  try {
    written = await upsertPosts(posts);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upsert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Refresh the blog index, each affected post, and the sitemap.
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const p of posts) revalidatePath(`/blog/${p.slug}`);

  // Best-effort sitemap ping if anything was published.
  if (posts.some((p) => p.status === "published")) {
    pingSitemaps(siteUrl(req)).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    received: articles.length,
    written,
    slugs: posts.map((p) => p.slug),
  });
}

// GET — webhook verification (echo challenge) or a simple status payload.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const challenge = params.get("challenge") || params.get("hub.challenge");
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  return NextResponse.json({
    ok: true,
    endpoint: "outrank-webhook",
    configured: Boolean(process.env.OUTRANK_WEBHOOK_SECRET),
  });
}
