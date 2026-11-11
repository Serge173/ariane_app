import { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { PublicPageIntro, PublicPageShell } from "@/components/layout/PublicPageShell";
import { FaqList } from "@/components/faq/FaqList";

export const metadata: Metadata = { title: "FAQ" };

export default async function FAQPage() {
  const { faq } = await getPublicPagesSettings();

  return (
    <PublicPageShell width="narrow">
      <PublicPageIntro overline={faq.overline} title={faq.title} />
      <FaqList items={faq.items} />
    </PublicPageShell>
  );
}
