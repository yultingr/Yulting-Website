"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { Container } from "@/components/layout/Container";
import { type Video } from "@/data/videos";
import {
  login,
  logout,
  isAuthenticated,
  getVideos,
  addVideo,
  deleteVideo,
  reorderVideos,
} from "@/lib/actions";

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="mt-3 text-muted-foreground">
              Enter your password to access the admin panel.
            </p>
          </div>

          <form
            action={formAction}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              placeholder="Enter admin password..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />

            {state?.error && (
              <p className="mt-3 text-sm text-red-500">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Admin dashboard
// ---------------------------------------------------------------------------

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addVideo, null);
  const [, startTransition] = useTransition();

  // Load videos on mount
  useEffect(() => {
    getVideos().then((v) => {
      setVideos(v);
      setMounted(true);
    });
  }, []);

  // Reload videos after successful add (addState becomes null on success)
  useEffect(() => {
    if (addState === null && mounted) {
      getVideos().then(setVideos);
    }
  }, [addState, mounted]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteVideo(id);
      const updated = await getVideos();
      setVideos(updated);
    });
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...videos];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setVideos(updated);
    startTransition(async () => {
      await reorderVideos(updated.map((v) => v.id));
    });
  }

  function handleMoveDown(index: number) {
    if (index === videos.length - 1) return;
    const updated = [...videos];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setVideos(updated);
    startTransition(async () => {
      await reorderVideos(updated.map((v) => v.id));
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
      onLogout();
    });
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
        <div className="mb-10 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Manage Videos
            </h1>
            <p className="mt-3 text-muted-foreground">
              Add, remove, and reorder videos. Changes are saved automatically
              and appear on the Videos page.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Sign Out
          </button>
        </div>

        {/* Add Video Form */}
        <form
          action={addFormAction}
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
                name="url"
                type="text"
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
                name="title"
                type="text"
                placeholder="Enter video title..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {addState?.error && (
            <p className="mt-3 text-sm text-red-500">{addState.error}</p>
          )}

          <button
            type="submit"
            disabled={addPending}
            className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {addPending ? "Adding..." : "Add Video"}
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

                {/* Video info + actions */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-card-foreground">
                      {video.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {video.platform === "youtube" ? "YouTube" : "Facebook"}{" "}
                      &middot; {video.videoId.slice(0, 20)}
                      {video.videoId.length > 20 ? "..." : ""}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === videos.length - 1}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                      title="Move down"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      title="Delete video"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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

// ---------------------------------------------------------------------------
// Main page component — checks auth then renders login or dashboard
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  // Show nothing while checking auth
  if (authed === null) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center text-muted-foreground">Loading...</div>
        </Container>
      </section>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
