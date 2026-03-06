import { NextRequest, NextResponse } from "next/server";
import { addPageView } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required." }, { status: 400 });
    }

    addPageView({
      path,
      timestamp: new Date().toISOString(),
      referrer: body.referrer || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
