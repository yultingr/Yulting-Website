"use server";

import { cookies, headers } from "next/headers";
import { createHmac, timingSafeEqual, randomUUID } from "crypto";
import { writeFileSync, existsSync, mkdirSync, unlinkSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { type Video, parseVideoUrl } from "@/data/videos";
import type {
  Project,
  SkillCategory,
  ContactSubmission,
  Comment,
  AuditLogEntry,
  AnalyticsSummary,
} from "@/types";
import * as db from "@/lib/db";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Secrets
// ---------------------------------------------------------------------------

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "CHANGE-ME-SET-ADMIN-SECRET-ENV";
const COOKIE_NAME = "admin_session";

// Warn loudly if secret is not configured
if (process.env.ADMIN_SECRET === undefined || process.env.ADMIN_SECRET === "") {
  console.warn("[SECURITY] ADMIN_SECRET env var is not set. Using insecure fallback. Set it in production!");
}

// ---------------------------------------------------------------------------
// Audit helper
// ---------------------------------------------------------------------------

function audit(action: string, details: string): void {
  db.addAuditEntry({
    id: Date.now().toString(),
    action,
    details,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

// Server-side session store (random tokens, invalidatable)
const activeSessions = new Set<string>();

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

async function requireAuth(): Promise<boolean> {
  const authed = await isAuthenticated();
  return authed;
}

async function getClientIP(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function login(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const ip = await getClientIP();
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return { error: `Too many attempts. Try again in ${rl.resetIn} seconds.` };
  }

  const password = formData.get("password") as string;

  if (!password || password !== ADMIN_PASSWORD) {
    recordFailedAttempt(ip);
    audit("login_failed", `Invalid password attempt from ${ip}`);
    return { error: "Invalid password." };
  }

  resetAttempts(ip);

  // Generate a random session token (not static)
  const sessionId = randomUUID();
  activeSessions.add(sessionId);
  const sig = sign(sessionId);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${sessionId}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  audit("login", `Admin logged in from ${ip}`);
  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (cookie) {
    const [sessionId] = cookie.value.split(".");
    activeSessions.delete(sessionId);
  }
  cookieStore.delete(COOKIE_NAME);
  audit("logout", "Admin logged out");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;

  const [sessionId, sig] = cookie.value.split(".");
  if (!sessionId || !sig) return false;

  // Verify HMAC signature and check session is still active
  if (!verify(sessionId, sig)) return false;
  if (!activeSessions.has(sessionId)) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Video CRUD
// ---------------------------------------------------------------------------

export async function getVideos(): Promise<Video[]> {
  return db.getVideos();
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

  const videos = db.getVideos();
  videos.push({
    id: Date.now().toString(),
    platform: parsed.platform,
    videoId: parsed.videoId,
    title,
    ...(category ? { category } : {}),
  });
  db.setVideos(videos);
  audit("video_add", `Added video: ${title}`);

  return null;
}

export async function deleteVideo(id: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = db.getVideos();
  const video = videos.find((v) => v.id === id);
  db.setVideos(videos.filter((v) => v.id !== id));
  audit("video_delete", `Deleted video: ${video?.title ?? id}`);

  return null;
}

export async function reorderVideos(ids: string[]): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = db.getVideos();
  const map = new Map(videos.map((v) => [v.id, v]));
  const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Video[];

  for (const v of videos) {
    if (!ids.includes(v.id)) reordered.push(v);
  }

  db.setVideos(reordered);
  return null;
}

// ---------------------------------------------------------------------------
// Project CRUD
// ---------------------------------------------------------------------------

export async function getProjectsList(): Promise<Project[]> {
  return db.getProjects();
}

export async function addProject(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const techs = (formData.get("technologies") as string)?.trim();
  const liveUrl = (formData.get("liveUrl") as string)?.trim();
  const githubUrl = (formData.get("githubUrl") as string)?.trim();
  const year = parseInt(formData.get("year") as string) || new Date().getFullYear();
  const featured = formData.get("featured") === "on";

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };

  const projects = db.getProjects();
  projects.push({
    id: Date.now().toString(),
    title,
    description,
    technologies: techs ? techs.split(",").map((t) => t.trim()).filter(Boolean) : [],
    liveUrl: liveUrl || undefined,
    githubUrl: githubUrl || undefined,
    featured,
    year,
  });
  db.setProjects(projects);
  audit("project_add", `Added project: ${title}`);

  return null;
}

export async function deleteProject(id: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const projects = db.getProjects();
  const project = projects.find((p) => p.id === id);
  db.setProjects(projects.filter((p) => p.id !== id));
  audit("project_delete", `Deleted project: ${project?.title ?? id}`);

  return null;
}

// ---------------------------------------------------------------------------
// Skills CRUD
// ---------------------------------------------------------------------------

export async function getSkillsList(): Promise<SkillCategory[]> {
  return db.getSkills();
}

export async function addSkillCategory(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const name = (formData.get("name") as string)?.trim();
  const skillsStr = (formData.get("skills") as string)?.trim();

  if (!name) return { error: "Category name is required." };

  const categories = db.getSkills();
  categories.push({
    id: Date.now().toString(),
    name,
    skills: skillsStr ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean) : [],
  });
  db.setSkills(categories);
  audit("skill_add", `Added skill category: ${name}`);

  return null;
}

export async function deleteSkillCategory(id: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const categories = db.getSkills();
  const cat = categories.find((c) => c.id === id);
  db.setSkills(categories.filter((c) => c.id !== id));
  audit("skill_delete", `Deleted skill category: ${cat?.name ?? id}`);

  return null;
}

export async function updateSkillCategory(
  id: string,
  data: { name?: string; skills?: string[] },
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const categories = db.getSkills();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return { error: "Category not found." };

  if (data.name !== undefined) categories[idx].name = data.name;
  if (data.skills !== undefined) categories[idx].skills = data.skills;
  db.setSkills(categories);
  audit("skill_update", `Updated skill category: ${categories[idx].name}`);

  return null;
}

// ---------------------------------------------------------------------------
// Blog CRUD (MDX files)
// ---------------------------------------------------------------------------

const SLUG_RE = /^[a-z0-9-]+$/;

function getBlogDirPath(locale: string = "en"): string {
  return join(process.cwd(), "content", "blog", locale);
}

function validateSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

function safeBlogPath(slug: string, locale: string = "en"): string | null {
  if (!validateSlug(slug)) return null;
  const blogDir = getBlogDirPath(locale);
  const filePath = join(blogDir, `${slug}.mdx`);
  // Ensure resolved path stays inside blog directory
  if (!resolve(filePath).startsWith(resolve(blogDir))) return null;
  return filePath;
}

/** Escape a string for YAML double-quoted value */
function yamlEscape(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

export async function createBlogPost(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim();
  const tags = (formData.get("tags") as string)?.trim();
  const content = (formData.get("content") as string) || "";
  const published = formData.get("published") === "on";

  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  if (!summary) return { error: "Summary is required." };

  const filePath = safeBlogPath(slug);
  if (!filePath) {
    return { error: "Slug must contain only lowercase letters, numbers, and hyphens." };
  }

  const blogDir = getBlogDirPath("en");
  if (!existsSync(blogDir)) mkdirSync(blogDir, { recursive: true });

  if (existsSync(filePath)) {
    return { error: "A post with this slug already exists." };
  }

  const date = new Date().toISOString().split("T")[0];
  const tagsList = tags
    ? tags.split(",").map((t) => `"${yamlEscape(t.trim())}"`).join(", ")
    : "";
  const frontmatter = [
    "---",
    `title: "${yamlEscape(title)}"`,
    `date: "${date}"`,
    `summary: "${yamlEscape(summary)}"`,
    `tags: [${tagsList}]`,
    `published: ${published}`,
    "---",
    "",
    content,
    "",
  ].join("\n");

  writeFileSync(filePath, frontmatter, "utf-8");
  audit("blog_create", `Created blog post: ${title} (${slug})`);

  return null;
}

export async function updateBlogPost(
  slug: string,
  data: { title?: string; summary?: string; tags?: string; content?: string; published?: boolean },
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const filePath = safeBlogPath(slug);
  if (!filePath) return { error: "Invalid slug." };
  if (!existsSync(filePath)) return { error: "Post not found." };

  const raw = readFileSync(filePath, "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) return { error: "Invalid post format." };

  const lines = fmMatch[1].split("\n");
  const fm: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx > -1) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }

  const title = data.title ?? fm.title?.replace(/^"|"$/g, "") ?? "";
  const summary = data.summary ?? fm.summary?.replace(/^"|"$/g, "") ?? "";
  const tags = data.tags !== undefined ? data.tags : fm.tags ?? "[]";
  const published = data.published !== undefined ? data.published : fm.published === "true";
  const content = data.content !== undefined ? data.content : fmMatch[2];
  const date = fm.date?.replace(/^"|"$/g, "") ?? new Date().toISOString().split("T")[0];

  const tagsArray = tags.startsWith("[")
    ? tags
    : `[${tags.split(",").map((t) => `"${yamlEscape(t.trim())}"`).join(", ")}]`;

  const frontmatter = [
    "---",
    `title: "${yamlEscape(title)}"`,
    `date: "${date}"`,
    `summary: "${yamlEscape(summary)}"`,
    `tags: ${tagsArray}`,
    `published: ${published}`,
    "---",
    "",
    content,
  ].join("\n");

  writeFileSync(filePath, frontmatter, "utf-8");
  audit("blog_update", `Updated blog post: ${title} (${slug})`);

  return null;
}

export async function deleteBlogPost(slug: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const filePath = safeBlogPath(slug);
  if (!filePath) return { error: "Invalid slug." };
  if (!existsSync(filePath)) return { error: "Post not found." };

  unlinkSync(filePath);
  audit("blog_delete", `Deleted blog post: ${slug}`);

  return null;
}

// ---------------------------------------------------------------------------
// Contact submissions
// ---------------------------------------------------------------------------

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!(await requireAuth())) return [];
  return db.getSubmissions();
}

export async function markSubmissionRead(id: string): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) return;

  const subs = db.getSubmissions();
  const idx = subs.findIndex((s) => s.id === id);
  if (idx !== -1) {
    subs[idx].read = true;
    db.setSubmissions(subs);
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) return;

  const subs = db.getSubmissions();
  db.setSubmissions(subs.filter((s) => s.id !== id));
  audit("submission_delete", `Deleted contact submission: ${id}`);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function getCommentsList(): Promise<Comment[]> {
  if (!(await requireAuth())) return [];
  return db.getComments();
}

export async function approveComment(id: string): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) return;

  const comments = db.getComments();
  const idx = comments.findIndex((c) => c.id === id);
  if (idx !== -1) {
    comments[idx].approved = true;
    db.setComments(comments);
    audit("comment_approve", `Approved comment: ${id}`);
  }
}

export async function deleteComment(id: string): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) return;

  const comments = db.getComments();
  db.setComments(comments.filter((c) => c.id !== id));
  audit("comment_delete", `Deleted comment: ${id}`);
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!(await requireAuth())) return { totalViews: 0, uniquePaths: 0, topPages: [], viewsByDay: [] };
  const views = db.getPageViews();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentViews = views.filter((v) => new Date(v.timestamp) >= thirtyDaysAgo);

  const pathCounts = new Map<string, number>();
  for (const v of recentViews) {
    pathCounts.set(v.path, (pathCounts.get(v.path) || 0) + 1);
  }

  const topPages = Array.from(pathCounts.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const dayCounts = new Map<string, number>();
  for (const v of recentViews) {
    const date = v.timestamp.split("T")[0];
    dayCounts.set(date, (dayCounts.get(date) || 0) + 1);
  }

  const viewsByDay = Array.from(dayCounts.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalViews: recentViews.length,
    uniquePaths: pathCounts.size,
    topPages,
    viewsByDay,
  };
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export async function getAuditLogEntries(): Promise<AuditLogEntry[]> {
  if (!(await requireAuth())) return [];
  return db.getAuditLog().reverse().slice(0, 100);
}
