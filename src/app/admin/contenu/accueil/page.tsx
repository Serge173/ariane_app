import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { HomepageSettingsForm } from "@/components/admin/content/HomepageSettingsForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { getHomepageSettings } from "@/lib/homepage-settings";

export default async function AdminHomepageContentPage() {
  const session = await getServerSession(authOptions);
  const canEdit = canManageTeam(session?.user?.role);
  const settings = await getHomepageSettings();

  return (
    <div>
      <PageHeader
        title="Page d'accueil"
        description="Sections numérotées : modifiez le hero, le parcours, les témoignages et le contact. Enregistrez en bas de page."
      />

      <ContentSubNav active="accueil" />

      <HomepageSettingsForm initial={settings} canEdit={canEdit} />
    </div>
  );
}
