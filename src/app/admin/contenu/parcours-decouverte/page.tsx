import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { DiscoveryParcoursSettingsForm } from "@/components/admin/content/DiscoveryParcoursSettingsForm";
import { getDiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";

export default async function AdminDiscoveryParcoursPage() {
  const session = await getServerSession(authOptions);
  const settings = await getDiscoveryParcoursSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Parcours de découverte</h1>
        <p className="text-brand-600">
          Formulaire du bouton « Démarrer mon parcours de ma découverte » — synchronisé avec{" "}
          <code className="text-xs">/reservation?intent=rdv</code>
        </p>
      </div>
      <ContentSubNav active="parcours" />
      <DiscoveryParcoursSettingsForm initial={settings} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
