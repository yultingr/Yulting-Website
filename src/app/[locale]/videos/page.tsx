import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VideoList } from "@/components/videos/VideoList";
import { getPublicVideos } from "@/lib/public-videos";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/videos"),
  };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });
  const videos = getPublicVideos();

  return (
    <section className="py-20">
      <Container>
        <Breadcrumbs items={[{ labelKey: "videos" }]} />
        <div className="mb-14">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {t("subtitle")}
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
        </div>

        <VideoList videos={videos} />
      </Container>
    </section>
  );
}
