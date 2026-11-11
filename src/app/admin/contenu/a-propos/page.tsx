import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { AboutSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminAboutContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader
        section="Contenu"
        title={"Page \u00c0 propos"}
        description={"Biographie, valeurs et appel \u00e0 l\u2019action"}
      />
      <ContentSubNav active="apropos" />
      <AboutSettingsForm initial={settings.about} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
