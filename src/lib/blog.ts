import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPostMeta, BlogPost } from "@/types";

const VALID_LOCALES = new Set(["en", "bo", "zh", "ne", "hi"]);

function getBlogDir(locale: string): string {
  // Prevent path traversal via locale parameter
  const safeLocale = VALID_LOCALES.has(locale) ? locale : "en";
  return path.join(process.cwd(), "content", "blog", safeLocale);
}

export function getAllPostSlugs(locale: string = "en"): string[] {
  const blogDir = getBlogDir(locale);
  if (!fs.existsSync(blogDir)) {
    // Fallback to English if locale dir doesn't exist
    const enDir = getBlogDir("en");
    if (!fs.existsSync(enDir)) return [];
    return fs
      .readdirSync(enDir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  }
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string, locale: string = "en"): BlogPost {
  // Validate slug to prevent path traversal
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Invalid slug");
  }
  let blogDir = getBlogDir(locale);
  let filePath = path.join(blogDir, `${slug}.mdx`);

  // Fallback to English if the locale-specific post doesn't exist
  if (!fs.existsSync(filePath)) {
    blogDir = getBlogDir("en");
    filePath = path.join(blogDir, `${slug}.mdx`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags ?? [],
    published: data.published ?? true,
    slug,
    readingTime: stats.text,
    content,
  };
}

export function getAllPosts(locale: string = "en"): BlogPostMeta[] {
  const slugs = getAllPostSlugs(locale);

  return slugs
    .map((slug) => {
      const post = getPostBySlug(slug, locale);
      const { content: _, ...meta } = post;
      return meta;
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAdjacentPosts(slug: string, locale: string = "en"): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const allPosts = getAllPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  return {
    prev: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    next: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
  };
}
