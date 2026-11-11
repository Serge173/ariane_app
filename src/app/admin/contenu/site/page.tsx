import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { SiteSettingsForm } from "@/components/admin/content/SiteSettingsForm";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSiteContentPage() {
  const session = await getServerSession(authOptions);
  const canEdit = canManageTeam(session?.user?.role);
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="Navigation & footer" description="
          Marque (header), menu Shopping Luxe/Premium, footer Conseil en image et bouton « Prendre rdv ! »
        " />
      <ContentSubNav active="site" />

      <SiteSettingsForm initial={settings} canEdit={canEdit} />
    </div>
  );
}
