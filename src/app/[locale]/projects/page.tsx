import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

const projectData = [
  {
    titleKey: "project1Title",
    descKey: "project1Desc",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    liveUrl: "/",
  },
  {
    titleKey: "project2Title",
    descKey: "project2Desc",
    technologies: ["React", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com",
  },
];

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t("subtitle")}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projectData.map((project) => (
            <article
              key={project.titleKey}
              className="rounded-lg border border-neutral-200 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <h3 className="text-lg font-semibold">{t(project.titleKey)}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {t(project.descKey)}
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
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {t("liveDemo")}
                  </Link>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {t("github")}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
