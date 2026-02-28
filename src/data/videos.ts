export interface Video {
  id: string;
  platform: "youtube" | "facebook";
  /** For YouTube: the video ID (e.g. "dQw4w9WgXcQ"). For Facebook: the full video URL. */
  videoId: string;
  /** Direct title string (used by admin-created videos). */
  title?: string;
  /** i18n translation key (used by seed data). */
  titleKey?: string;
}

export const defaultVideos: Video[] = [
  {
    id: "1",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    title: "Placeholder Video 1",
    titleKey: "video1Title",
  },
  {
    id: "2",
    platform: "youtube",
    videoId: "jNQXAC9IVRw",
    title: "Placeholder Video 2",
    titleKey: "video2Title",
  },
];

const STORAGE_KEY = "yulting-videos";

/** Get videos from localStorage, falling back to defaults. */
export function getStoredVideos(): Video[] {
  if (typeof window === "undefined") return defaultVideos;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return defaultVideos;
}

/** Save videos to localStorage. */
export function saveVideos(videos: Video[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

/** Parse a YouTube or Facebook URL and extract platform + videoId. */
export function parseVideoUrl(url: string): { platform: "youtube" | "facebook"; videoId: string } | null {
  const trimmed = url.trim();

  // YouTube: various URL formats
  const ytPatterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of ytPatterns) {
    const match = trimmed.match(pattern);
    if (match) return { platform: "youtube", videoId: match[1] };
  }

  // Facebook video URL
  if (trimmed.includes("facebook.com") || trimmed.includes("fb.watch")) {
    return { platform: "facebook", videoId: trimmed };
  }

  // If it looks like a bare YouTube ID (11 chars, alphanumeric + _-)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { platform: "youtube", videoId: trimmed };
  }

  return null;
}
