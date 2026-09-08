import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { HomepageSettingsForm } from "@/components/admin/content/HomepageSettingsForm";
import { getHomepageSettings } from "@/lib/homepage-settings";

export default async function AdminHomepageContentPage() {
  const session = await getServerSession(authOptions);
  const canEdit = canManageTeam(session?.user?.role);
  const settings = await getHomepageSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Page d&apos;accueil</h1>
        <p className="text-brand-600">
          Hero, parcours client, témoignages Avant/Après (4 cadres) et bloc contact — sans aperçu boutique
        </p>
      </div>

      <ContentSubNav active="accueil" />

      <HomepageSettingsForm initial={settings} canEdit={canEdit} />
    </div>
  );
}
