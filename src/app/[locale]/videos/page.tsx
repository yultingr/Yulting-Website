import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VideoList } from "@/components/videos/VideoList";
import { type Video } from "@/data/videos";

interface Props {
  params: Promise<{ locale: string }>;
}

function getVideos(): Video[] {
  try {
    const raw = readFileSync(
      join(process.cwd(), "data", "videos.json"),
      "utf-8",
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
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
