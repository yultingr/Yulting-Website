import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

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

const projectData: {
  titleKey: string;
  descKey: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  gradient: string;
}[] = [
  {
    titleKey: "project1Title",
    descKey: "project1Desc",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    liveUrl: "/",
    gradient: "from-rose-500/20 via-amber-500/10 to-violet-500/20",
  },
];

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <AnimateOnScroll>
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("subtitle")}
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
        </div>
        </AnimateOnScroll>

        {/* 2-column project grid */}
        <AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2">
          {projectData.map((project) => (
            <article
              key={project.titleKey}
              className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Gradient background area */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} bg-muted transition-opacity duration-300 group-hover:opacity-80`}
              />

              {/* Decorative dots pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />

              {/* Bottom content overlay */}
              <div className="relative z-10 mt-auto space-y-3 bg-gradient-to-t from-background/90 via-background/60 to-transparent p-6 pt-16">
                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(project.descKey)}
                </p>

                {/* Project title */}
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                  {t(project.titleKey)}
                </h3>

                {/* Technology pills */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-card-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link pills */}
                <div className="flex gap-3 pt-1">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("liveDemo")}
                    </Link>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("github")}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
