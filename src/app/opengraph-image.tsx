import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CitePlex — AI-Powered Citation Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STYLES = ["APA", "MLA", "Chicago", "Turabian", "Bluebook", "Harvard"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(245,158,11,0.10), transparent 38%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              width: 92,
              height: 92,
              borderRadius: 20,
              backgroundColor: "#1c1917",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="60" height="60" viewBox="0 0 32 32" fill="none">
              <path
                d="M13 8.5H9.5V23.5H13"
                stroke="#fafaf9"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 8.5H22.5V23.5H19"
                stroke="#fafaf9"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M13.5 12.5H18.5" stroke="#f59e0b" strokeWidth="2.1" strokeLinecap="round" />
              <path d="M13.5 16H17" stroke="#fafaf9" strokeWidth="2.1" strokeLinecap="round" />
              <path d="M13.5 19.5H18.5" stroke="#fafaf9" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#1c1917" }}>cite</span>
            <span style={{ color: "#a1a1aa" }}>plex</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#1c1917",
              maxWidth: 940,
            }}
          >
            AI-Powered Citation Generator
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#52525b", maxWidth: 900 }}>
            Fast, accurate, ad-free citations for students and researchers.
          </div>
        </div>

        {/* Style badges + domain */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {STYLES.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#1c1917",
                  backgroundColor: "#f5f5f4",
                  border: "1px solid #e7e5e4",
                  borderRadius: 999,
                  padding: "10px 22px",
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#a1a1aa" }}>
            citeplex.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
