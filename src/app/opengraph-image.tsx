import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yulting Rinpoche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #2d3a4e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#fef3c7",
              letterSpacing: "-0.02em",
            }}
          >
            Yulting Rinpoche
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              letterSpacing: "0.05em",
            }}
          >
            Educator · Translator · Buddhist Scholar
          </div>
          <div
            style={{
              marginTop: "24px",
              width: "80px",
              height: "2px",
              background: "#fb923c",
            }}
          />
          <div
            style={{
              marginTop: "8px",
              fontSize: "18px",
              color: "#64748b",
            }}
          >
            yultingrinpoche.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
