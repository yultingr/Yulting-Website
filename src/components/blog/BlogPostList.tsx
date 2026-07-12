"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/types";

interface BlogPostListProps {
  posts: BlogPostMeta[];
  allTags: string[];
  locale: string;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded bg-accent/20 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function BlogPostList({ posts, allTags, locale }: BlogPostListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("blog");

  const filteredPosts = posts.filter((post) => {
    const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
    if (!matchesTag) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Search bar */}
      <div className="relative mt-10">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-sm px-3 py-1 text-sm transition-colors ${
              activeTag === null
                ? "text-accent underline decoration-accent/40 underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("allPosts")}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setActiveTag(activeTag === tag ? null : tag)
              }
              className={`rounded-sm px-3 py-1 text-sm transition-colors ${
                activeTag === tag
                  ? "text-accent underline decoration-accent/40 underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post list — a table of contents */}
      {filteredPosts.length === 0 ? (
        <div className="mt-16 border-y border-border py-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery || activeTag ? t("noResults") : t("noPosts")}
          </p>
        </div>
      ) : (
        <div className="mt-10">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="border-t border-border last:border-b">
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-8"
              >
                <div className="flex items-baseline gap-3 text-sm text-muted-foreground">
                  <time>
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime}</span>
                </div>

                <h2 className="mt-2 font-serif text-2xl text-foreground transition-colors group-hover:text-accent">
                  {highlightMatch(post.title, searchQuery)}
                </h2>

                <p className="mt-2 line-clamp-2 text-muted-foreground">
                  {highlightMatch(post.summary, searchQuery)}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
