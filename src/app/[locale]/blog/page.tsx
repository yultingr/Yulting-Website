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
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t("subtitle")}
        </p>

        {posts.length === 0 ? (
          <p className="mt-8 text-neutral-500">{t("noPosts")}</p>
        ) : (
          <div className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
            {posts.map((post) => (
              <article key={post.slug} className="py-6">
                <Link href={`/blog/${post.slug}`} className="group">
                  <time className="text-sm text-neutral-500">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-1 text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {post.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-neutral-500">
                    <span>{post.readingTime}</span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
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
