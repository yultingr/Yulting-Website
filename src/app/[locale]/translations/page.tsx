import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TibetanDivider } from "@/components/ui/TibetanDivider";
import { ButtonLink } from "@/components/ui/Button";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "translations" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/translations"),
  };
}

export default async function TranslationsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "translations" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <section className="py-20">
      <Container>
        <Breadcrumbs items={[{ labelKey: "translations" }]} />
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {t("subtitle")}
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>

          <p className="mt-10 leading-relaxed text-muted-foreground">
            {t("intro1")}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {t("intro2")}
          </p>

          <TibetanDivider variant="knot" />

          <p className="text-muted-foreground">{t("cta")}</p>
          <div className="mt-6">
            <ButtonLink href="/contact" variant="secondary">
              {tNav("contact")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
