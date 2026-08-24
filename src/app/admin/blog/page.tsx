import Link from "next/link";
import prisma from "@/lib/prisma";
import { BlogSubNav } from "@/components/admin/blog/BlogSubNav";
import { Plus, FileText, Eye } from "lucide-react";

export default async function AdminBlogHubPage() {
  let stats = { total: 0, published: 0, drafts: 0 };

  try {
    const [total, published, drafts] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: false } }),
    ]);
    stats = { total, published, drafts };
  } catch {}

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-section mb-2">Blog</h1>
          <p className="text-brand-600">Gérez vos articles éditoriaux et contenus expert</p>
        </div>
        <Link href="/admin/blog/nouveau" className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      <BlogSubNav active="hub" />

      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        <Link
          href="/admin/blog/articles"
          className="group p-6 bg-white border border-brand-100 hover:border-brand-950 transition-all"
        >
          <FileText className="w-7 h-7 text-accent mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{stats.total}</p>
          <h2 className="font-display text-lg group-hover:text-accent transition-colors">Articles</h2>
        </Link>
        <div className="p-6 bg-white border border-brand-100">
          <Eye className="w-7 h-7 text-green-600 mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{stats.published}</p>
          <h2 className="font-display text-lg">Publiés</h2>
        </div>
        <div className="p-6 bg-white border border-brand-100">
          <FileText className="w-7 h-7 text-brand-400 mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{stats.drafts}</p>
          <h2 className="font-display text-lg">Brouillons</h2>
        </div>
      </div>
    </div>
  );
}
