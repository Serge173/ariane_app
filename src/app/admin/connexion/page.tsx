import { getSiteSettings } from "@/lib/site-settings";
import { ConnexionPageBackdrop } from "@/components/connexion/ConnexionPageBackdrop";
import { AdminConnexionPageClient } from "./AdminConnexionPageClient";

export const dynamic = "force-dynamic";

export default async function AdminConnexionPage() {
  const { connexion } = await getSiteSettings();
  const hasBackground = connexion.adminBackgroundImage.trim().length > 0;

  return (
    <div className="admin-connexion-page relative">
      <ConnexionPageBackdrop
        image={connexion.adminBackgroundImage}
        imageAlt={connexion.adminBackgroundImageAlt}
        fallback="dark"
      />
      <AdminConnexionPageClient hasBackground={hasBackground} />
    </div>
  );
}