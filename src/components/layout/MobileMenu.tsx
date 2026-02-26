"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const navKeys = [
  { key: "about", href: "/about" as const },
  { key: "projects", href: "/projects" as const },
  { key: "blog", href: "/blog" as const },
  { key: "contact", href: "/contact" as const },
];

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="border-b border-neutral-200 bg-white px-4 pb-4 dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
      <nav className="flex flex-col gap-2">
        {navKeys.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === link.href
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
            }`}
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
