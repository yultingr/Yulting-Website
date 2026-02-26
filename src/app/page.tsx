import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function Home() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Yulting Rinpoche
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          English-Tibetan Translations &amp; Methodology Teacher
        </p>
        <p className="mt-6 max-w-2xl leading-7 text-neutral-700 dark:text-neutral-300">
          A Buddhist scholar, educator, and translator based at Gaden Shartse
          Monastery. Dedicated to the dissemination of Buddhist teachings and the
          integration of contemplative practice with modern science.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/about"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            About Me
          </Link>
          <Link
            href="/blog"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Read Blog
          </Link>
        </div>
      </Container>
    </section>
  );
}
