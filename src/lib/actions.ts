"use server";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { type Video, parseVideoUrl } from "@/data/videos";

// ---------------------------------------------------------------------------
// Paths & secrets
// ---------------------------------------------------------------------------

const DATA_PATH = join(process.cwd(), "data", "videos.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";
const COOKIE_NAME = "admin_session";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function sign(value: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(value).digest("hex");
}

function verify(value: string, signature: string): boolean {
  const expected = sign(value);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function login(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get("password") as string;

  if (!password || password !== ADMIN_PASSWORD) {
    return { error: "Invalid password." };
  }

  const token = "authenticated";
  const sig = sign(token);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${token}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;

  const [token, sig] = cookie.value.split(".");
  if (!token || !sig) return false;

  return verify(token, sig);
}

// ---------------------------------------------------------------------------
// Video data helpers
// ---------------------------------------------------------------------------

function readVideos(): Video[] {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeVideos(videos: Video[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(videos, null, 2) + "\n", "utf-8");
}

// ---------------------------------------------------------------------------
// Video CRUD actions
// ---------------------------------------------------------------------------

export async function getVideos(): Promise<Video[]> {
  return readVideos();
}

export async function addVideo(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const url = (formData.get("url") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();

  if (!url) return { error: "Please enter a video URL." };
  if (!title) return { error: "Please enter a title." };

  const parsed = parseVideoUrl(url);
  if (!parsed) {
    return { error: "Invalid URL. Please enter a YouTube or Facebook video URL." };
  }

  const videos = readVideos();
  const newVideo: Video = {
    id: Date.now().toString(),
    platform: parsed.platform,
    videoId: parsed.videoId,
    title,
  };

  videos.push(newVideo);
  writeVideos(videos);

  return null; // success
}

export async function deleteVideo(id: string): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = readVideos();
  const updated = videos.filter((v) => v.id !== id);
  writeVideos(updated);

  return null;
}

export async function reorderVideos(ids: string[]): Promise<{ error: string } | null> {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Not authenticated." };

  const videos = readVideos();
  const map = new Map(videos.map((v) => [v.id, v]));
  const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Video[];

  // Append any videos not in the ids list (safety measure)
  for (const v of videos) {
    if (!ids.includes(v.id)) reordered.push(v);
  }

  writeVideos(reordered);
  return null;
}
