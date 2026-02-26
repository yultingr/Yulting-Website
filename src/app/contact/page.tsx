import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Yulting Rinpoche.",
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          Feel free to reach out. I&apos;m always open to conversations about
          Buddhist philosophy, translation work, and educational collaborations.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              Email
            </h2>
            <a
              href="mailto:tulkuyulting@gmail.com"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              tulkuyulting@gmail.com
            </a>
          </div>

          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              Phone
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              +91 9738414606
            </p>
          </div>

          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              Location
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Gaden Shartse Monastery, India
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
