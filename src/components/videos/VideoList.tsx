"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Video } from "@/data/videos";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

interface VideoListProps {
  videos: Video[];
}

function groupByCategory(videos: Video[]): { category: string; videos: Video[] }[] {
  const map = new Map<string, Video[]>();
  for (const v of videos) {
    const cat = v.category || "Other";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(v);
  }
  return Array.from(map.entries()).map(([category, videos]) => ({ category, videos }));
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded bg-accent/20 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function VideoList({ videos }: VideoListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const t = useTranslations("videos");

  const togglePlay = (id: string) =>
    setPlayingVideos((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const filteredVideos = searchQuery.trim()
    ? videos.filter((v) => {
        const q = searchQuery.toLowerCase();
        return (
          (v.title?.toLowerCase().includes(q)) ||
          (v.category?.toLowerCase().includes(q))
        );
      })
    : videos;

  const groups = groupByCategory(filteredVideos);

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-14">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Video groups */}
      {filteredVideos.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? t("noResults") : "No videos available yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {groups.map((group) => (
            <AnimateOnScroll key={group.category}>
              <div>
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                  {highlightMatch(group.category, searchQuery)}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.videos.map((video) => (
                    <div
                      key={video.id}
                      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
                    >
                      <div className="relative aspect-video w-full">
                        {playingVideos.has(video.id) ? (
                          video.platform === "youtube" ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
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
                          )
                        ) : (
                          <button
                            onClick={() => togglePlay(video.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black"
                            aria-label={`Play ${video.title || "video"}`}
                          >
                            {video.platform === "youtube" ? (
                              <img
                                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                alt={video.title || "Video thumbnail"}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-muted" />
                            )}
                            {/* Play button overlay */}
                            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg transition-transform hover:scale-110">
                              <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </button>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold leading-snug text-card-foreground">
                          {highlightMatch(video.title || "", searchQuery)}
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
    </>
  );
}
