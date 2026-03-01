"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <footer className="bg-foreground text-background">
      <Container>
        <div className="py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-bold">{tCommon("siteName")}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-60">
                {tCommon("siteDescription")}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-40">
                Pages
              </h4>
              <nav className="mt-4 flex flex-col gap-3">
                <Link href="/about" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {tNav("about")}
                </Link>
                <Link href="/projects" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {tNav("projects")}
                </Link>
                <Link href="/blog" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {tNav("blog")}
                </Link>
                <Link href="/videos" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {tNav("videos")}
                </Link>
                <Link href="/contact" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {tNav("contact")}
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-40">
                Contact
              </h4>
              <nav className="mt-4 flex flex-col gap-3">
                <a
                  href="mailto:tulkuyulting@gmail.com"
                  className="inline-flex items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {t("email")}
                </a>
                <a
                  href="https://instagram.com/yultingr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="/feed.xml"
                  className="inline-flex items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                  {t("subscribe")}
                </a>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-40">
                Legal
              </h4>
              <nav className="mt-4 flex flex-col gap-3">
                <Link href="/terms" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {t("terms")}
                </Link>
                <Link href="/privacy" className="text-sm opacity-60 transition-opacity hover:opacity-100">
                  {t("privacy")}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 py-6">
          <p className="text-sm opacity-40">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
}
