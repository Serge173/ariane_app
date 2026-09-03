import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { AboutSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminAboutContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Page À propos</h1>
        <p className="text-brand-600">Biographie, valeurs et appel à l&apos;action</p>
      </div>
      <ContentSubNav active="apropos" />
      <AboutSettingsForm initial={settings.about} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
