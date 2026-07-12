import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonAnchor } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  const details: { label: string; value: string; href?: string; external?: boolean }[] = [
    { label: t("emailLabel"), value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { label: "Instagram", value: "@yultingr", href: siteConfig.instagram, external: true },
    { label: t("phoneLabel"), value: "+91 9738414606", href: "tel:+919738414606" },
    { label: t("locationLabel"), value: t("locationValue") },
  ];

  return (
    <section className="py-24">
      <Container>
        <Breadcrumbs items={[{ labelKey: "contact" }]} />
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left side: heading, intro, actions */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonAnchor href={`mailto:${siteConfig.email}`} variant="primary">
                {tHome("ctaEmail")}
              </ButtonAnchor>
              <ButtonAnchor
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                {tHome("ctaFollow")}
              </ButtonAnchor>
            </div>
          </div>

          {/* Right side: details as a ruled list */}
          <div className="self-center border-t border-border">
            {details.map((item) => (
              <div
                key={item.label}
                className="grid gap-1 border-b border-border py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
              >
                <span className="font-serif small-caps text-sm text-accent">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-foreground underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </Container>
    </section>
  );
}
