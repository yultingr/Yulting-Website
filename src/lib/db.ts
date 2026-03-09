import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, readFileSync, mkdirSync } from "fs";
import type {
  Project,
  SkillCategory,
  ContactSubmission,
  Comment,
  PageView,
  AuditLogEntry,
} from "@/types";
import type { Video } from "@/data/videos";

// ---------------------------------------------------------------------------
// Database setup
// ---------------------------------------------------------------------------

const DATA_DIR = join(process.cwd(), "data");
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = join(DATA_DIR, "site.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL"); // Better concurrent read performance
  _db.pragma("foreign_keys = ON");

  initTables(_db);
  migrateFromJson(_db);

  return _db;
}

function initTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT,
      category TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL DEFAULT '[]',
      image TEXT,
      liveUrl TEXT,
      githubUrl TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      year INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      skills TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      postSlug TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      referrer TEXT,
      userAgent TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      expiresAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(postSlug);
    CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expiresAt);
  `);
}

// ---------------------------------------------------------------------------
// One-time migration from JSON files
// ---------------------------------------------------------------------------

function readJsonSafe<T>(filename: string, fallback: T): T {
  const filepath = join(DATA_DIR, filename);
  try {
    if (!existsSync(filepath)) return fallback;
    return JSON.parse(readFileSync(filepath, "utf-8"));
  } catch {
    return fallback;
  }
}

function migrateFromJson(db: Database.Database): void {
  // Only migrate if tables are empty (first run after migration)
  const videoCount = (db.prepare("SELECT COUNT(*) as c FROM videos").get() as { c: number }).c;
  if (videoCount > 0) return; // Already has data, skip migration

  const hasAnyJson = ["videos.json", "projects.json", "skills.json", "submissions.json", "comments.json", "analytics.json", "audit-log.json"]
    .some(f => existsSync(join(DATA_DIR, f)));
  if (!hasAnyJson) return; // No JSON files to migrate

  const migrate = db.transaction(() => {
    // Videos
    const videos = readJsonSafe<Video[]>("videos.json", []);
    const insertVideo = db.prepare(
      "INSERT OR IGNORE INTO videos (id, platform, videoId, title, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    );
    videos.forEach((v, i) => insertVideo.run(v.id, v.platform, v.videoId, v.title ?? null, v.category ?? null, i));

    // Projects
    const projects = readJsonSafe<Project[]>("projects.json", []);
    const insertProject = db.prepare(
      "INSERT OR IGNORE INTO projects (id, title, description, technologies, image, liveUrl, githubUrl, featured, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const p of projects) {
      insertProject.run(p.id, p.title, p.description, JSON.stringify(p.technologies), p.image ?? null, p.liveUrl ?? null, p.githubUrl ?? null, p.featured ? 1 : 0, p.year);
    }

    // Skills
    const skills = readJsonSafe<SkillCategory[]>("skills.json", []);
    const insertSkill = db.prepare(
      "INSERT OR IGNORE INTO skills (id, name, skills) VALUES (?, ?, ?)"
    );
    for (const s of skills) {
      insertSkill.run(s.id, s.name, JSON.stringify(s.skills));
    }

    // Submissions
    const submissions = readJsonSafe<ContactSubmission[]>("submissions.json", []);
    const insertSub = db.prepare(
      "INSERT OR IGNORE INTO submissions (id, name, email, message, createdAt, read) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const s of submissions) {
      insertSub.run(s.id, s.name, s.email, s.message, s.createdAt, s.read ? 1 : 0);
    }

    // Comments
    const comments = readJsonSafe<Comment[]>("comments.json", []);
    const insertComment = db.prepare(
      "INSERT OR IGNORE INTO comments (id, postSlug, name, email, content, createdAt, approved) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const c of comments) {
      insertComment.run(c.id, c.postSlug, c.name, c.email, c.content, c.createdAt, c.approved ? 1 : 0);
    }

    // Page views
    const views = readJsonSafe<PageView[]>("analytics.json", []);
    const insertView = db.prepare(
      "INSERT INTO page_views (path, timestamp, referrer, userAgent) VALUES (?, ?, ?, ?)"
    );
    for (const v of views) {
      insertView.run(v.path, v.timestamp, v.referrer ?? null, v.userAgent ?? null);
    }

    // Audit log
    const entries = readJsonSafe<AuditLogEntry[]>("audit-log.json", []);
    const insertAudit = db.prepare(
      "INSERT OR IGNORE INTO audit_log (id, action, details, timestamp) VALUES (?, ?, ?, ?)"
    );
    for (const e of entries) {
      insertAudit.run(e.id, e.action, e.details, e.timestamp);
    }
  });

  migrate();
  console.log("[DB] Migrated JSON data to SQLite");
}

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------

export function getVideos(): Video[] {
  const rows = getDb().prepare("SELECT * FROM videos ORDER BY sort_order ASC").all() as Array<{
    id: string; platform: string; videoId: string; title: string | null; category: string | null;
  }>;
  return rows.map(r => ({
    id: r.id,
    platform: r.platform as "youtube" | "facebook",
    videoId: r.videoId,
    ...(r.title ? { title: r.title } : {}),
    ...(r.category ? { category: r.category } : {}),
  }));
}

export function setVideos(videos: Video[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM videos").run();
    const insert = db.prepare(
      "INSERT INTO videos (id, platform, videoId, title, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    );
    videos.forEach((v, i) => insert.run(v.id, v.platform, v.videoId, v.title ?? null, v.category ?? null, i));
  });
  tx();
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function getProjects(): Project[] {
  const rows = getDb().prepare("SELECT * FROM projects").all() as Array<{
    id: string; title: string; description: string; technologies: string;
    image: string | null; liveUrl: string | null; githubUrl: string | null;
    featured: number; year: number;
  }>;
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    technologies: JSON.parse(r.technologies),
    ...(r.image ? { image: r.image } : {}),
    ...(r.liveUrl ? { liveUrl: r.liveUrl } : {}),
    ...(r.githubUrl ? { githubUrl: r.githubUrl } : {}),
    featured: r.featured === 1,
    year: r.year,
  }));
}

export function setProjects(projects: Project[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM projects").run();
    const insert = db.prepare(
      "INSERT INTO projects (id, title, description, technologies, image, liveUrl, githubUrl, featured, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const p of projects) {
      insert.run(p.id, p.title, p.description, JSON.stringify(p.technologies), p.image ?? null, p.liveUrl ?? null, p.githubUrl ?? null, p.featured ? 1 : 0, p.year);
    }
  });
  tx();
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export function getSkills(): SkillCategory[] {
  const rows = getDb().prepare("SELECT * FROM skills").all() as Array<{
    id: string; name: string; skills: string;
  }>;
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    skills: JSON.parse(r.skills),
  }));
}

export function setSkills(skills: SkillCategory[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM skills").run();
    const insert = db.prepare("INSERT INTO skills (id, name, skills) VALUES (?, ?, ?)");
    for (const s of skills) {
      insert.run(s.id, s.name, JSON.stringify(s.skills));
    }
  });
  tx();
}

// ---------------------------------------------------------------------------
// Contact submissions
// ---------------------------------------------------------------------------

export function getSubmissions(): ContactSubmission[] {
  const rows = getDb().prepare("SELECT * FROM submissions ORDER BY createdAt DESC").all() as Array<{
    id: string; name: string; email: string; message: string; createdAt: string; read: number;
  }>;
  return rows.map(r => ({ ...r, read: r.read === 1 }));
}

export function setSubmissions(submissions: ContactSubmission[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM submissions").run();
    const insert = db.prepare(
      "INSERT INTO submissions (id, name, email, message, createdAt, read) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const s of submissions) {
      insert.run(s.id, s.name, s.email, s.message, s.createdAt, s.read ? 1 : 0);
    }
  });
  tx();
}

export function addSubmission(submission: ContactSubmission): void {
  getDb().prepare(
    "INSERT INTO submissions (id, name, email, message, createdAt, read) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(submission.id, submission.name, submission.email, submission.message, submission.createdAt, submission.read ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export function getComments(): Comment[] {
  const rows = getDb().prepare("SELECT * FROM comments ORDER BY createdAt DESC").all() as Array<{
    id: string; postSlug: string; name: string; email: string; content: string; createdAt: string; approved: number;
  }>;
  return rows.map(r => ({ ...r, approved: r.approved === 1 }));
}

export function setComments(comments: Comment[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM comments").run();
    const insert = db.prepare(
      "INSERT INTO comments (id, postSlug, name, email, content, createdAt, approved) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const c of comments) {
      insert.run(c.id, c.postSlug, c.name, c.email, c.content, c.createdAt, c.approved ? 1 : 0);
    }
  });
  tx();
}

export function addComment(comment: Comment): void {
  getDb().prepare(
    "INSERT INTO comments (id, postSlug, name, email, content, createdAt, approved) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(comment.id, comment.postSlug, comment.name, comment.email, comment.content, comment.createdAt, comment.approved ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Analytics (page views)
// ---------------------------------------------------------------------------

export function getPageViews(): PageView[] {
  const rows = getDb().prepare("SELECT path, timestamp, referrer, userAgent FROM page_views ORDER BY timestamp DESC").all() as PageView[];
  return rows;
}

export function addPageView(view: PageView): void {
  getDb().prepare(
    "INSERT INTO page_views (path, timestamp, referrer, userAgent) VALUES (?, ?, ?, ?)"
  ).run(view.path, view.timestamp, view.referrer ?? null, view.userAgent ?? null);
}

export function clearPageViews(): void {
  getDb().prepare("DELETE FROM page_views").run();
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export function getAuditLog(): AuditLogEntry[] {
  return getDb().prepare("SELECT * FROM audit_log ORDER BY timestamp DESC").all() as AuditLogEntry[];
}

export function addAuditEntry(entry: AuditLogEntry): void {
  getDb().prepare(
    "INSERT INTO audit_log (id, action, details, timestamp) VALUES (?, ?, ?, ?)"
  ).run(entry.id, entry.action, entry.details, entry.timestamp);
}

// ---------------------------------------------------------------------------
// Sessions (persistent, replaces in-memory Set)
// ---------------------------------------------------------------------------

export function createSession(sessionId: string, ttlMs: number = 24 * 60 * 60 * 1000): void {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);
  getDb().prepare(
    "INSERT OR REPLACE INTO sessions (id, createdAt, expiresAt) VALUES (?, ?, ?)"
  ).run(sessionId, now.toISOString(), expiresAt.toISOString());
}

export function hasSession(sessionId: string): boolean {
  // Clean up expired sessions opportunistically
  getDb().prepare("DELETE FROM sessions WHERE expiresAt < ?").run(new Date().toISOString());
  const row = getDb().prepare("SELECT id FROM sessions WHERE id = ?").get(sessionId);
  return !!row;
}

export function deleteSession(sessionId: string): void {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}
