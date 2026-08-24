import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { BlogForm } from "@/components/admin/blog/BlogForm";

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
    author: post.author,
    tagsText: post.tags.join(", "),
    isPublished: post.isPublished,
  };

  return (
    <div>
      <BlogSubNav active="articles" />
      <h1 className="heading-section mb-8">Modifier — {post.title}</h1>
      <BlogForm mode="edit" initial={initial} />
    </div>
  );
}
