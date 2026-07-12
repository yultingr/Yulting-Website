import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { TibetanDivider, KnotSeal } from "@/components/ui/TibetanDivider";
import { ButtonAnchor } from "@/components/ui/Button";
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
      {/* Hero — composed like the title page of a book */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pb-28 sm:pt-28">
        {/* Knot watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
        >
          <KnotSeal className="text-foreground" size={560} />
        </div>

        <Container>
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="font-serif small-caps text-base text-accent">
              {t("location")}
            </p>

            <div aria-hidden="true" className="mx-auto mt-6 h-px w-16 bg-border" />

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

            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>

            <p className="mt-5 font-serif text-xl italic text-muted-foreground">
              {t("subtitle")}
            </p>

            <div aria-hidden="true" className="mx-auto mt-8 h-px w-16 bg-border" />

            <p className="mt-8 leading-relaxed text-muted-foreground">
              {t("bio")}
            </p>

            <p className="mt-10">
              <Link
                href="/blog"
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {t("heroLink")} →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* Knot Divider */}
      <Container>
        <TibetanDivider />
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
        <TibetanDivider />
      </Container>

      {/* Recent offerings — a short table of contents */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            {featuredVideo && (
              <Link
                href="/videos"
                className="group block border-t border-border py-8"
              >
                <span className="font-serif small-caps text-sm text-accent">
                  {t("fromTeachings")}
                </span>
                <p className="mt-2 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-accent">
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
                className="group block border-y border-border py-8"
              >
                <span className="font-serif small-caps text-sm text-accent">
                  {t("fromWritings")}
                </span>
                <p className="mt-2 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-accent">
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
