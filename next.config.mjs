import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    // Headers de seguridad para todas las rutas. Se evita un CSP con script-src
    // estricto porque Next inyecta scripts inline (bootstrap + JSON-LD) y sin
    // nonces rompería la app; se aplican en cambio las directivas de alto valor
    // que no dependen de nonces (anti-clickjacking, anti-sniffing, HSTS).
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      // frame-ancestors sólo puede ir por header (no por <meta>): refuerza el
      // anti-clickjacking. object-src/base-uri no dependen de nonces.
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
      },
    ];
    return [{ source: "/:path*", headers: security }];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Las páginas dinámicas (force-dynamic) nunca se reutilizan cacheadas desde
    // el router del cliente → los filtros/búsquedas siempre muestran datos frescos.
    // Las estáticas se cachean 3 min (perf) sin riesgo de contenido viejo.
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
};

// Sentry envuelve la config. Sin SENTRY_AUTH_TOKEN no sube source maps (ok).
// Sin DSN, el SDK es no-op en runtime.
export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
});
