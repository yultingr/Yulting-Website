import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments } from "@/lib/db";
import { checkApiRateLimit } from "@/lib/rate-limit";
import type { Comment } from "@/types";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const comments = getComments()
    .filter((c) => c.postSlug === slug && c.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIP(request);
  const rl = checkApiRateLimit(`comment:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { postSlug, name, email, content } = body;

    if (!postSlug?.trim() || !name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Name and comment are required." }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(postSlug.trim())) {
      return NextResponse.json({ error: "Invalid post slug." }, { status: 400 });
    }

    // Limit field lengths
    if (name.length > 200 || (email && email.length > 200) || content.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postSlug: postSlug.trim(),
      name: name.trim(),
      email: email?.trim() || "",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      approved: false,
    };

    addComment(comment);

    return NextResponse.json({ success: true, message: "Comment submitted for review." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
