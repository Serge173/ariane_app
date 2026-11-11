import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { BlogSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminBlogContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <AdminPageHeader section="Contenu" title="Page blog" description="En-tête de la liste et pied des articles" />
      <ContentSubNav active="blog" />
      <BlogSettingsForm initial={settings.blog} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
