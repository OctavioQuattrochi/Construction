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
