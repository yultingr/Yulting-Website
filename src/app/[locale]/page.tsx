import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { TibetanDivider } from "@/components/ui/TibetanDivider";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import { getAllPosts } from "@/lib/blog";
import { getPublicVideos } from "@/lib/public-videos";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const latestPost = getAllPosts(locale)[0] ?? null;
  const featuredVideo = getPublicVideos()[0] ?? null;

  return (
    <>
      {/* Hero Section */}
      <section className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              {t("location")}
            </p>

            {locale === "bo" ? (
              <p className="mt-6 font-serif text-lg text-muted-foreground">
                {siteConfig.name}
              </p>
            ) : (
              <p
                lang="bo"
                className="mt-6 font-tibetan text-xl leading-relaxed text-muted-foreground"
              >
                {siteConfig.tibetanName}
              </p>
            )}

            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {t("title")}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>

            <p className="mt-8 leading-relaxed text-muted-foreground">
              {t("bio")}
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <ButtonLink href="/about" variant="secondary">
                {t("aboutButton")}
              </ButtonLink>
              <ButtonLink href="/blog" variant="secondary">
                {t("blogButton")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Tibetan Cloud Divider */}
      <Container>
        <TibetanDivider variant="cloud" />
      </Container>

      {/* Welcome Section */}
      <section className="py-16 sm:py-20">
        <Container>
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
        </Container>
      </section>

      {/* Knot Divider */}
      <Container>
        <TibetanDivider variant="knot" />
      </Container>

      {/* Recent offerings */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {featuredVideo && (
              <Link
                href="/videos"
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {t("fromTeachings")}
                </span>
                <p className="mt-3 font-serif text-lg leading-snug text-card-foreground transition-colors group-hover:text-accent">
                  {featuredVideo.title}
                </p>
                {featuredVideo.category && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {featuredVideo.category}
                  </p>
                )}
              </Link>
            )}
            {latestPost && (
              <Link
                href={`/blog/${latestPost.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {t("fromWritings")}
                </span>
                <p className="mt-3 font-serif text-lg leading-snug text-card-foreground transition-colors group-hover:text-accent">
                  {latestPost.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {latestPost.summary}
                </p>
              </Link>
            )}
          </div>

          <div className="mt-16 text-center">
            <p className="mx-auto max-w-md text-muted-foreground">
              {t("ctaText")}
            </p>
            <div className="mt-6">
              <ButtonAnchor href={`mailto:${siteConfig.email}`} variant="primary">
                {t("ctaEmail")}
              </ButtonAnchor>
            </div>
          </div>
        </Container>
      </section>

      <PersonJsonLd />
    </>
  );
}
