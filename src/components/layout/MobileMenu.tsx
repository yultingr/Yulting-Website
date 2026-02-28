"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const navKeys = [
  { key: "about", href: "/about" as const },
  { key: "projects", href: "/projects" as const },
  { key: "blog", href: "/blog" as const },
  { key: "videos", href: "/videos" as const },
  { key: "contact", href: "/contact" as const },
];

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="border-b border-border bg-background px-5 pb-6 pt-2 md:hidden">
      <nav className="flex flex-col gap-1">
        {navKeys.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`rounded-lg px-4 py-3 text-[15px] transition-colors ${
              pathname === link.href
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
