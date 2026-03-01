import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

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
        <AnimateOnScroll>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("pageTitle")}
            </h1>
            <div className="mt-8 space-y-5 text-lg leading-8 text-muted-foreground">
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* ── Work Experience ───────────────────────────── */}
        <AnimateOnScroll>
          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("workExperience")}
            </h2>

            <Timeline>
              <TimelineItem
                year="2022"
                title={t("job1Title")}
                subtitle={`${t("job1Place")} \u00B7 ${t("job1Period")}`}
              >
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                    {t("job1Detail1")}
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                    {t("job1Detail2")}
                  </li>
                </ul>
              </TimelineItem>

              <TimelineItem
                year="2017"
                title={t("job2Title")}
                subtitle={`${t("job2Place")} \u00B7 ${t("job2Period")}`}
              >
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                    {t("job2Detail1")}
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                    {t("job2Detail2")}
                  </li>
                </ul>
              </TimelineItem>
            </Timeline>
          </div>
        </AnimateOnScroll>

        {/* ── International Engagements ─────────────────── */}
        <AnimateOnScroll>
          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("internationalEngagements")}
            </h2>

            <Timeline>
              <TimelineItem
                year="2022"
                title={t("engagement1Title")}
              >
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("engagement1Desc")}
                </p>
              </TimelineItem>

              <TimelineItem
                title={t("engagement2Title")}
              >
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("engagement2Desc")}
                </p>
              </TimelineItem>

              <TimelineItem
                title={t("engagement3Title")}
              >
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("engagement3Desc")}
                </p>
              </TimelineItem>
            </Timeline>
          </div>
        </AnimateOnScroll>

        {/* ── Education ─────────────────────────────────── */}
        <AnimateOnScroll>
          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("educationTitle")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              {t("educationInstitution")}
            </p>

            <Timeline>
              {(
                [
                  ["cert1Name", "cert1Desc", "2024"],
                  ["cert2Name", "cert2Desc", "2022"],
                  ["cert3Name", "cert3Desc", "2020"],
                  ["cert4Name", "cert4Desc", "2018"],
                  ["cert5Name", "cert5Desc", "2017"],
                  ["cert6Name", "cert6Desc", "2014"],
                  ["cert7Name", "cert7Desc", "2009"],
                ] as const
              ).map(([nameKey, descKey, year]) => (
                <TimelineItem
                  key={nameKey}
                  year={year}
                  title={t(nameKey)}
                  subtitle={t(descKey)}
                />
              ))}
            </Timeline>

            <div className="mt-6 rounded-2xl bg-muted px-5 py-4">
              <p className="text-sm font-medium text-foreground">
                {t("currentStudy")}
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* ── Skills ────────────────────────────────────── */}
        <AnimateOnScroll>
          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
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
        </AnimateOnScroll>

        {/* ── Other Contributions ───────────────────────── */}
        <AnimateOnScroll>
          <div className="mt-20 mb-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
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
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
