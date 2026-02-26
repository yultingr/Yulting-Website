import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development, design, and technology.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Thoughts on software development, design, and technology.
        </p>

        {posts.length === 0 ? (
          <p className="mt-8 text-neutral-500">No posts yet. Check back soon!</p>
        ) : (
          <div className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
            {posts.map((post) => (
              <article key={post.slug} className="py-6">
                <Link href={`/blog/${post.slug}`} className="group">
                  <time className="text-sm text-neutral-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
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
