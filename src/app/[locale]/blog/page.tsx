import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllPosts } from "@/lib/blog";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale);

  return (
    <section className="py-24">
      <Container>
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Blog
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-border bg-muted p-12 text-center">
            <p className="text-muted-foreground">{t("noPosts")}</p>
          </div>
        ) : (
          <div className="mt-16 space-y-6">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Date and reading time */}
                      <div className="flex items-center gap-3">
                        <time className="text-sm text-muted-foreground">
                          {new Date(post.date).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {post.readingTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-foreground/80">
                        {post.title}
                      </h2>

                      {/* Summary */}
                      <p className="line-clamp-2 text-muted-foreground">
                        {post.summary}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Read more indicator */}
                    <span className="hidden shrink-0 self-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:inline-flex sm:items-center sm:gap-1">
                      {t("readMore")}
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
