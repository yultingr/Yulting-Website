import { getVideos as getVideosFromDb } from "@/lib/db";
import { type Video } from "@/data/videos";
import fallbackVideos from "../../data/videos.json";

/**
 * Videos for public pages: SQLite when available, otherwise the committed
 * snapshot (read-only serverless filesystems cannot open the database).
 */
export function getPublicVideos(): Video[] {
  try {
    return getVideosFromDb();
  } catch {
    return fallbackVideos as Video[];
  }
}
