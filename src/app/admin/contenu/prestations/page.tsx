import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { OffersSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminOffersContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="Page prestations" description="En-tête et bloc entreprises de la page /offres" />
      <ContentSubNav active="prestations" />
      <OffersSettingsForm initial={settings.offers} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
