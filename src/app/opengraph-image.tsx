import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Flint.ai — Figure out your next move";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "70px 90px", background: "linear-gradient(135deg, #080809 0%, #15111b 55%, #08151a 100%)", color: "white", fontFamily: "Arial" }}>
      <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.65, marginBottom: 28 }}>Flint.ai</div>
      <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>Figure out your next move.</div>
      <div style={{ fontSize: 30, marginTop: 26, color: "#bcb9c5" }}>Career paths • ATS resume score • LinkedIn</div>
      <div style={{ fontSize: 24, marginTop: 44, color: "#ddd8e7" }}>Less guessing. More moves.</div>
    </div>,
    size,
  );
}
