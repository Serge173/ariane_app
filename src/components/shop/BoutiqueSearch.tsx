"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { categoryOptionLabel } from "@/lib/categories";

interface CatalogSearchProps {
  categories: { slug: string; name: string; depth?: number }[];
  brands?: { slug: string; name: string }[];
  basePath?: string;
  showBrandFilter?: boolean;
}

export function CatalogSearch({
  categories,
  brands = [],
  basePath = "/boutique",
  showBrandFilter = true,
}: CatalogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const category = searchParams.get("category") ?? "all";
  const brand = searchParams.get("brand") ?? "all";

  const push = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "all") params.delete(key);
      else params.set(key, val);
    });
    router.push(`${basePath}?${params.toString()}`);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    push({ q: q.trim() || null });
  };

  const clearAll = () => {
    setQ("");
    router.push(basePath);
  };

  const hasFilters = q || category !== "all" || (showBrandFilter && brand !== "all");

  return (
    <div className="mb-10 space-y-4">
      <form onSubmit={onSearch} className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un article, une marque, un mot-clé..."
          className="input-field pl-12 pr-24 py-4 text-base w-full"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-2.5 px-4"
        >
          Rechercher
        </button>
      </form>

      <div className="flex flex-wrap gap-3 justify-center items-center">
        <select
          className="input-field w-auto text-xs"
          value={category}
          onChange={(e) => push({ category: e.target.value })}
        >
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {categoryOptionLabel(c.name, c.depth ?? 0)}
            </option>
          ))}
        </select>

        {showBrandFilter && (
          <select
            className="input-field w-auto text-xs"
            value={brand}
            onChange={(e) => push({ brand: e.target.value })}
          >
            <option value="all">Toutes marques</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-950 uppercase tracking-widest"
          >
            <X className="w-3.5 h-3.5" />
            Effacer
          </button>
        )}
      </div>

      {hasFilters && (
        <p className="text-center text-sm text-brand-500">
          Filtres actifs
          {q && <> · « {q} »</>}
          {category !== "all" && <> · {categories.find((c) => c.slug === category)?.name}</>}
          {showBrandFilter && brand !== "all" && <> · {brands.find((b) => b.slug === brand)?.name}</>}
        </p>
      )}
    </div>
  );
}

/** @deprecated Utiliser CatalogSearch */
export function BoutiqueSearch(props: {
  categories: { slug: string; name: string; depth?: number }[];
  brands: { slug: string; name: string }[];
}) {
  return <CatalogSearch {...props} basePath="/boutique" showBrandFilter />;
}
