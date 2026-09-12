import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Tools } from "@/components/sections/tools";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { TrustBar } from "@/components/sections/trust-bar";
import { Partners } from "@/components/sections/partners";
import { News } from "@/components/sections/news";
import { getServices } from "@/lib/queries";
import { faqs, aboutBio } from "@/lib/content";
import { site } from "@/lib/site";

export default async function HomePage() {
  const services = await getServices();

  // Datos estructurados: Organization + WebSite (habilita la caja de búsqueda
  // de Google) + FAQPage (las preguntas pueden aparecer directo en el buscador).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.brand,
        description: site.description,
        url: site.url,
        email: site.email,
        logo: `${site.url}/icon.svg`,
        areaServed: `${site.region}, ${site.country}`,
        founder: {
          "@type": "Person",
          name: aboutBio.founder.name,
          jobTitle: "Arquitecto",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: site.region,
          addressCountry: "AR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: site.email,
          areaServed: "AR",
          availableLanguage: "Spanish",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.brand,
        inLanguage: "es-AR",
        publisher: { "@id": `${site.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${site.url}/comparador?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TrustBar />
      <Services services={services} />
      <About />
      <Tools />
      <Partners />
      <News />
      <FAQ />
      <CTA />
    </>
  );
}
