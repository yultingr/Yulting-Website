import { siteConfig } from "@/lib/config";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yulting Rinpoche",
    url: siteConfig.url,
    jobTitle: "Buddhist Scholar, Translator & Educator",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.monastery,
    },
    knowsLanguage: ["English", "Tibetan"],
    sameAs: [siteConfig.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yulting Rinpoche",
    url: siteConfig.url,
    description: "Personal website of Yulting Rinpoche — educator, translator, and Buddhist scholar.",
    inLanguage: ["en", "bo", "zh", "ne", "hi"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  date,
  slug,
  locale,
  readingTime,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
  locale: string;
  readingTime: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    author: {
      "@type": "Person",
      name: "Yulting Rinpoche",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: "Yulting Rinpoche",
    },
    url: `${siteConfig.url}/${locale}/blog/${slug}`,
    inLanguage: locale,
    timeRequired: readingTime,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
