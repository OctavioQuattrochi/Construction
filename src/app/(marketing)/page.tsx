import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Tools } from "@/components/sections/tools";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { TrustBar } from "@/components/sections/trust-bar";
import { getServices } from "@/lib/queries";
import { site } from "@/lib/site";

export default async function HomePage() {
  const services = await getServices();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brand,
    description: site.description,
    areaServed: `${site.region}, ${site.country}`,
    founder: { "@type": "Person", name: site.owner, jobTitle: "Arquitecto" },
    url: site.url,
    email: site.email,
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
      <FAQ />
      <CTA />
    </>
  );
}
