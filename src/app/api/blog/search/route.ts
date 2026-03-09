import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { checkApiRateLimit } from "@/lib/rate-limit";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = checkApiRateLimit(`search:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const posts = getAllPosts(locale);

  const results = posts.filter((post) => {
    const searchable = `${post.title} ${post.summary} ${(post.tags || []).join(" ")}`.toLowerCase();
    return searchable.includes(q);
  });

  return NextResponse.json(results.slice(0, 10));
}
