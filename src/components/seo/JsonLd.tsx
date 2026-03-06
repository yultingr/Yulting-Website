export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yulting Rinpoche",
    url: "https://yulting.dev",
    jobTitle: "Buddhist Scholar, Translator & Educator",
    worksFor: {
      "@type": "Organization",
      name: "Gaden Shartse Monastery",
    },
    knowsLanguage: ["English", "Tibetan"],
    sameAs: ["https://instagram.com/yultingr"],
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
    url: "https://yulting.dev",
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
  readingTime,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
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
      url: "https://yulting.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Yulting Rinpoche",
    },
    url: `https://yulting.dev/en/blog/${slug}`,
    timeRequired: readingTime,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
