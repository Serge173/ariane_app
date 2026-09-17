import type { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { getSiteSettings } from "@/lib/site-settings";
import { ContactPageClient } from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Ariane DAGO pour un conseil en image, un coaching ou une demande entreprise à Abidjan.",
};

export default async function ContactPage() {
  const [pages, site] = await Promise.all([getPublicPagesSettings(), getSiteSettings()]);
  return <ContactPageClient contact={pages.contact} site={site} />;
}
