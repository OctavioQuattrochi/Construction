import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.brand} — Todo para construir mejor`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen de marca por defecto para compartir en redes (home y páginas sin portada).
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
          background: "#0c0f14",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 26, height: 58, background: "#f0a500", borderRadius: 6 }} />
            <div style={{ width: 26, height: 58, background: "#e3e5ea", borderRadius: 6 }} />
            <div style={{ width: 26, height: 58, background: "#6f7688", borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", display: "flex" }}>
            Bild<span style={{ color: "#f0a500" }}>Ap</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>Todo para construir mejor,</span>
            <span>en un solo lugar.</span>
          </div>
          <div style={{ fontSize: 30, color: "#9aa1af", maxWidth: 900 }}>
            Comparador de precios · Calculadoras de obra · Presupuestos · Profesionales
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 4, width: 56, background: "#f0a500", borderRadius: 4 }} />
          <div style={{ fontSize: 26, color: "#6f7688" }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
