import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { addSubmission } from "@/lib/db";
import { checkApiRateLimit } from "@/lib/rate-limit";
import type { ContactSubmission } from "@/types";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkOrigin(request: NextRequest): boolean {
  // Sec-Fetch-Site is set by modern browsers and cannot be spoofed by JS
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) return true; // Same-origin or non-browser requests
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // CSRF: verify origin matches host
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Rate limit per IP
  const ip = getClientIP(request);
  const rl = checkApiRateLimit(`contact:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Limit field lengths to prevent abuse
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const submission: ContactSubmission = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    addSubmission(submission);

    // Optionally send email via Resend if API key is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || "noreply@yulting.dev",
            to: "tulkuyulting@gmail.com",
            subject: `New contact from ${name.trim().slice(0, 100)}`,
            text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
          }),
        });
      } catch {
        // Email sending failed but submission was saved
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
