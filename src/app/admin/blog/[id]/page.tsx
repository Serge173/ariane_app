import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { parsePublicationLinks } from "@/lib/blog-publication-links";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPage({ params }: Props) {
  const { id } = await params;

  let post = null;
  try {
    post = await prisma.blogPost.findUnique({ where: { id } });
  } catch {}

  if (!post) notFound();

  const initial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    publicationLinks: parsePublicationLinks(post.publicationLinks),
    author: post.author,
    tagsText: post.tags.join(", "),
    isPublished: post.isPublished,
  };

  return (
    <div>
      <AdminPageHeader section="Contenu" title={`Modifier — ${post.title}`} description="Mettre à jour le contenu et la publication" />
      <BlogSubNav active="articles" />
      <BlogForm mode="edit" initial={initial} />
    </div>
  );
}
