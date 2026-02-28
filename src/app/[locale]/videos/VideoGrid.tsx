"use client";

import { useState, useEffect } from "react";
import { type Video, getStoredVideos } from "@/data/videos";

export function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVideos(getStoredVideos());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-8 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">No videos available yet.</p>
      </div>
    );
  }

  return (
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
                title={video.title || video.titleKey || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoId)}&show_text=false`}
                title={video.title || video.titleKey || "Video"}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            )}
          </div>

          {/* Video title */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-card-foreground">
              {video.title || video.titleKey}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
