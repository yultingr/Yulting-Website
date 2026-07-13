"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/config";

const pageLinks = [
  { key: "about", href: "/about" as const },
  { key: "videos", href: "/videos" as const },
  { key: "blog", href: "/blog" as const },
  { key: "translations", href: "/translations" as const },
  { key: "contact", href: "/contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <footer className="bg-[#2a2320] text-[#ece5dc] dark:bg-[#1a1410] dark:text-[#ece5dc] print:hidden">
      <Container>
        {/* Colophon */}
        <div className="py-14 text-center">
          <p lang="bo" className="font-tibetan-name text-lg leading-relaxed opacity-80">
            {siteConfig.tibetanName}
          </p>
          <h3 className="mt-1 text-xl font-bold">{tCommon("siteName")}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-60">
            {tCommon("siteDescription")}
          </p>

          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm opacity-60 transition-opacity hover:opacity-100"
              >
                {tNav(link.key)}
              </Link>
            ))}
          </nav>

          <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
            >
              {t("email")}
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
            >
              Instagram
            </a>
            <a
              href="/feed.xml"
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
            >
              {t("subscribe")}
            </a>
            <Link
              href="/terms"
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
            >
              {t("privacy")}
            </Link>
          </nav>

          <p className="mt-10 text-sm opacity-60">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
}
