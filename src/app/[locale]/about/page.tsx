import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <div className="mt-8 space-y-6 text-neutral-700 leading-7 dark:text-neutral-300">
          <p>{t("bio1")}</p>
          <p>{t("bio2")}</p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          {t("workExperience")}
        </h2>
        <div className="mt-6 space-y-8">
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">{t("job1Title")}</h3>
            <p className="text-sm text-neutral-500">
              {t("job1Place")} &middot; {t("job1Period")}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>{t("job1Detail1")}</li>
              <li>{t("job1Detail2")}</li>
            </ul>
          </div>

          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">{t("job2Title")}</h3>
            <p className="text-sm text-neutral-500">
              {t("job2Place")} &middot; {t("job2Period")}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>{t("job2Detail1")}</li>
              <li>{t("job2Detail2")}</li>
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          {t("internationalEngagements")}
        </h2>
        <div className="mt-6 space-y-6">
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">{t("engagement1Title")}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {t("engagement1Desc")}
            </p>
          </div>
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">{t("engagement2Title")}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {t("engagement2Desc")}
            </p>
          </div>
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">{t("engagement3Title")}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {t("engagement3Desc")}
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          {t("educationTitle")}
        </h2>
        <div className="mt-6">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
            {t("educationInstitution")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert1Name")}
              </span>{" "}
              {t("cert1Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert2Name")}
              </span>{" "}
              {t("cert2Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert3Name")}
              </span>{" "}
              {t("cert3Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert4Name")}
              </span>{" "}
              {t("cert4Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert5Name")}
              </span>{" "}
              {t("cert5Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert6Name")}
              </span>{" "}
              {t("cert6Desc")}
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                {t("cert7Name")}
              </span>{" "}
              {t("cert7Desc")}
            </li>
          </ul>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            {t("currentStudy")}
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          {t("skillsTitle")}
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("skillLanguages")}
            </h3>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillTibetan")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillEnglish")}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("skillTechnology")}
            </h3>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillWord")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillPowerPoint")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillExcel")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillInDesign")}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              {t("skillTranslation")}
            </h3>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillEngTib")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillEduContexts")}
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("skillSciContexts")}
              </li>
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          {t("otherContributions")}
        </h2>
        <div className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>{t("contribution1")}</p>
          <p>{t("contribution2")}</p>
        </div>
      </Container>
    </section>
  );
}
