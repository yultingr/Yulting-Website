"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";

export function ShareButtons({
  slug,
  locale,
}: {
  title?: string;
  slug: string;
  locale: string;
}) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);

  // Canonical URL to avoid hydration mismatch
  const url = `${siteConfig.url}/${locale}/blog/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  return (
    <div className="mt-8 text-center print:hidden">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
      >
        {copied ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {t("copyLink")}
      </button>
    </div>
  );
}
