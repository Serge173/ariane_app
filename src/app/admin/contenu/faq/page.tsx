import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { FaqSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminFaqContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="FAQ" description="Questions et réponses fréquentes" />
      <ContentSubNav active="faq" />
      <FaqSettingsForm initial={settings.faq} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
