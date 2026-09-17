import { resolveAppUrl } from "@/lib/app-url";
import { BRAND_FULL_NAME } from "@/lib/brand";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteJsonLd() {
  const site = await getSiteSettings();
  const appUrl = resolveAppUrl();
  const phone = site.footer.contact.phone.replace(/\s/g, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND_FULL_NAME,
    url: appUrl,
    description:
      "Conseil en image, coaching personnel et professionnel, personal shopping et boutique premium à Abidjan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.footer.contact.line1 || "Abidjan, Cocody",
      addressCountry: site.footer.contact.line2 || "Côte d'Ivoire",
    },
    telephone: phone,
    email: site.footer.contact.email,
    areaServed: "Abidjan, Côte d'Ivoire",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
