"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  labelKey?: string;
  label?: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            {tCommon("siteName")}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.labelKey ? tNav(item.labelKey) : item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">
                {item.labelKey ? tNav(item.labelKey) : item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
