import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8 dark:border-neutral-800">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Tulku Lobsang Khenrab. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:tulkuyulting@gmail.com"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
