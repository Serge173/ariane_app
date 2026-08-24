import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogManager } from "@/components/admin/blog/BlogManager";

export default function AdminBlogArticlesPage() {
  return (
    <div>
      <BlogSubNav active="articles" />
      <BlogManager />
    </div>
  );
}
