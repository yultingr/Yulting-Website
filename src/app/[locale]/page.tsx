import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

export default function Home() {
  const t = useTranslations("home");
  const tAbout = useTranslations("about");

  return (
    <>
      {/* Hero Section */}
      <section className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  Gaden Shartse Monastery
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
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
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
                >
                  {t("aboutButton")}
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {t("blogButton")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Skills / Services Section */}
      <section className="py-20">
        <Container>
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {tAbout("skillsTitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Languages Card */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {tAbout("skillLanguages")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
                  🗣
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tAbout("skillTibetan")} · {tAbout("skillEnglish")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillTibetan")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillEnglish")}
                </span>
              </div>
            </div>

            {/* Translation Card - Highlighted */}
            <div className="group rounded-2xl bg-accent p-8 text-white transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {tAbout("skillTranslation")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg">
                  📝
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {tAbout("skillEngTib")} · {tAbout("skillEduContexts")} · {tAbout("skillSciContexts")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                  {tAbout("skillEduContexts")}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                  {tAbout("skillSciContexts")}
                </span>
              </div>
            </div>

            {/* Technology Card */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {tAbout("skillTechnology")}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
                  💻
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tAbout("skillWord")} · {tAbout("skillPowerPoint")} · {tAbout("skillExcel")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillWord")}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tAbout("skillInDesign")}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Education Highlights - Dark Section */}
      <section className="bg-foreground py-20 text-background">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider opacity-40">
              {tAbout("educationTitle")}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              {tAbout("educationInstitution")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-background/5 p-6 backdrop-blur-sm">
              <span className="text-2xl font-bold opacity-30">1</span>
              <h3 className="mt-3 text-lg font-semibold">{tAbout("cert1Name")}</h3>
              <p className="mt-2 text-sm opacity-60">{tAbout("cert1Desc")}</p>
            </div>
            <div className="rounded-2xl bg-background/5 p-6 backdrop-blur-sm">
              <span className="text-2xl font-bold opacity-30">2</span>
              <h3 className="mt-3 text-lg font-semibold">{tAbout("cert2Name")}</h3>
              <p className="mt-2 text-sm opacity-60">{tAbout("cert2Desc")}</p>
            </div>
            <div className="rounded-2xl bg-background/5 p-6 backdrop-blur-sm">
              <span className="text-2xl font-bold opacity-30">3</span>
              <h3 className="mt-3 text-lg font-semibold">{tAbout("cert5Name")}</h3>
              <p className="mt-2 text-sm opacity-60">{tAbout("cert5Desc")}</p>
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed opacity-60">
            {tAbout("currentStudy")}
          </p>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-muted-foreground">Get in touch,</span>{" "}
              and let&apos;s connect
            </h2>
            <div className="mt-8">
              <a
                href="mailto:tulkuyulting@gmail.com"
                className="inline-flex items-center rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Email Me
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
