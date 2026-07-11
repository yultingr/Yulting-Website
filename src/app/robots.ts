import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        // Admin routes are locale-prefixed (/en/admin, /bo/admin, ...)
        ...routing.locales.map((locale) => `/${locale}/admin`),
      ],
    },
    sitemap: "https://yultingrinpoche.com/sitemap.xml",
  };
}
