import { ImageResponse } from "next/og";

export const alt = "VibeJudge — Your CV is lying to you. Get a free AI roast and a better CV.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f4ee",
          padding: 64,
          fontFamily: "sans-serif",
          color: "#16130f"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 700 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#16130f",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}
            >
              V
            </div>
            VibeJudge
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Your CV is lying to you.</div>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, color: "#e2492f" }}>
              Let&apos;s fix that.
            </div>
          </div>
          <div style={{ fontSize: 26, color: "#6f675c" }}>Free AI roast · Download it · Generate a new CV</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <div
            style={{
              width: 380,
              display: "flex",
              flexDirection: "column",
              background: "#16130f",
              color: "#fff",
              borderRadius: 24,
              padding: 36,
              transform: "rotate(2deg)"
            }}
          >
            <div style={{ fontSize: 18, letterSpacing: 3, color: "#b5ab9c" }}>CV ROAST · EXAMPLE</div>
            <div style={{ display: "flex", alignItems: "flex-end", marginTop: 18 }}>
              <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1 }}>61</div>
              <div style={{ fontSize: 32, color: "#b5ab9c", marginLeft: 8, marginBottom: 14 }}>/100</div>
            </div>
            <div style={{ height: 10, borderRadius: 10, background: "#3d3730", marginTop: 18, display: "flex" }}>
              <div style={{ width: "61%", height: 10, borderRadius: 10, background: "#e2492f" }} />
            </div>
            <div style={{ fontSize: 26, lineHeight: 1.35, marginTop: 26, fontStyle: "italic" }}>
              “Your bullet points are responsibilities wearing a tie.”
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
