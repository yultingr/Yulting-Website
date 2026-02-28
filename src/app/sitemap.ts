import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://yulting.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const staticPaths = ["", "/about", "/projects", "/blog", "/videos", "/contact", "/terms", "/privacy"];

  const staticPages = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );

  const blogPages = locales.flatMap((locale) => {
    const posts = getAllPosts(locale);
    return posts.map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));
  });

  return [...staticPages, ...blogPages];
}
