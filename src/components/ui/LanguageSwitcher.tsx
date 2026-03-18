"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const localeNames: Record<string, string> = {
  en: "English",
  bo: "བོད་སྐད",
  zh: "中文",
  ne: "नेपाली",
  hi: "हिन्दी",
};

const localeShort: Record<string, string> = {
  en: "EN",
  bo: "བོད",
  zh: "中",
  ne: "ने",
  hi: "हि",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <>
      {/* Desktop: full names */}
      <select
        value={locale}
        onChange={handleChange}
        aria-label={t("label")}
        className="hidden rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 md:inline-block"
      >
        {Object.entries(localeNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      {/* Mobile: short codes */}
      <select
        value={locale}
        onChange={handleChange}
        aria-label={t("label")}
        className="inline-block rounded-lg border border-border bg-transparent px-1.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 md:hidden"
      >
        {Object.entries(localeShort).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}
