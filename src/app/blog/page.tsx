import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { getPublishedPosts, type BlogPost } from "@/lib/blog";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

export const metadata: Metadata = {
  title: "Blog — CitePlex",
  description:
    "Guides, tips and best practices on citations, academic writing, and research — from the CitePlex team.",
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: "CitePlex Blog",
    description: "Citation guides, academic writing tips, and research best practices.",
    type: "website",
    url: `${BASE}/blog`,
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:shadow-lg"
    >
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="aspect-video w-full bg-linear-to-br from-muted to-secondary" />
      )}

      <div className="flex flex-1 flex-col p-6">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        {post.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {post.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Guides and tips on citations, academic writing, and research.
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-16 text-center">
                <p className="text-muted-foreground">
                  No posts yet — check back soon for citation guides and writing tips.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
