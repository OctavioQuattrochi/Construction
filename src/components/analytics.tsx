import Script from "next/script";

// Renderiza el analytics configurado por variables de entorno.
// - GA4:       NEXT_PUBLIC_GA_ID = "G-XXXXXXX"
// - Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "bildap.com.ar"
// Si no hay ninguna, no renderiza nada.
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {plausible && (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
