import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { SiteSettingsForm } from "@/components/admin/content/SiteSettingsForm";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSiteContentPage() {
  const session = await getServerSession(authOptions);
  const canEdit = canManageTeam(session?.user?.role);
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Navigation & footer</h1>
        <p className="text-brand-600">
          Marque, menu principal, liens et coordonnées du pied de page
        </p>
      </div>

      <ContentSubNav active="site" />

      <SiteSettingsForm initial={settings} canEdit={canEdit} />
    </div>
  );
}
