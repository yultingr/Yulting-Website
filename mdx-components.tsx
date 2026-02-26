import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-neutral-700 dark:text-neutral-300">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition-colors hover:decoration-blue-600 dark:text-blue-400"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-neutral-700 dark:text-neutral-300">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-neutral-300 pl-4 italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-neutral-950 p-4 text-sm text-neutral-100">
        {children}
      </pre>
    ),
    ...components,
  };
}
