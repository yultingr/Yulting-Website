import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { TibetanDivider } from "@/components/ui/TibetanDivider";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { PersonJsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      {/* Hero Section */}
      <section className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <Container>
          <AnimateOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm tracking-wide text-muted-foreground">
                {t("location")}
              </p>

              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {t("title")}
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                {t("subtitle")}
              </p>

              <p className="mt-8 leading-relaxed text-muted-foreground">
                {t("bio")}
              </p>

              <div className="mt-10 flex justify-center gap-4">
                <ButtonLink href="/about" variant="primary">
                  {t("aboutButton")}
                </ButtonLink>
                <ButtonLink href="/blog" variant="secondary">
                  {t("blogButton")}
                </ButtonLink>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Tibetan Cloud Divider */}
      <Container>
        <TibetanDivider variant="cloud" />
      </Container>

      {/* Welcome Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <AnimateOnScroll delay={100}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("welcomeHeading")}
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {t("welcomeText")}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
              <div className="text-center">
                <h3 className="font-medium">{t("offeringTeachings")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("offeringTeachingsDesc")}
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-medium">{t("offeringTranslations")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("offeringTranslationsDesc")}
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-medium">{t("offeringReflections")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("offeringReflectionsDesc")}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Knot Divider */}
      <Container>
        <TibetanDivider variant="knot" />
      </Container>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <AnimateOnScroll delay={100}>
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("ctaHeading")}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                {t("ctaText")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonAnchor href={`mailto:${siteConfig.email}`} variant="primary">
                  {t("ctaEmail")}
                </ButtonAnchor>
                <ButtonAnchor
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
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
                </ButtonAnchor>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      <PersonJsonLd />
    </>
  );
}
