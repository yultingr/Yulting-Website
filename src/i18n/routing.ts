import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bo", "zh", "ne", "hi"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
