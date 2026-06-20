"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "edit" | "preview";

export default function NewBlogPostPage() {
  const [tab, setTab] = useState<Tab>("edit");
  const [secret, setSecret] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("CitePlex");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function save() {
    setSaving(true);
    setResult(null);
    try {
      const res = await fetch("/api/blog/save", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({
          title,
          slug,
          description,
          author,
          image,
          tags,
          status,
          content,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: `Saved → /blog/${data.slug}` });
      } else {
        setResult({ ok: false, msg: data.error || `Error ${res.status}` });
      }
    } catch {
      setResult({ ok: false, msg: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40";
  const label = "mb-1.5 block text-[12px] font-medium text-foreground";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">New blog post</h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Manual editor. Posts published via Outrank land automatically — this is for
        hand-written posts.
      </p>

      <div className="mt-6">
        <label className={label}>Admin secret</label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="BLOG_ADMIN_SECRET"
          className={field}
        />
      </div>

      <div className="mt-6 flex gap-1.5">
        {(["edit", "preview"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-colors",
              tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "edit" ? (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>Slug (auto from title if blank)</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={field} />
            </div>
          </div>

          <div>
            <label className={label}>Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>Tags (comma-separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Content (HTML) *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className={cn(field, "font-mono text-[13px]")}
              placeholder="<h2>Heading</h2><p>Body…</p>"
            />
          </div>
        </div>
      ) : (
        <article className="mt-6 rounded-2xl border border-border p-8">
          <h1 className="text-3xl font-bold tracking-tight">{title || "Untitled"}</h1>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
          <div className="blog-content mt-8" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving || !secret || !title || !content}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save post"}
        </button>
        {result && (
          <span className={cn("text-sm", result.ok ? "text-emerald-600" : "text-destructive")}>
            {result.msg}
          </span>
        )}
      </div>
    </main>
  );
}
