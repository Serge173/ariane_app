import { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { LegalPageContent } from "@/components/content/LegalPageContent";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default async function ConfidentialitePage() {
  const { legal } = await getPublicPagesSettings();
  return <LegalPageContent content={legal.confidentialite} />;
}
