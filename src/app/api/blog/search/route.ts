import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET(request: NextRequest) {
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
