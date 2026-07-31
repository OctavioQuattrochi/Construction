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

export default nextConfig;
