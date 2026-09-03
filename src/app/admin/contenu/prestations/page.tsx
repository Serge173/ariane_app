import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { OffersSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminOffersContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Page prestations</h1>
        <p className="text-brand-600">En-tête et bloc entreprises de la page /offres</p>
      </div>
      <ContentSubNav active="prestations" />
      <OffersSettingsForm initial={settings.offers} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
