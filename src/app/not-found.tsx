import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Go back home
        </Link>
      </Container>
    </section>
  );
}
