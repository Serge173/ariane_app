import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default function AdminNewBlogPage() {
  return (
    <div>
      <AdminPageHeader section="Contenu" title="Nouvel article" description="Rédaction et publication d'un article blog" />
      <BlogSubNav active="articles" />
      <BlogForm mode="create" />
    </div>
  );
}
