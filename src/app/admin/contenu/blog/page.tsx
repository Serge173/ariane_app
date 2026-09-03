import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { BlogSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export default async function AdminBlogContentPage() {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Page blog</h1>
        <p className="text-brand-600">En-tête de la liste et pied des articles</p>
      </div>
      <ContentSubNav active="blog" />
      <BlogSettingsForm initial={settings.blog} canEdit={canManageTeam(session?.user?.role)} />
    </div>
  );
}
