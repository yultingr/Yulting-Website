import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { VideoGrid } from "./VideoGrid";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });

  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("subtitle")}
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
        </div>

        {/* Client-side video grid that reads from localStorage */}
        <VideoGrid />
      </Container>
    </section>
  );
}
