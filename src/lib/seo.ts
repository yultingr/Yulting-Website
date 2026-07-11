import { routing } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a page, given its path without the
 * locale prefix (e.g. "/about", "/blog/hello-world", or "" for the homepage).
 * Relative URLs are resolved against metadataBase from the locale layout.
 */
export function localeAlternates(locale: string, path: string = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}${path}`]),
      ),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}
