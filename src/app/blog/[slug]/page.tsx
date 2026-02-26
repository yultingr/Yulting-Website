import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { Container } from "@/components/layout/Container";
import { useMDXComponents } from "../../../../mdx-components";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.summary,
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
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

  return (
    <section className="py-16">
      <Container>
        <article>
          <header className="mb-8">
            <time className="text-sm text-neutral-500">
              {new Date(post.date).toLocaleDateString("en-US", {
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
