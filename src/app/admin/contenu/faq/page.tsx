import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { FaqSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminFaqContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">FAQ</h1>
        <p className="text-brand-600">Questions et réponses fréquentes</p>
      </div>
      <ContentSubNav active="faq" />
      <FaqSettingsForm initial={settings.faq} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
