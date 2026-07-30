import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { site } from "@/lib/site";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} · La plataforma para construir con criterio`,
    template: `%s · ${site.brand}`,
  },
  description: site.description,
  keywords: [
    "construcción",
    "materiales de construcción",
    "comparador de precios de materiales",
    "calculadora de materiales",
    "profesionales de la construcción Córdoba",
    "inmuebles Córdoba",
    "BildAp",
  ],
  authors: [{ name: site.company }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: `${site.brand} · La plataforma para construir con criterio`,
    description: site.description,
    siteName: site.brand,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${sora.variable} ${mono.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { borderRadius: "14px" } }}
        />
        <Analytics />
      </body>
    </html>
  );
}
