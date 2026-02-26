import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          {t("intro")}
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("emailLabel")}
            </h2>
            <a
              href="mailto:tulkuyulting@gmail.com"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              tulkuyulting@gmail.com
            </a>
          </div>

          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("phoneLabel")}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              +91 9738414606
            </p>
          </div>

          <div>
            <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("locationLabel")}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("locationValue")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
