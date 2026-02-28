export interface Video {
  id: string;
  platform: "youtube" | "facebook";
  /** For YouTube: the video ID (e.g. "dQw4w9WgXcQ"). For Facebook: the full video URL. */
  videoId: string;
  /** Direct title string. */
  title?: string;
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
