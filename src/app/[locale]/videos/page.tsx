import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { videos } from "@/data/videos";

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

        {/* Video grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
            >
              {/* Responsive 16:9 video embed */}
              <div className="relative aspect-video w-full">
                {video.platform === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={t(video.titleKey)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoId)}&show_text=false`}
                    title={t(video.titleKey)}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                )}
              </div>

              {/* Video title */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {t(video.titleKey)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
