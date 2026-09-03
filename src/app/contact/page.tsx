import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { getSiteSettings } from "@/lib/site-settings";
import { ContactPageClient } from "@/components/contact/ContactPageClient";

export default async function ContactPage() {
  const [pages, site] = await Promise.all([getPublicPagesSettings(), getSiteSettings()]);
  return <ContactPageClient contact={pages.contact} site={site} />;
}
