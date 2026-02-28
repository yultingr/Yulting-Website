"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import {
  type Video,
  getStoredVideos,
  saveVideos,
  parseVideoUrl,
} from "@/data/videos";

export default function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVideos(getStoredVideos());
    setMounted(true);
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a video URL.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    const parsed = parseVideoUrl(url);
    if (!parsed) {
      setError("Invalid URL. Please enter a YouTube or Facebook video URL.");
      return;
    }

    const newVideo: Video = {
      id: Date.now().toString(),
      platform: parsed.platform,
      videoId: parsed.videoId,
      title: title.trim(),
    };

    const updated = [...videos, newVideo];
    setVideos(updated);
    saveVideos(updated);
    setUrl("");
    setTitle("");
  }

  function handleDelete(id: string) {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveVideos(updated);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...videos];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setVideos(updated);
    saveVideos(updated);
  }

  function handleMoveDown(index: number) {
    if (index === videos.length - 1) return;
    const updated = [...videos];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setVideos(updated);
    saveVideos(updated);
  }

  if (!mounted) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center text-muted-foreground">Loading...</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Manage Videos
          </h1>
          <p className="mt-3 text-muted-foreground">
            Add, remove, and reorder videos. Changes are saved automatically and appear on the Videos page.
          </p>
        </div>

        {/* Add Video Form */}
        <form
          onSubmit={handleAdd}
          className="mb-12 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Add New Video
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="video-url"
                className="mb-2 block text-sm font-medium text-card-foreground"
              >
                Video URL
              </label>
              <input
                id="video-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Supports YouTube and Facebook video URLs
              </p>
            </div>

            <div>
              <label
                htmlFor="video-title"
                className="mb-2 block text-sm font-medium text-card-foreground"
              >
                Title
              </label>
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Add Video
          </button>
        </form>

        {/* Video List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Videos ({videos.length})
          </h2>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">
              No videos yet. Add one using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all"
              >
                {/* Video preview */}
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

                {/* Video info + actions */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-card-foreground">
                      {video.title || video.titleKey}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {video.platform === "youtube" ? "YouTube" : "Facebook"} &middot; {video.videoId.slice(0, 20)}{video.videoId.length > 20 ? "..." : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {/* Move up */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                      title="Move up"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === videos.length - 1}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                      title="Move down"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      title="Delete video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
