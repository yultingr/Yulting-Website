import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { Container } from "@/components/layout/Container";
import { useMDXComponents } from "../../../../../mdx-components";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

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

  return (
    <section className="py-16">
      <Container>
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToBlog")}
        </Link>
        <article>
          <header className="mb-8">
            <time className="text-sm text-neutral-500">
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">{post.readingTime}</p>
          </header>
          <div className="prose">
            <MDXContent components={components} />
          </div>
        </article>
      </Container>
    </section>
  );
}
