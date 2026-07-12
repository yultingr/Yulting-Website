import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://yultingrinpoche.com";

function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`]),
    ),
    "x-default": `${BASE_URL}/${routing.defaultLocale}${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/videos", "/blog", "/translations", "/contact", "/terms", "/privacy"];
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of routing.locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: { languages: languageAlternates(page) },
      });
    }
  }

  // Published blog posts for each locale
  for (const locale of routing.locales) {
    for (const post of getAllPosts(locale)) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
      });
    }
  }

  return entries;
}
