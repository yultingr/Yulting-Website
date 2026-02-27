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
    <section className="py-20 md:py-28">
      <Container>
        {/* ── Hero / Bio ────────────────────────────────── */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("pageTitle")}
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-8 text-muted-foreground">
            <p>{t("bio1")}</p>
            <p>{t("bio2")}</p>
          </div>
        </div>

        {/* ── Work Experience ───────────────────────────── */}
        <div className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("workExperience")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("workExperience")}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Job 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {t("job1Title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("job1Place")} &middot; {t("job1Period")}
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t("job1Detail1")}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t("job1Detail2")}
                </li>
              </ul>
            </div>

            {/* Job 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {t("job2Title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("job2Place")} &middot; {t("job2Period")}
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t("job2Detail1")}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t("job2Detail2")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── International Engagements ─────────────────── */}
        <div className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("internationalEngagements")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("internationalEngagements")}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-card-foreground">
                {t("engagement1Title")}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("engagement1Desc")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-card-foreground">
                {t("engagement2Title")}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("engagement2Desc")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-card-foreground">
                {t("engagement3Title")}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("engagement3Desc")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Education ─────────────────────────────────── */}
        <div className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("educationTitle")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("educationTitle")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t("educationInstitution")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["cert1Name", "cert1Desc"],
                ["cert2Name", "cert2Desc"],
                ["cert3Name", "cert3Desc"],
                ["cert4Name", "cert4Desc"],
                ["cert5Name", "cert5Desc"],
                ["cert6Name", "cert6Desc"],
                ["cert7Name", "cert7Desc"],
              ] as const
            ).map(([nameKey, descKey]) => (
              <div
                key={nameKey}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-card-foreground">
                  {t(nameKey)}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t(descKey)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-muted px-5 py-4">
            <p className="text-sm font-medium text-foreground">
              {t("currentStudy")}
            </p>
          </div>
        </div>

        {/* ── Skills ────────────────────────────────────── */}
        <div className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("skillsTitle")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("skillsTitle")}
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {/* Languages */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {t("skillLanguages")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-sm font-medium text-accent">
                  {t("skillTibetan")}
                </span>
                <span className="inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-sm font-medium text-accent">
                  {t("skillEnglish")}
                </span>
              </div>
            </div>

            {/* Technology */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {t("skillTechnology")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillWord")}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillPowerPoint")}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillExcel")}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillInDesign")}
                </span>
              </div>
            </div>

            {/* Translation */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {t("skillTranslation")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-sm font-medium text-accent">
                  {t("skillEngTib")}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillEduContexts")}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                  {t("skillSciContexts")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Other Contributions ───────────────────────── */}
        <div className="mt-20 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("otherContributions")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("otherContributions")}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm leading-6 text-card-foreground">
                {t("contribution1")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm leading-6 text-card-foreground">
                {t("contribution2")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
