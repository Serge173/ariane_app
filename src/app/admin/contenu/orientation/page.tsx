import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { OrientationSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminOrientationContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="Questionnaire d'orientation" description="Questions, recommandations et textes du parcours /orientation" />
      <ContentSubNav active="orientation" />
      <OrientationSettingsForm initial={settings.orientation} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
