import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogForm } from "@/components/admin/blog/BlogForm";

export default function AdminNewBlogPage() {
  return (
    <div>
      <BlogSubNav active="articles" />
      <h1 className="heading-section mb-8">Nouvel article</h1>
      <BlogForm mode="create" />
    </div>
  );
}
