import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Yulting Rinpoche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(path: string): Buffer | null {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
}

export default async function Image() {
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

  const serif = garamond ? "Garamond" : "serif";

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
          GADEN SHARTSE MONASTERY
        </div>

        <div
          style={{
            marginTop: "28px",
            width: "72px",
            height: "1px",
            background: "#d6cbbd",
          }}
        />

        {monlam && (
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              color: "#8a7f6e",
              fontFamily: "Monlam",
            }}
          >
            ཡུལ་སྟེང་རིན་པོ་ཆེ།
          </div>
        )}

        <div
          style={{
            marginTop: "12px",
            fontSize: "96px",
            fontWeight: 600,
            color: "#1e293b",
            letterSpacing: "-0.02em",
            fontFamily: serif,
          }}
        >
          Yulting Rinpoche
        </div>

        <div
          style={{
            marginTop: "16px",
            fontSize: "30px",
            fontStyle: "italic",
            color: "#8a7f6e",
            fontFamily: serif,
          }}
        >
          Educator, translator, and Buddhist scholar
        </div>

        <div
          style={{
            marginTop: "32px",
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
