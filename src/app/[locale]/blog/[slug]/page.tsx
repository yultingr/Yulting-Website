import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllPostSlugs, getAdjacentPosts } from "@/lib/blog";
import { Container } from "@/components/layout/Container";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Comments } from "@/components/blog/Comments";
import { BlogPostJsonLd } from "@/components/seo/JsonLd";
import { useMDXComponents } from "../../../../../mdx-components";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = getPostBySlug(slug, locale);
    return {
      title: post.title,
      description: post.summary,
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug, locale);
  } catch {
    notFound();
  }

  const compiled = await compile(post.content, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  const components = useMDXComponents({});
  const t = await getTranslations({ locale, namespace: "blog" });
  const { prev, next } = getAdjacentPosts(slug, locale);

  return (
    <>
      <ReadingProgress />
      <section className="py-16">
        <Container>
          <Breadcrumbs items={[
            { labelKey: "blog", href: "/blog" },
            { label: post.title },
          ]} />
          <article>
            <header className="mb-8">
              <time className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{post.readingTime}</p>
            </header>
            <div className="prose">
              <MDXContent components={components} />
            </div>
            <ShareButtons title={post.title} slug={slug} />
          </article>
          <Comments postSlug={slug} />
          <BlogPostJsonLd
            title={post.title}
            description={post.summary}
            date={post.date}
            slug={slug}
            readingTime={post.readingTime}
          />
          {/* Previous / Next Navigation */}
          {(prev || next) && (
            <nav className="mt-16 grid gap-4 sm:grid-cols-2" aria-label="Blog post navigation">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <span className="text-xs text-muted-foreground">{t("prevPost")}</span>
                  <p className="mt-1 font-medium text-foreground transition-colors group-hover:text-accent">
                    {prev.title}
                  </p>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 text-right transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <span className="text-xs text-muted-foreground">{t("nextPost")}</span>
                  <p className="mt-1 font-medium text-foreground transition-colors group-hover:text-accent">
                    {next.title}
                  </p>
                </Link>
              ) : <div />}
            </nav>
          )}
        </Container>
      </section>
    </>
  );
}
