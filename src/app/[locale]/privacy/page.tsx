import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

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

          {/* Section 1: Information We Collect */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s1Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s1p1")}</p>
              <p>{t("s1p2")}</p>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s2Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s2p1")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s2l1")}</li>
                <li>{t("s2l2")}</li>
                <li>{t("s2l3")}</li>
                <li>{t("s2l4")}</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Information We Share */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s3Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s3p1")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s3l1")}</li>
                <li>{t("s3l2")}</li>
                <li>{t("s3l3")}</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Cookies and Local Storage */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s4Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s4p1")}</p>
              <p>{t("s4p2")}</p>
            </div>
          </div>

          {/* Section 5: Your Rights */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s5Title")}
            </h2>
            <div className="mt-3 space-y-3">
              <p>{t("s5p1")}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>{t("s5l1")}</li>
                <li>{t("s5l2")}</li>
                <li>{t("s5l3")}</li>
                <li>{t("s5l4")}</li>
              </ul>
              <p>{t("s5p2")}</p>
            </div>
          </div>

          {/* Section 6: Security */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s6Title")}
            </h2>
            <div className="mt-3">
              <p>{t("s6p1")}</p>
            </div>
          </div>

          {/* Section 7: Third-Party Links */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s7Title")}
            </h2>
            <div className="mt-3">
              <p>{t("s7p1")}</p>
            </div>
          </div>

          {/* Section 8: Changes to This Policy */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s8Title")}
            </h2>
            <div className="mt-3">
              <p>{t("s8p1")}</p>
            </div>
          </div>

          {/* Section 9: Contact Us */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("s9Title")}
            </h2>
            <div className="mt-3 space-y-1">
              <p>{t("s9p1")}</p>
              <p>{t("s9email")}</p>
              <p>{t("s9location")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
