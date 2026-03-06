"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {t("formTitle")}
      </h2>
      <p className="mt-2 text-muted-foreground">{t("formSubtitle")}</p>

      {status === "sent" ? (
        <div className="mt-8 max-w-xl rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Thank you! Your message has been sent successfully.
          </p>
          <button onClick={() => setStatus("idle")} className="mt-3 text-sm text-green-600 underline hover:no-underline dark:text-green-400">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">{t("formName")}</label>
            <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40" placeholder={t("formNamePlaceholder")} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">{t("formEmail")}</label>
            <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40" placeholder={t("formEmailPlaceholder")} />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">{t("formMessage")}</label>
            <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40" placeholder={t("formMessagePlaceholder")} />
          </div>
          {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
          <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {status === "sending" ? "Sending..." : t("formSend")}
          </button>
        </form>
      )}
    </div>
  );
}
