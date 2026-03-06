"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { getAllPosts } from "@/lib/blog";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/actions";
import type { BlogPostMeta } from "@/types";

export function BlogEditor() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", summary: "", tags: "", content: "", published: true });
  const [createState, createFormAction, createPending] = useActionState(createBlogPost, null);
  const [, startTransition] = useTransition();

  async function loadPosts() {
    // We need to call this via a server action wrapper
    const res = await fetch("/api/blog/search?q=&locale=en");
    // Fallback: just reload
    window.location.reload();
  }

  useEffect(() => {
    // Load posts by fetching all
    fetch("/api/blog/search?q=a&locale=en")
      .then((r) => r.json())
      .then((data) => { setPosts(Array.isArray(data) ? data : []); setMounted(true); })
      .catch(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (createState === null && mounted) {
      // Reload after successful create
      fetch("/api/blog/search?q=a&locale=en")
        .then((r) => r.json())
        .then((data) => setPosts(Array.isArray(data) ? data : []));
    }
  }, [createState, mounted]);

  function handleDelete(slug: string) {
    if (!confirm("Delete this post?")) return;
    startTransition(async () => {
      await deleteBlogPost(slug);
      setPosts(posts.filter((p) => p.slug !== slug));
    });
  }

  function handleUpdate(slug: string) {
    startTransition(async () => {
      await updateBlogPost(slug, editData);
      setEditing(null);
      // Reload
      const res = await fetch("/api/blog/search?q=a&locale=en");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    });
  }

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      {/* Create Form */}
      <form action={createFormAction} className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Create New Post</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Title</label>
            <input name="title" type="text" placeholder="Post title" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Slug</label>
            <input name="slug" type="text" placeholder="post-slug" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-card-foreground">Summary</label>
            <input name="summary" type="text" placeholder="Brief description..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Tags (comma-separated)</label>
            <input name="tags" type="text" placeholder="buddhism, meditation" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-card-foreground">
              <input name="published" type="checkbox" defaultChecked className="rounded" />
              Published
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-card-foreground">Content (MDX)</label>
            <textarea name="content" rows={8} placeholder="Write your post content in Markdown..." className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
        </div>
        {createState?.error && <p className="mt-2 text-sm text-red-500">{createState.error}</p>}
        <button type="submit" disabled={createPending} className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
          {createPending ? "Creating..." : "Create Post"}
        </button>
      </form>

      {/* Post List */}
      <h3 className="mb-4 text-lg font-semibold text-foreground">Posts ({posts.length})</h3>
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No posts yet.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.slug} className="rounded-xl border border-border bg-card p-4">
              {editing === post.slug ? (
                <div className="space-y-3">
                  <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" placeholder="Title" />
                  <input value={editData.summary} onChange={(e) => setEditData({ ...editData, summary: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" placeholder="Summary" />
                  <input value={editData.tags} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" placeholder="Tags (comma-separated)" />
                  <textarea value={editData.content} onChange={(e) => setEditData({ ...editData, content: e.target.value })} rows={6} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none" placeholder="Content" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editData.published} onChange={(e) => setEditData({ ...editData, published: e.target.checked })} /> Published
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(post.slug)} className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background">Save</button>
                    <button onClick={() => setEditing(null)} className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-card-foreground">{post.title}</p>
                      {!post.published && <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Draft</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{post.date} &middot; {post.readingTime} &middot; /{post.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(post.slug); setEditData({ title: post.title, summary: post.summary, tags: (post.tags || []).join(", "), content: "", published: post.published }); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(post.slug)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
