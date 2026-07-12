import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllPostSlugs, getAdjacentPosts } from "@/lib/blog";
import { Container } from "@/components/layout/Container";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogPostJsonLd } from "@/components/seo/JsonLd";
import { useMDXComponents } from "../../../../../mdx-components";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { KnotSeal } from "@/components/ui/TibetanDivider";

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
    if (!post.published) return {};
    return {
      title: post.title,
      description: post.summary,
      alternates: localeAlternates(locale, `/blog/${slug}`),
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

  // Unpublished drafts are not publicly accessible
  if (!post.published) {
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
      <section className="py-16">
        <Container>
          <Breadcrumbs items={[
            { labelKey: "blog", href: "/blog" },
            { label: post.title },
          ]} />
          <article className="mx-auto max-w-[68ch]">
            <header className="mb-10">
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
            {/* Seal — the knot as a signature at the end of the writing */}
            <div className="mt-14 flex justify-center" aria-hidden="true">
              <KnotSeal className="text-accent/60" size={32} />
            </div>
            <ShareButtons title={post.title} slug={slug} locale={locale} />
            <p className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              {t("writeToMe")}{" "}
              <Link href="/contact" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
                {t("writeToMeLink")}
              </Link>
            </p>
          </article>
          <BlogPostJsonLd
            title={post.title}
            description={post.summary}
            date={post.date}
            slug={slug}
            locale={locale}
            readingTime={post.readingTime}
          />
          {/* Previous / Next Navigation */}
          {(prev || next) && (
            <nav
              className="mx-auto mt-16 grid max-w-[68ch] gap-4 border-t border-border pt-8 sm:grid-cols-2"
              aria-label="Blog post navigation"
            >
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="group block">
                  <span className="font-serif small-caps text-sm text-muted-foreground">
                    {t("prevPost")}
                  </span>
                  <p className="mt-1 font-serif text-lg text-foreground transition-colors group-hover:text-accent">
                    {prev.title}
                  </p>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={`/blog/${next.slug}`} className="group block text-right">
                  <span className="font-serif small-caps text-sm text-muted-foreground">
                    {t("nextPost")}
                  </span>
                  <p className="mt-1 font-serif text-lg text-foreground transition-colors group-hover:text-accent">
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
