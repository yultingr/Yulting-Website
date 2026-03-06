import { NextRequest, NextResponse } from "next/server";
import { addSubmission } from "@/lib/db";
import type { ContactSubmission } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const submission: ContactSubmission = {
      id: Date.now().toString(),
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
            subject: `New contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
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
