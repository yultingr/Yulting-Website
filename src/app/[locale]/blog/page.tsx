import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import { Container } from "@/components/layout/Container";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags ?? [])),
  ).sort();

  return (
    <section className="py-24">
      <Container>
        <Breadcrumbs items={[{ labelKey: "blog" }]} />
        {/* Section header */}
        <AnimateOnScroll>
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
        </AnimateOnScroll>

        <BlogPostList posts={posts} allTags={allTags} locale={locale} />
      </Container>
    </section>
  );
}
