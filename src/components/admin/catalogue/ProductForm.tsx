"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import {
  buildCategoryTree,
  flattenCategoryTree,
  categoryOptionLabel,
} from "@/lib/categories";
import { Loader2 } from "lucide-react";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  sortOrder?: number;
  scope?: "LUXE" | "SERVICE";
}

export interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  productType: "LUXE" | "SERVICE";
  categoryId: string;
  brandId: string;
  brandName: string;
  price: string;
  shortDescription: string;
  description: string;
  imagesText: string;
  featuresText: string;
  keywordsText: string;
  duration: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: string;
}

interface ProductFormProps {
  initial?: Partial<ProductFormData>;
  categories: CategoryOption[];
  brands: BrandOption[];
  mode: "create" | "edit";
}

const empty: ProductFormData = {
  name: "",
  slug: "",
  productType: "LUXE",
  categoryId: "",
  brandId: "",
  brandName: "",
  price: "",
  shortDescription: "",
  description: "",
  imagesText: "",
  featuresText: "",
  keywordsText: "",
  duration: "",
  sku: "",
  isActive: true,
  isFeatured: false,
  sortOrder: "0",
};

export function ProductForm({ initial, categories, brands, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({ ...empty, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const set = (key: keyof ProductFormData, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && autoSlug) next.slug = slugify(String(value));
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url =
      mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'enregistrement");
      return;
    }

    router.push("/admin/catalogue/produits");
    router.refresh();
  };

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.scope === form.productType),
    [categories, form.productType]
  );

  const categoryList = filteredCategories;

  const categoryOptions = useMemo(() => {
    const tree = buildCategoryTree(categoryList);
    return flattenCategoryTree(tree);
  }, [categoryList]);

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-8">
      {error && (
        <p className="p-4 bg-red-50 text-red-700 text-sm border border-red-100">{error}</p>
      )}

      <section className="bg-white border border-brand-100 p-6 space-y-4">
        <h2 className="font-display text-lg">Informations générales</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Type *
            </label>
            <select
              className="input-field"
              value={form.productType}
              onChange={(e) => set("productType", e.target.value as "LUXE" | "SERVICE")}
            >
              <option value="LUXE">Article de luxe (boutique)</option>
              <option value="SERVICE">Accompagnement coaching</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Nom *
            </label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

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
              SKU
            </label>
            <input className="input-field" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Catégorie *
            </label>
            <select
              className="input-field"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              required
            >
              <option value="">— Choisir —</option>
              {categoryOptions.map(({ node, depth }) => (
                <option key={node.id} value={node.id}>
                  {categoryOptionLabel(node.name, depth)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Marque
            </label>
            <select
              className="input-field mb-2"
              value={form.brandId}
              onChange={(e) => {
                const id = e.target.value;
                set("brandId", id);
                const b = brands.find((x) => x.id === id);
                if (b) set("brandName", b.name);
              }}
            >
              <option value="">— Sans marque / texte libre —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {!form.brandId && (
              <input
                className="input-field"
                placeholder="Nom de marque libre"
                value={form.brandName}
                onChange={(e) => set("brandName", e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Prix (FCFA) *
            </label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />
          </div>

          {form.productType === "SERVICE" && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
                Durée
              </label>
              <input
                className="input-field"
                placeholder="ex: 4 heures"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Description courte
            </label>
            <input
              className="input-field"
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Description complète *
            </label>
            <textarea
              className="input-field min-h-[120px]"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-100 p-6 space-y-4">
        <h2 className="font-display text-lg">Médias & contenu</h2>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            URLs images (une par ligne)
          </label>
          <textarea
            className="input-field min-h-[80px] font-mono text-xs"
            value={form.imagesText}
            onChange={(e) => set("imagesText", e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Points forts (un par ligne)
          </label>
          <textarea
            className="input-field min-h-[80px]"
            value={form.featuresText}
            onChange={(e) => set("featuresText", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
            Mots-clés recherche (séparés par virgule)
          </label>
          <textarea
            className="input-field min-h-[60px]"
            value={form.keywordsText}
            onChange={(e) => set("keywordsText", e.target.value)}
            placeholder="luxueux, cuir, sac à main, cadeau..."
          />
          <p className="text-xs text-brand-400 mt-1">
            Utilisés par la recherche boutique. Des mots-clés sont aussi générés automatiquement.
          </p>
        </div>
      </section>

      <section className="bg-white border border-brand-100 p-6 space-y-4">
        <h2 className="font-display text-lg">Publication</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
              Ordre
            </label>
            <input
              type="number"
              className="input-field"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            Actif (visible)
          </label>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
            />
            Mis en avant
          </label>
        </div>
      </section>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "create" ? "Créer le produit" : "Enregistrer"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
