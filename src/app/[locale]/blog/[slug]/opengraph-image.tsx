import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { getPostBySlug } from "@/lib/blog";

export const alt = "Yulting Rinpoche — Writings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(path: string): Buffer | null {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let title = "Yulting Rinpoche";
  let dateLine = "";
  try {
    const post = getPostBySlug(slug, locale);
    if (post.published) {
      title = post.title;
      dateLine = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } catch {
    // Fall back to the site name
  }

  const garamond = loadFont(
    join(process.cwd(), "src", "app", "og-fonts", "EBGaramond-SemiBold.ttf"),
  );
  const garamondItalic = loadFont(
    join(process.cwd(), "src", "app", "og-fonts", "EBGaramond-MediumItalic.ttf"),
  );
  const monlam = loadFont(
    join(process.cwd(), "public", "fonts", "MonlamUniOuChan2.ttf"),
  );

  const fonts = [
    ...(garamond
      ? [{ name: "Garamond", data: garamond, weight: 600 as const, style: "normal" as const }]
      : []),
    ...(garamondItalic
      ? [{ name: "Garamond", data: garamondItalic, weight: 500 as const, style: "italic" as const }]
      : []),
    ...(monlam
      ? [{ name: "Monlam", data: monlam, weight: 400 as const, style: "normal" as const }]
      : []),
  ];

  const serif = garamond ? "Garamond, Monlam" : "serif";
  const titleSize = title.length > 55 ? "52px" : title.length > 30 ? "64px" : "80px";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffbf5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            color: "#b45309",
            fontWeight: 600,
            letterSpacing: "0.3em",
            fontFamily: serif,
          }}
        >
          YULTING RINPOCHE
        </div>

        <div
          style={{
            marginTop: "28px",
            width: "72px",
            height: "1px",
            background: "#d6cbbd",
          }}
        />

        <div
          style={{
            marginTop: "36px",
            fontSize: titleSize,
            fontWeight: 600,
            color: "#1e293b",
            letterSpacing: "-0.02em",
            fontFamily: serif,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {dateLine && (
          <div
            style={{
              marginTop: "24px",
              fontSize: "26px",
              fontStyle: "italic",
              color: "#8a7f6e",
              fontFamily: serif,
            }}
          >
            {dateLine}
          </div>
        )}

        <div
          style={{
            marginTop: "36px",
            width: "72px",
            height: "1px",
            background: "#d6cbbd",
          }}
        />

        <div
          style={{
            marginTop: "28px",
            fontSize: "20px",
            color: "#b45309",
            fontWeight: 600,
            fontFamily: serif,
          }}
        >
          yultingrinpoche.com
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
