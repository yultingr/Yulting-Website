import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of my projects and work.",
};

export default function ProjectsPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Things I&apos;ve built and worked on.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-lg border border-neutral-200 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs dark:bg-neutral-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Live Demo
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    GitHub
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
