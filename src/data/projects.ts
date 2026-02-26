import type { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "Personal Website",
    description:
      "My personal website and blog built with Next.js, TypeScript, Tailwind CSS, and MDX.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    liveUrl: "/",
    featured: true,
    year: 2026,
  },
  {
    title: "Example Project",
    description:
      "A sample project to showcase. Replace this with your real projects.",
    technologies: ["React", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com",
    featured: false,
    year: 2025,
  },
];
