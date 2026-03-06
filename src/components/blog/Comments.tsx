"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@/types";

export function Comments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name: name.trim(), email: email.trim(), content: content.trim() }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setContent("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="text-xl font-bold text-foreground">Comments</h2>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="mt-6 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      {status === "sent" ? (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-700 dark:text-green-400">Comment submitted! It will appear after approval.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name *" className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none" />
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={4} placeholder="Write a comment..." className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none" />
          {status === "error" && <p className="text-sm text-red-500">Failed to submit. Try again.</p>}
          <button type="submit" disabled={status === "sending"} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
            {status === "sending" ? "Submitting..." : "Post Comment"}
          </button>
        </form>
      )}
    </div>
  );
}
