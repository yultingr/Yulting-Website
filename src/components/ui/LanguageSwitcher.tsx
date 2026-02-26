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
    <select
      value={locale}
      onChange={handleChange}
      aria-label={t("label")}
      className="rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:focus:ring-neutral-600"
    >
      {Object.entries(localeNames).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
