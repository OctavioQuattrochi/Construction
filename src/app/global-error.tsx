"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Límite de error global del App Router. Reemplaza el layout raíz cuando hay un
// error de rendering, por eso renderiza <html>/<body>. Reporta a Sentry.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0f14",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Bild<span style={{ color: "#f0a500" }}>Ap</span>
          </div>
          <h2 style={{ fontSize: 20, margin: "12px 0 8px" }}>Algo salió mal</h2>
          <p style={{ color: "#9aa1af", marginBottom: 20 }}>
            Tuvimos un problema al cargar la página. Ya lo registramos. Probá de
            nuevo en un momento.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#f0a500",
              color: "#0c0f14",
              border: "none",
              borderRadius: 999,
              padding: "10px 22px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
