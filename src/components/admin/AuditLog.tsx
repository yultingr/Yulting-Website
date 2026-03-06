"use client";

import { useState, useEffect } from "react";
import { getAuditLogEntries } from "@/lib/actions";
import type { AuditLogEntry } from "@/types";

const actionColors: Record<string, string> = {
  login: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  login_failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  logout: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  video_add: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  video_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  blog_create: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  blog_update: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  blog_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  project_add: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  project_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  skill_add: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  skill_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  skill_update: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  comment_approve: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  comment_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  submission_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function AuditLog() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getAuditLogEntries().then((e) => { setEntries(e); setMounted(true); });
  }, []);

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Activity ({entries.length})</h3>
      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No activity recorded yet.</div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${actionColors[entry.action] || "bg-muted text-muted-foreground"}`}>
                {entry.action}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm text-card-foreground">{entry.details}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
