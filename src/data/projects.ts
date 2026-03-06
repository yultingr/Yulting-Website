import type { Project } from "@/types";
import { getProjects } from "@/lib/db";

export function loadProjects(): Project[] {
  return getProjects();
}

// Keep a static fallback for build-time
export const projects: Project[] = [
  {
    id: "1",
    title: "Personal Website",
    description:
      "My personal website and blog built with Next.js, TypeScript, Tailwind CSS, and MDX.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    liveUrl: "/",
    featured: true,
    year: 2026,
  },
];
