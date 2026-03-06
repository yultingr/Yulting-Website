import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments } from "@/lib/db";
import type { Comment } from "@/types";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const comments = getComments()
    .filter((c) => c.postSlug === slug && c.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, name, email, content } = body;

    if (!postSlug?.trim() || !name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Name and comment are required." }, { status: 400 });
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postSlug: postSlug.trim(),
      name: name.trim(),
      email: email?.trim() || "",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      approved: false, // Requires admin approval
    };

    addComment(comment);

    return NextResponse.json({ success: true, message: "Comment submitted for review." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
