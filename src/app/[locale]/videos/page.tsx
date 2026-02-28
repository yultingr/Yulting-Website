import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import { Container } from "@/components/layout/Container";
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
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">No videos available yet.</p>
          </div>
        ) : (
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
                      title={video.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <iframe
                      src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoId)}&show_text=false`}
                      title={video.title || "Video"}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  )}
                </div>

                {/* Video title */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
