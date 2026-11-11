import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogManager } from "@/components/admin/blog/BlogManager";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default function AdminBlogArticlesPage() {
  return (
    <div>
      <AdminPageHeader
        section="Contenu"
        title="Articles blog"
        description="Rédaction, publication et organisation des articles."
      />
      <BlogSubNav active="articles" />
      <BlogManager />
    </div>
  );
}
