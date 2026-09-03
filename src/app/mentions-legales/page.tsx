import { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { LegalPageContent } from "@/components/content/LegalPageContent";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function MentionsLegalesPage() {
  const { legal } = await getPublicPagesSettings();
  return <LegalPageContent content={legal.mentionsLegales} />;
}
