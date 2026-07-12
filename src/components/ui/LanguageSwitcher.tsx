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

  const chevron = (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <>
      {/* Desktop: full names, styled as quiet text */}
      <span className="relative hidden md:inline-block">
        <select
          value={locale}
          onChange={handleChange}
          aria-label={t("label")}
          className="appearance-none rounded-sm border-none bg-transparent py-1 pl-1 pr-5 text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {Object.entries(localeNames).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {chevron}
      </span>

      {/* Mobile: short codes */}
      <span className="relative inline-block md:hidden">
        <select
          value={locale}
          onChange={handleChange}
          aria-label={t("label")}
          className="appearance-none rounded-sm border-none bg-transparent py-1 pl-1 pr-4 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {Object.entries(localeShort).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {chevron}
      </span>
    </>
  );
}
