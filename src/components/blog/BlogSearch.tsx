"use client";

import { useState, useEffect, useRef } from "react";
import type { BlogPostMeta } from "@/types";

export function BlogSearch({ locale }: { locale: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogPostMeta[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, locale]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative mt-8 max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search posts..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card shadow-lg">
          {results.map((post) => (
            <a
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block border-b border-border px-4 py-3 last:border-0 hover:bg-muted/50"
            >
              <p className="text-sm font-medium text-card-foreground">{post.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{post.date} &middot; {post.readingTime}</p>
            </a>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card p-4 shadow-lg">
          <p className="text-sm text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  );
}
