import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPostSlugs } from "@/lib/blog";

const BASE_URL = "https://yultingrinpoche.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/blog", "/videos", "/contact", "/terms", "/privacy"];
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of routing.locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Blog posts for each locale
  for (const locale of routing.locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
