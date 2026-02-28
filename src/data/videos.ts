export interface Video {
  id: string;
  platform: "youtube" | "facebook";
  /** For YouTube: the video ID (e.g. "dQw4w9WgXcQ"). For Facebook: the full video URL. */
  videoId: string;
  titleKey: string;
}

export const videos: Video[] = [
  {
    id: "1",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    titleKey: "video1Title",
  },
  {
    id: "2",
    platform: "youtube",
    videoId: "jNQXAC9IVRw",
    titleKey: "video2Title",
  },
];
