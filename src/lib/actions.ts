"use server";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import fs, { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { type Video, parseVideoUrl } from "@/data/videos";
import type { BlogPostMeta, BlogPost } from "@/types";

// ---------------------------------------------------------------------------
// Paths & secrets
// ---------------------------------------------------------------------------

const DATA_PATH = join(process.cwd(), "data", "videos.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";
const COOKIE_NAME = "admin_session";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function sign(value: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(value).digest("hex");
}

function verify(value: string, signature: string): boolean {
  const expected = sign(value);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function login(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get("password") as string;

  if (!password || password !== ADMIN_PASSWORD) {
    return { error: "Invalid password." };
  }

  const token = "authenticated";
  const sig = sign(token);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${token}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;

  const [token, sig] = cookie.value.split(".");
  if (!token || !sig) return false;

  return verify(token, sig);
}

// ---------------------------------------------------------------------------
// Video data helpers
// ---------------------------------------------------------------------------

function readVideos(): Video[] {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeVideos(videos: Video[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(videos, null, 2) + "\n", "utf-8");
}

// ---------------------------------------------------------------------------
// Video CRUD actions
// ---------------------------------------------------------------------------

export async function getVideos(): Promise<Video[]> {
  return readVideos();
}

export async function addVideo(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const url = (formData.get("url") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!url) return { error: "Please enter a video URL." };
  if (!title) return { error: "Please enter a title." };

  const parsed = parseVideoUrl(url);
  if (!parsed) {
    return { error: "Invalid URL. Please enter a YouTube or Facebook video URL." };
  }

  const videos = readVideos();
  const newVideo: Video = {
    id: Date.now().toString(),
    platform: parsed.platform,
    videoId: parsed.videoId,
    title,
    ...(category ? { category } : {}),
  };

  videos.push(newVideo);
  writeVideos(videos);

  return null; // success
}

export async function deleteVideo(id: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = readVideos();
  const updated = videos.filter((v) => v.id !== id);
  writeVideos(updated);

  return null;
}

export async function reorderVideos(ids: string[]): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = readVideos();
  const map = new Map(videos.map((v) => [v.id, v]));
  const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Video[];

  // Append any videos not in the ids list (safety measure)
  for (const v of videos) {
    if (!ids.includes(v.id)) reordered.push(v);
  }

  writeVideos(reordered);
  return null;
}

// ---------------------------------------------------------------------------
// Blog data helpers
// ---------------------------------------------------------------------------

import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = join(process.cwd(), "content", "blog");

function getBlogDir(locale: string): string {
  return join(BLOG_DIR, locale);
}

function ensureBlogDir(locale: string): void {
  const dir = getBlogDir(locale);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ---------------------------------------------------------------------------
// Blog CRUD actions
// ---------------------------------------------------------------------------

export async function getBlogPosts(locale: string = "en"): Promise<BlogPostMeta[]> {
  const blogDir = getBlogDir(locale);
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = join(blogDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);

      return {
        title: data.title ?? slug,
        date: data.date ?? new Date().toISOString().slice(0, 10),
        summary: data.summary ?? "",
        slug,
        tags: data.tags ?? [],
        readingTime: stats.text,
        published: data.published ?? true,
      } as BlogPostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(
  slug: string,
  locale: string = "en",
): Promise<BlogPost | null> {
  const filePath = join(getBlogDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    summary: data.summary ?? "",
    slug,
    tags: data.tags ?? [],
    readingTime: stats.text,
    published: data.published ?? true,
    content,
  };
}

export async function saveBlogPost(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim();
  const content = (formData.get("content") as string) ?? "";
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const date =
    (formData.get("date") as string)?.trim() ||
    new Date().toISOString().slice(0, 10);
  const published = formData.get("published") === "true";
  const locale = (formData.get("locale") as string) || "en";
  const originalSlug = (formData.get("originalSlug") as string)?.trim();

  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  if (!summary) return { error: "Summary is required." };

  // Validate slug format
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  ensureBlogDir(locale);

  // If renaming (slug changed), delete the old file
  if (originalSlug && originalSlug !== slug) {
    const oldPath = join(getBlogDir(locale), `${originalSlug}.mdx`);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `summary: "${summary.replace(/"/g, '\\"')}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`,
    `published: ${published}`,
    "---",
  ].join("\n");

  const fileContent = frontmatter + "\n\n" + content;
  const filePath = join(getBlogDir(locale), `${slug}.mdx`);
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return { success: true };
}

export async function deleteBlogPost(
  slug: string,
  locale: string = "en",
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const filePath = join(getBlogDir(locale), `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return null;
}
