import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { TibetanDivider } from "@/components/ui/TibetanDivider";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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
        <Breadcrumbs items={[{ labelKey: "about" }]} />

        {/* ── Introduction ────────────────────────────── */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("pageTitle")}
            </h1>
            <div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
            </div>
          </div>
        </AnimateOnScroll>

        <Container>
          <TibetanDivider variant="simple" />
        </Container>

        {/* ── Studies ─────────────────────────────────── */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("studiesTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              <p>{t("studiesText1")}</p>
              <p>{t("studiesText2")}</p>
            </div>
          </div>
        </AnimateOnScroll>

        <Container>
          <TibetanDivider variant="simple" />
        </Container>

        {/* ── Teaching & Translation ──────────────────── */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("teachingTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              <p>{t("teachingText1")}</p>
              <p>{t("teachingText2")}</p>
            </div>
          </div>
        </AnimateOnScroll>

        <Container>
          <TibetanDivider variant="simple" />
        </Container>

        {/* ── Wider Engagements ───────────────────────── */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("engagementsTitle")}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              <p>{t("engagementsText1")}</p>
              <p>{t("engagementsText2")}</p>
            </div>
          </div>
        </AnimateOnScroll>

      </Container>
    </section>
  );
}
