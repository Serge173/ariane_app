import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { DiscoveryParcoursSettingsForm } from "@/components/admin/content/DiscoveryParcoursSettingsForm";
import { getDiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";

export default async function AdminDiscoveryParcoursPage() {
  const session = await getServerSession(authOptions);
  const settings = await getDiscoveryParcoursSettings();

  return (
    <div>
      <AdminPageHeader
        section="Contenu"
        title="Parcours de découverte"
        description="Formulaire du bouton « Démarrer mon parcours » — lié à /reservation?intent=rdv"
      />
      <ContentSubNav active="parcours" />
      <DiscoveryParcoursSettingsForm initial={settings} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
