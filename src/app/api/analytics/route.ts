import { NextRequest, NextResponse } from "next/server";
import { addPageView } from "@/lib/db";
import { checkApiRateLimit } from "@/lib/rate-limit";

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

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIP(request);
  const rl = checkApiRateLimit(`analytics:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { path } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Path is required." }, { status: 400 });
    }

    // Limit path length to prevent abuse
    if (path.length > 500) {
      return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }

    addPageView({
      path: path.slice(0, 500),
      timestamp: new Date().toISOString(),
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : undefined,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
