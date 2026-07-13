import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Verity — Verified startups, real internships";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-share card. Retro theme: cream ground, lime tile, hard border. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F7F7EC",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "#C4F542",
              border: "5px solid #0A0A09",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: 700,
              color: "#0A0A09",
            }}
          >
            *
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700, color: "#0A0A09", letterSpacing: "2px" }}>
            VERITY
          </div>
        </div>
        <div style={{ fontSize: "84px", fontWeight: 700, color: "#0A0A09", lineHeight: 1.05 }}>
          Verified startups,
        </div>
        <div style={{ fontSize: "84px", fontWeight: 700, color: "#0A0A09", lineHeight: 1.05 }}>
          real internships.
        </div>
        <div style={{ fontSize: "32px", color: "#57534E", marginTop: "32px" }}>
          The trust layer for student career discovery.
        </div>
      </div>
    ),
    size,
  );
}
