"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import { Plus, Search, Pencil, Trash2, Loader2, ExternalLink, Power } from "lucide-react";

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  tags: string[];
}

function BlogCard({
  post,
  togglingId,
  onToggle,
  onRemove,
}: {
  post: BlogRow;
  togglingId: string | null;
  onToggle: (id: string, current: boolean) => void;
  onRemove: (id: string, title: string) => void;
}) {
  return (
    <article
      className={`bg-white border px-3 py-2 flex items-center gap-2.5 h-[52px] transition-colors ${
        post.isPublished ? "border-green-200" : "border-red-200"
      }`}
    >
      <div className="relative w-10 h-10 flex-shrink-0 bg-brand-100 overflow-hidden">
        <ProductImage
          src={post.coverImage || ""}
          fallback={IMAGES.blogCover}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <span
        className={`inline-flex items-center gap-1 flex-shrink-0 text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-medium ${
          post.isPublished ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
        title={post.isPublished ? "Actif" : "Suspendu"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? "bg-green-600" : "bg-red-600"}`} />
      </span>

      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-medium truncate leading-tight">{post.title}</h2>
        <p className="text-[10px] text-brand-400 truncate leading-tight">
          {post.publishedAt ? formatDate(post.publishedAt) : "Non publié"}
        </p>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => onToggle(post.id, post.isPublished)}
          disabled={togglingId === post.id}
          className={`p-1 rounded transition-colors ${
            post.isPublished ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
          }`}
          title={post.isPublished ? "Suspendre" : "Activer"}
        >
          {togglingId === post.id ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Power className="w-3.5 h-3.5" />
          )}
        </button>
        {post.isPublished && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="p-1 hover:bg-brand-50 rounded text-brand-500"
            title="Voir sur le site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
        <Link href={`/admin/blog/${post.id}`} className="p-1 hover:bg-brand-50 rounded" title="Modifier">
          <Pencil className="w-3.5 h-3.5 text-brand-600" />
        </Link>
        <button
          type="button"
          onClick={() => onRemove(post.id, post.title)}
          className="p-1 hover:bg-red-50 rounded text-red-500"
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);

    const res = await fetch(`/api/admin/blog?${params}`);
    const text = await res.text();
    if (!res.ok) {
      setPosts([]);
      setLoading(false);
      return;
    }
    const data = text ? JSON.parse(text) : [];
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const togglePublish = async (id: string, current: boolean) => {
    setTogglingId(id);
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    setTogglingId(null);
    fetchPosts();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Supprimer « ${title} » ?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const midpoint = Math.ceil(posts.length / 2);
  const leftColumn = posts.slice(0, midpoint);
  const rightColumn = posts.slice(midpoint);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section mb-1">Articles du blog</h1>
          <p className="text-brand-600 text-sm">{posts.length} article(s)</p>
        </div>
        <Link href="/admin/blog/nouveau" className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      <div className="bg-white border border-brand-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            className="input-field pl-10"
            placeholder="Rechercher un titre, tag..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
          />
        </div>
        <select className="input-field w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tous</option>
          <option value="published">Actifs</option>
          <option value="draft">Suspendus</option>
        </select>
        <button type="button" onClick={fetchPosts} className="btn-primary text-xs">
          Filtrer
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-brand-400 py-12 bg-white border border-brand-100">
          Aucun article — créez votre premier contenu éditorial.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
          <div className="space-y-2">
            {leftColumn.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                togglingId={togglingId}
                onToggle={togglePublish}
                onRemove={remove}
              />
            ))}
          </div>
          <div className="space-y-2">
            {rightColumn.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                togglingId={togglingId}
                onToggle={togglePublish}
                onRemove={remove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
