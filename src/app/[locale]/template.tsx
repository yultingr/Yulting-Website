import { PageTransition } from "@/components/ui/PageTransition";

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
