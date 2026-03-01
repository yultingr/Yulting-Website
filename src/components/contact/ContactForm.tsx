"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValid = name.trim() && email.trim() && message.trim();

  const mailtoHref = `mailto:tulkuyulting@gmail.com?subject=${encodeURIComponent(
    `Message from ${name}`,
  )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {t("formTitle")}
      </h2>
      <p className="mt-2 text-muted-foreground">{t("formSubtitle")}</p>

      <div className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-foreground"
          >
            {t("formName")}
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder={t("formNamePlaceholder")}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-foreground"
          >
            {t("formEmail")}
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder={t("formEmailPlaceholder")}
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-foreground"
          >
            {t("formMessage")}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder={t("formMessagePlaceholder")}
          />
        </div>
        <a
          href={isValid ? mailtoHref : undefined}
          aria-disabled={!isValid}
          className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-opacity ${
            isValid
              ? "bg-foreground text-background hover:opacity-90"
              : "pointer-events-none bg-muted text-muted-foreground opacity-50"
          }`}
        >
          {t("formSend")}
        </a>
        <p className="text-xs text-muted-foreground">{t("formNote")}</p>
      </div>
    </div>
  );
}
