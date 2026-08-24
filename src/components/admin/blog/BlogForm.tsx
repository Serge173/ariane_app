"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BlogCoverImageField } from "@/components/admin/blog/BlogCoverImageField";

export interface BlogFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tagsText: string;
  isPublished: boolean;
}

interface BlogFormProps {
  initial?: Partial<BlogFormData>;
  mode: "create" | "edit";
}

const empty: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Ariane DAGO",
  tagsText: "",
  isPublished: false,
};

export function BlogForm({ initial, mode }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>({ ...empty, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const set = (key: keyof BlogFormData, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && autoSlug) next.slug = slugify(String(value));
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const text = await res.text();
    setLoading(false);

    if (!res.ok) {
      try {
        const data = text ? JSON.parse(text) : {};
        setError(data.error || "Erreur lors de l'enregistrement");
      } catch {
        setError("Erreur lors de l'enregistrement");
      }
      return;
    }

    router.push("/admin/blog/articles");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-8">
      {error && (
        <p className="p-4 bg-red-50 text-red-700 text-sm border border-red-100">{error}</p>
      )}

      <section className="bg-white border border-brand-100 p-6 space-y-4">
        <h2 className="font-display text-lg">Article</h2>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Titre *
          </label>
          <input
            className="input-field"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Slug URL
            </label>
            <input
              className="input-field"
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                set("slug", e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Auteur
            </label>
            <input
              className="input-field"
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Extrait (résumé)
          </label>
          <textarea
            className="input-field min-h-[80px]"
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Court résumé affiché sur la liste du blog"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Contenu *
          </label>
          <textarea
            className="input-field min-h-[280px] font-serif leading-relaxed"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
            placeholder="Rédigez votre article. Séparez les paragraphes par une ligne vide."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Image de couverture
          </label>
          <BlogCoverImageField
            value={form.coverImage}
            onChange={(url) => set("coverImage", url)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Tags (séparés par virgule)
          </label>
          <input
            className="input-field"
            value={form.tagsText}
            onChange={(e) => set("tagsText", e.target.value)}
            placeholder="conseil image, leadership, style"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
          />
          Publier l&apos;article (visible sur le site)
        </label>
      </section>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "create" ? "Créer l'article" : "Enregistrer"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </form>
  );
}
