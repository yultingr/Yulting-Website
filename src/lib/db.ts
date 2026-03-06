import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type {
  Project,
  SkillCategory,
  ContactSubmission,
  Comment,
  PageView,
  AuditLogEntry,
} from "@/types";
import type { Video } from "@/data/videos";

const DATA_DIR = join(process.cwd(), "data");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readJSON<T>(filename: string, fallback: T): T {
  ensureDir(DATA_DIR);
  const filepath = join(DATA_DIR, filename);
  try {
    return JSON.parse(readFileSync(filepath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDir(DATA_DIR);
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function appendJSON<T>(filename: string, item: T): void {
  const arr = readJSON<T[]>(filename, []);
  arr.push(item);
  writeJSON(filename, arr);
}

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------
export function getVideos(): Video[] {
  return readJSON<Video[]>("videos.json", []);
}
export function setVideos(videos: Video[]): void {
  writeJSON("videos.json", videos);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export function getProjects(): Project[] {
  return readJSON<Project[]>("projects.json", []);
}
export function setProjects(projects: Project[]): void {
  writeJSON("projects.json", projects);
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export function getSkills(): SkillCategory[] {
  return readJSON<SkillCategory[]>("skills.json", []);
}
export function setSkills(skills: SkillCategory[]): void {
  writeJSON("skills.json", skills);
}

// ---------------------------------------------------------------------------
// Contact submissions
// ---------------------------------------------------------------------------
export function getSubmissions(): ContactSubmission[] {
  return readJSON<ContactSubmission[]>("submissions.json", []);
}
export function setSubmissions(submissions: ContactSubmission[]): void {
  writeJSON("submissions.json", submissions);
}
export function addSubmission(submission: ContactSubmission): void {
  appendJSON("submissions.json", submission);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
export function getComments(): Comment[] {
  return readJSON<Comment[]>("comments.json", []);
}
export function setComments(comments: Comment[]): void {
  writeJSON("comments.json", comments);
}
export function addComment(comment: Comment): void {
  appendJSON("comments.json", comment);
}

// ---------------------------------------------------------------------------
// Analytics (page views)
// ---------------------------------------------------------------------------
export function getPageViews(): PageView[] {
  return readJSON<PageView[]>("analytics.json", []);
}
export function addPageView(view: PageView): void {
  appendJSON("analytics.json", view);
}
export function clearPageViews(): void {
  writeJSON("analytics.json", []);
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------
export function getAuditLog(): AuditLogEntry[] {
  return readJSON<AuditLogEntry[]>("audit-log.json", []);
}
export function addAuditEntry(entry: AuditLogEntry): void {
  appendJSON("audit-log.json", entry);
}
