import { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { LegalPageContent } from "@/components/content/LegalPageContent";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default async function CGVPage() {
  const { legal } = await getPublicPagesSettings();
  return <LegalPageContent content={legal.cgv} />;
}
