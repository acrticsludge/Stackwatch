import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "#3b82f6",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "22px", height: "22px", background: "white", borderRadius: "3px" }} />
          </div>
          <span style={{ color: "#ffffff", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.5px" }}>
            Stackwatch
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "62px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "920px",
            letterSpacing: "-1.5px",
          }}
        >
          Know before your users do.
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "26px",
            color: "#71717a",
            maxWidth: "760px",
            lineHeight: 1.5,
          }}
        >
          Monitor GitHub Actions, Vercel, Supabase & Railway limits.
          Get alerted before a quota hits production.
        </div>

        {/* Service pills */}
        <div style={{ display: "flex", gap: "10px", marginTop: "48px" }}>
          {["GitHub Actions", "Vercel", "Supabase", "Railway"].map((s) => (
            <div
              key={s}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 18px",
                color: "#a1a1aa",
                fontSize: "16px",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
