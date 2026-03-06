"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { type Video } from "@/data/videos";
import { getVideos, addVideo, deleteVideo, reorderVideos } from "@/lib/actions";

export function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addVideo, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getVideos().then((v) => { setVideos(v); setMounted(true); });
  }, []);

  useEffect(() => {
    if (addState === null && mounted) {
      getVideos().then(setVideos);
    }
  }, [addState, mounted]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteVideo(id);
      setVideos(await getVideos());
    });
  }

  function handleMove(index: number, direction: "up" | "down") {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= videos.length) return;
    const updated = [...videos];
    [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
    setVideos(updated);
    startTransition(async () => {
      await reorderVideos(updated.map((v) => v.id));
    });
  }

  if (!mounted) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      {/* Add Form */}
      <form action={addFormAction} className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Add New Video</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="video-url" className="mb-1 block text-sm font-medium text-card-foreground">Video URL</label>
            <input id="video-url" name="url" type="text" placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label htmlFor="video-title" className="mb-1 block text-sm font-medium text-card-foreground">Title</label>
            <input id="video-title" name="title" type="text" placeholder="Video title..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
          </div>
        </div>
        {addState?.error && <p className="mt-2 text-sm text-red-500">{addState.error}</p>}
        <button type="submit" disabled={addPending} className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
          {addPending ? "Adding..." : "Add Video"}
        </button>
      </form>

      {/* Video List */}
      <h3 className="mb-4 text-lg font-semibold text-foreground">Videos ({videos.length})</h3>
      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No videos yet.</div>
      ) : (
        <div className="space-y-3">
          {videos.map((video, i) => (
            <div key={video.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30" title="Move up">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <button onClick={() => handleMove(i, "down")} disabled={i === videos.length - 1} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30" title="Move down">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">{video.title}</p>
                <p className="text-xs text-muted-foreground">{video.platform === "youtube" ? "YouTube" : "Facebook"} &middot; {video.videoId.slice(0, 20)}</p>
              </div>
              <button onClick={() => handleDelete(video.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
