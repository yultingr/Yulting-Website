import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {t("lastUpdated", { date: "2025-01-01" })}
        </p>

        <div className="mt-8 space-y-8 text-neutral-700 leading-7 dark:text-neutral-300">
          <p>{t("intro")}</p>

          {/* Section 1: Cookies */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s1Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s1p1")}</p>
              <p>{t("s1p2")}</p>
            </div>
          </div>

          {/* Section 2: License */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s2Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s2p1")}</p>
              <p>{t("s2p2")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s2l1")}</li>
                <li>{t("s2l2")}</li>
                <li>{t("s2l3")}</li>
                <li>{t("s2l4")}</li>
              </ul>
            </div>
          </div>

          {/* Section 3: User Comments */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s3Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s3p1")}</p>
              <p>{t("s3p2")}</p>
              <p>{t("s3p3")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s3l1")}</li>
                <li>{t("s3l2")}</li>
                <li>{t("s3l3")}</li>
                <li>{t("s3l4")}</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Hyperlinking */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s4Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s4p1")}</p>
              <p>{t("s4p2")}</p>
              <p>{t("s4p3")}</p>
            </div>
          </div>

          {/* Section 5: Content Liability */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s5Title")}
            </h2>
            <div className="mt-3">
              <p>{t("s5p1")}</p>
            </div>
          </div>

          {/* Section 6: Reservation of Rights */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s6Title")}
            </h2>
            <div className="mt-3">
              <p>{t("s6p1")}</p>
            </div>
          </div>

          {/* Section 7: Disclaimer */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s7Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s7p1")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s7l1")}</li>
                <li>{t("s7l2")}</li>
                <li>{t("s7l3")}</li>
              </ul>
              <p>{t("s7p2")}</p>
              <p>{t("s7p3")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
