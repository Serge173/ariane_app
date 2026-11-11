import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { ContactSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminContactContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="Page contact" description="Textes des formulaires et messages de confirmation" />
      <ContentSubNav active="contact" />
      <ContactSettingsForm initial={settings.contact} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
