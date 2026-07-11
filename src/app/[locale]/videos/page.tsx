import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VideoList } from "@/components/videos/VideoList";
import { getVideos as getVideosFromDb } from "@/lib/db";
import { type Video } from "@/data/videos";
import fallbackVideos from "../../../../data/videos.json";

interface Props {
  params: Promise<{ locale: string }>;
}

function getVideos(): Video[] {
  try {
    return getVideosFromDb();
  } catch {
    // Read-only serverless filesystems can't open SQLite; use the
    // committed snapshot so the page still renders
    return fallbackVideos as Video[];
  }
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
  const videos = getVideos();

  return (
    <section className="py-20">
      <Container>
        <Breadcrumbs items={[{ labelKey: "videos" }]} />
        {/* Section header */}
        <AnimateOnScroll>
          <div className="mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("subtitle")}
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("pageTitle")}
            </h1>
          </div>
        </AnimateOnScroll>

        <VideoList videos={videos} />
      </Container>
    </section>
  );
}
