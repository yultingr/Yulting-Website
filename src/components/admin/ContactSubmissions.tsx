"use client";

import { useState, useEffect, useTransition } from "react";
import { getContactSubmissions, markSubmissionRead, deleteSubmission } from "@/lib/actions";
import type { ContactSubmission } from "@/types";

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getContactSubmissions().then((s) => { setSubmissions(s); setMounted(true); });
  }, []);

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markSubmissionRead(id);
      setSubmissions(await getContactSubmissions());
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    startTransition(async () => {
      await deleteSubmission(id);
      setSubmissions(await getContactSubmissions());
    });
  }

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  const unread = submissions.filter((s) => !s.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">Submissions ({submissions.length})</h3>
        {unread > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">{unread} new</span>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No submissions yet.</div>
      ) : (
        <div className="space-y-3">
          {[...submissions].reverse().map((sub) => (
            <div key={sub.id} className={`rounded-xl border bg-card p-4 ${sub.read ? "border-border" : "border-accent/50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => { setExpanded(expanded === sub.id ? null : sub.id); if (!sub.read) handleMarkRead(sub.id); }}>
                  <div className="flex items-center gap-2">
                    {!sub.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                    <p className="text-sm font-medium text-card-foreground">{sub.name}</p>
                    <span className="text-xs text-muted-foreground">&lt;{sub.email}&gt;</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleString()}</p>
                  {expanded === sub.id && (
                    <div className="mt-3 rounded-lg bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-sm text-foreground">{sub.message}</p>
                      <a href={`mailto:${encodeURIComponent(sub.email)}?subject=${encodeURIComponent(`Re: Message from ${sub.name}`)}`} className="mt-2 inline-block text-xs text-accent hover:underline">Reply via email</a>
                    </div>
                  )}
                </div>
                <button onClick={() => handleDelete(sub.id)} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
