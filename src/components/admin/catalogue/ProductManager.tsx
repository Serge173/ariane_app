"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { luxeImage, coachingImage } from "@/lib/images";
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2, Filter,
} from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import {
  buildCategoryTree,
  categoryOptionLabel,
  flattenCategoryTree,
  formatCategoryLabel,
} from "@/lib/categories";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  productType: "LUXE" | "SERVICE";
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  category: { id: string; name: string; slug: string; parent?: { name: string } | null };
  brandRef: { id: string; name: string } | null;
}

interface CategoryOption {
  id: string;
  name: string;
  parentId?: string | null;
  sortOrder?: number;
}

interface BrandOption {
  id: string;
  name: string;
}

export function ProductManager({
  initialCategories,
  initialBrands,
}: {
  initialCategories: CategoryOption[];
  initialBrands: BrandOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") ?? "");
  const [active, setActive] = useState(searchParams.get("active") ?? "all");
  const { showSuccess, showError, showConfirm, FeedbackModal } = useFeedbackModal();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "all") params.set("type", type);
    if (categoryId) params.set("categoryId", categoryId);
    if (brandId) params.set("brandId", brandId);
    if (active !== "all") params.set("active", active);

    const res = await fetch(`/api/admin/products?${params}`);
    const text = await res.text();
    if (!res.ok) {
      let message = "Impossible de charger les produits";
      try {
        const err = text ? JSON.parse(text) : null;
        if (err?.error) message = err.error;
      } catch {}
      console.error(message);
      setProducts([]);
      setLoading(false);
      return;
    }
    const data = text ? JSON.parse(text) : [];
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [q, type, categoryId, brandId, active]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "all") params.set("type", type);
    if (categoryId) params.set("categoryId", categoryId);
    if (brandId) params.set("brandId", brandId);
    if (active !== "all") params.set("active", active);
    router.replace(`/admin/catalogue/produits?${params.toString()}`);
    fetchProducts();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchProducts();
  };

  const remove = (id: string, name: string) => {
    showConfirm(`Supprimer ou archiver « ${name} » ?`, async () => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showSuccess("Le produit a été supprimé ou archivé.", "Supprimé");
        fetchProducts();
      } else {
        const d = await res.json().catch(() => ({}));
        showError(d.error || "Erreur");
      }
    }, "Supprimer le produit");
  };

  const categoryOptions = flattenCategoryTree(buildCategoryTree(initialCategories));

  return (
    <>
      {FeedbackModal}
      <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section mb-1">Gestion des produits</h1>
          <p className="text-brand-600 text-sm">{products.length} produit(s)</p>
        </div>
        <Link href="/admin/catalogue/produits/nouveau" className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Link>
      </div>

      <div className="bg-white border border-brand-100 p-4 mb-6 space-y-4">
        <div className="flex items-center gap-2 text-brand-500 text-xs uppercase tracking-widest">
          <Filter className="w-4 h-4" />
          Filtres intelligents
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              className="input-field pl-10"
              placeholder="Rechercher nom, marque, SKU, mot-clé..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">Tous types</option>
            <option value="LUXE">Articles luxe</option>
            <option value="SERVICE">Coaching</option>
          </select>
          <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Toutes catégories</option>
            {categoryOptions.map(({ node, depth }) => (
              <option key={node.id} value={node.id}>
                {categoryOptionLabel(node.name ?? "", depth)}
              </option>
            ))}
          </select>
          <select className="input-field" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            <option value="">Toutes marques</option>
            {initialBrands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="input-field w-auto" value={active} onChange={(e) => setActive(e.target.value)}>
            <option value="all">Tous statuts</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
          <button type="button" onClick={applyFilters} className="btn-primary text-xs">
            Appliquer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
        </div>
      ) : (
        <div className="bg-white border border-brand-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50 text-left">
                <th className="py-3 px-4 font-medium text-brand-500">Produit</th>
                <th className="py-3 px-4 font-medium text-brand-500">Type</th>
                <th className="py-3 px-4 font-medium text-brand-500">Catégorie</th>
                <th className="py-3 px-4 font-medium text-brand-500">Marque</th>
                <th className="py-3 px-4 font-medium text-brand-500">Prix</th>
                <th className="py-3 px-4 font-medium text-brand-500">Statut</th>
                <th className="py-3 px-4 font-medium text-brand-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-brand-50 hover:bg-brand-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-brand-100 flex-shrink-0">
                        <ProductImage
                          src={p.images[0]}
                          fallback={
                            p.productType === "LUXE"
                              ? luxeImage(p.slug)
                              : coachingImage(p.slug)
                          }
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.isFeatured && (
                          <span className="text-[10px] uppercase text-accent">Vedette</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-brand-600">
                    {p.productType === "LUXE" ? "Luxe" : "Coaching"}
                  </td>
                  <td className="py-3 px-4 text-brand-600">{formatCategoryLabel(p.category)}</td>
                  <td className="py-3 px-4 text-brand-600">{p.brandRef?.name || p.brand || "—"}</td>
                  <td className="py-3 px-4">{formatPrice(p.price)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase px-2 py-1 ${
                        p.isActive ? "bg-green-100 text-green-800" : "bg-brand-100"
                      }`}
                    >
                      {p.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/catalogue/produits/${p.id}`}
                        className="p-1.5 hover:bg-brand-100 rounded"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4 text-brand-600" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleActive(p.id, p.isActive)}
                        className="p-1.5 hover:bg-brand-100 rounded"
                        title={p.isActive ? "Désactiver" : "Activer"}
                      >
                        {p.isActive ? (
                          <EyeOff className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-brand-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id, p.name)}
                        className="p-1.5 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-brand-400 py-12">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </div>
    </>
  );
}
