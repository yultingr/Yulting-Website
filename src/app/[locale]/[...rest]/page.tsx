import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths inside a locale, so the designed
 * not-found page renders instead of Next's default 404.
 */
export default function CatchAllPage() {
  notFound();
}
