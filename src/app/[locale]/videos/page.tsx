import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import { Container } from "@/components/layout/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
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

/** Group videos by category, preserving insertion order. */
function groupByCategory(videos: Video[]): { category: string; videos: Video[] }[] {
  const map = new Map<string, Video[]>();
  for (const v of videos) {
    const cat = v.category || "Other";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(v);
  }
  return Array.from(map.entries()).map(([category, videos]) => ({ category, videos }));
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
  const groups = groupByCategory(videos);

  return (
    <section className="py-20">
      <Container>
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

        {/* Video groups */}
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">No videos available yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {groups.map((group) => (
              <AnimateOnScroll key={group.category}>
              <div>
                {/* Playlist heading */}
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                  {group.category}
                </h2>

                {/* Video grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.videos.map((video) => (
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
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        ) : (
                          <iframe
                            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoId)}&show_text=false`}
                            title={video.title || "Video"}
                            loading="lazy"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        )}
                      </div>

                      {/* Video title */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold leading-snug text-card-foreground">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
