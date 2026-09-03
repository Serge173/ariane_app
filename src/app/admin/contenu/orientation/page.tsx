import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { OrientationSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminOrientationContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Questionnaire d&apos;orientation</h1>
        <p className="text-brand-600">Questions, recommandations et textes du parcours /orientation</p>
      </div>
      <ContentSubNav active="orientation" />
      <OrientationSettingsForm initial={settings.orientation} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
