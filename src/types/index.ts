export interface BlogPostMeta {
  title: string;
  date: string;
  summary: string;
  slug: string;
  tags?: string[];
  readingTime: string;
  published: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  year: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface PageView {
  path: string;
  timestamp: string;
  referrer?: string;
  userAgent?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniquePaths: number;
  topPages: { path: string; views: number }[];
  viewsByDay: { date: string; views: number }[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}
