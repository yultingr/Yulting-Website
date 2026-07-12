import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: ({ src, alt, ...props }) => (
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={450}
        className="my-6 rounded-lg"
        style={{ width: "100%", height: "auto" }}
        {...props}
      />
    ),
    h1: ({ children }) => (
      <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-10 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-8 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-5 text-lg leading-8 text-foreground/85">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-lg leading-8 text-foreground/85">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent/40 pl-5 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-[#1c1917] p-4 text-sm text-[#e7e5e4]">
        {children}
      </pre>
    ),
    ...components,
  };
}
