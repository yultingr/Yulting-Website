import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { KnotSeal } from "@/components/ui/TibetanDivider";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center" aria-hidden="true">
            <KnotSeal className="text-accent/50" size={44} />
          </div>
          <p className="mt-8 font-serif small-caps text-base text-accent">404</p>
          <h1 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
          <p className="mt-8">
            <Link
              href="/"
              className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {t("backHome")} →
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
