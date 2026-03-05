import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { SetHtmlLang } from "@/components/ui/SetHtmlLang";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL("https://yultingrinpoche.com"),
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("siteDescription"),
    alternates: {
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      title: t("siteName"),
      description: t("siteDescription"),
      url: "https://yultingrinpoche.com",
      siteName: t("siteName"),
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("siteDescription"),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SetHtmlLang locale={locale} />
        <div className="flex min-h-screen flex-col">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Yulting Rinpoche",
                url: "https://yultingrinpoche.com",
                jobTitle: "Buddhist Scholar, Educator, Translator",
                worksFor: {
                  "@type": "Organization",
                  name: "Gaden Shartse Monastery",
                },
                sameAs: ["https://instagram.com/yultingr"],
              }),
            }}
          />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
