import { getSiteSettings } from "@/lib/site-settings";
import { ConnexionPageBackdrop } from "@/components/connexion/ConnexionPageBackdrop";
import { ConnexionPageClient } from "./ConnexionPageClient";

export const dynamic = "force-dynamic";

export default async function ConnexionPage() {
  const { connexion } = await getSiteSettings();
  const hasBackground = connexion.backgroundImage.trim().length > 0;

  return (
    <div className="connexion-page relative">
      <ConnexionPageBackdrop image={connexion.backgroundImage} imageAlt={connexion.backgroundImageAlt} />
      <ConnexionPageClient hasBackground={hasBackground} />
    </div>
  );
}