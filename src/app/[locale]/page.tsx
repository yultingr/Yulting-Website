import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { TibetanDivider } from "@/components/ui/TibetanDivider";

export default function Home() {
  const t = useTranslations("home");
  const tAbout = useTranslations("about");

  return (
    <>
      {/* Hero Section */}
      <section className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Container>
          <AnimateOnScroll>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-saffron" />
                <span className="text-sm text-muted-foreground">
                  {t("location")}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-maroon sm:text-5xl lg:text-[3.5rem]">
                {t("title")}{" "}
                <span className="text-muted-foreground">
                  {t("subtitle")}
                </span>
              </h1>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("bio")}
              </p>

              <div className="flex gap-4">
                <Link
                  href="/about"
                  className="btn-saffron inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  {t("aboutButton")}
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center rounded-full border border-maroon/30 px-6 py-3 text-sm font-medium text-maroon transition-colors hover:bg-maroon/5"
                >
                  {t("blogButton")}
                </Link>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Tibetan Cloud Divider */}
      <Container>
        <TibetanDivider variant="cloud" />
      </Container>

      {/* Skills / Services Section */}
      <section className="py-20">
        <Container>
          <AnimateOnScroll>
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-saffron">
              {tAbout("skillsTitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Languages Card */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-saffron/40 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {tAbout("skillLanguages")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/10 text-lg">
                  🗣
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillTibetan")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillEnglish")}
                </span>
              </div>
            </div>

            {/* Translation Card */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-saffron/40 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {tAbout("skillTranslation")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/10 text-lg">
                  📝
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillEduContexts")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillSciContexts")}
                </span>
              </div>
            </div>

            {/* Technology Card */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-saffron/40 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {tAbout("skillTechnology")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/10 text-lg">
                  💻
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillWord")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillPowerPoint")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillExcel")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillInDesign")}
                </span>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Education Highlights - Maroon Section */}
      <section className="bg-maroon py-20 text-white">
        <Container>
          <AnimateOnScroll>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-saffron">
              {tAbout("educationTitle")}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {tAbout("educationInstitution")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-6">
              <span className="text-2xl font-bold text-saffron opacity-60">1</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{tAbout("cert1Name")}</h3>
              <p className="mt-2 text-sm text-white/70">{tAbout("cert1Desc")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6">
              <span className="text-2xl font-bold text-saffron opacity-60">2</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{tAbout("cert2Name")}</h3>
              <p className="mt-2 text-sm text-white/70">{tAbout("cert2Desc")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6">
              <span className="text-2xl font-bold text-saffron opacity-60">3</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{tAbout("cert5Name")}</h3>
              <p className="mt-2 text-sm text-white/70">{tAbout("cert5Desc")}</p>
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60">
            {tAbout("currentStudy")}
          </p>

          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-saffron transition-opacity hover:opacity-80"
            >
              {t("educationSeeAll")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Knot Divider */}
      <Container>
        <TibetanDivider variant="knot" />
      </Container>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <AnimateOnScroll>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-muted-foreground">{t("ctaHeading1")}</span>{" "}
              {t("ctaHeading2")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:tulkuyulting@gmail.com"
                className="btn-saffron inline-flex items-center rounded-full px-8 py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {t("ctaEmail")}
              </a>
              <a
                href="https://instagram.com/yultingr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-maroon/30 px-8 py-3.5 text-sm font-medium text-maroon transition-colors hover:bg-maroon/5"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                {t("ctaFollow")}
              </a>
            </div>
          </div>
          </AnimateOnScroll>
        </Container>
      </section>
    </>
  );
}
