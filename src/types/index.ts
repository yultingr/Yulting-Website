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
  name: string;
  skills: string[];
}
