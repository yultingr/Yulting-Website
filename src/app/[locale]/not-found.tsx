import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("backHome")}
        </Link>
      </Container>
    </section>
  );
}
