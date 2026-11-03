"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import {
  CATALOG_FILTER_ALL,
  categoryOptionLabel,
  filterCatalogBrandOptions,
  filterCatalogCategoryOptions,
} from "@/lib/categories";
import { FilterSelect } from "@/components/ui/FilterSelect";

interface CatalogSearchProps {
  categories: { slug: string; name: string; depth?: number }[];
  brands?: { slug: string; name: string }[];
  basePath?: string;
  showBrandFilter?: boolean;
  allCategoryLabel?: string;
  allBrandLabel?: string;
  searchPlaceholder?: string;
}

export function CatalogSearch({
  categories,
  brands = [],
  basePath = "/boutique",
  showBrandFilter = true,
  allCategoryLabel = "Toutes catégories",
  allBrandLabel = "Toutes marques",
  searchPlaceholder = "Rechercher un article, une marque, un mot-clé...",
}: CatalogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const category = searchParams.get("category") ?? CATALOG_FILTER_ALL;
  const brand = searchParams.get("brand") ?? CATALOG_FILTER_ALL;

  const categoryOptions = filterCatalogCategoryOptions(categories);
  const brandOptions = filterCatalogBrandOptions(brands);

  const push = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === CATALOG_FILTER_ALL) params.delete(key);
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

  const hasFilters =
    q || category !== CATALOG_FILTER_ALL || (showBrandFilter && brand !== CATALOG_FILTER_ALL);

  return (
    <div className="mb-10 w-full min-w-0 space-y-4">
      <form onSubmit={onSearch} className="mx-auto w-full min-w-0 max-w-2xl">
        <div className="catalog-search-field input-field relative w-full min-w-0 overflow-hidden !p-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-brand-400 sm:left-4 sm:h-5 sm:w-5"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="catalog-search-input relative z-0 w-full min-w-0 max-w-full border-0 border-transparent bg-transparent py-3 pl-9 pr-[4.85rem] text-sm shadow-none outline-none ring-0 appearance-none focus:border-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 sm:py-4 sm:pl-12 sm:pr-24 sm:text-base"
          />
          <button
            type="submit"
            className="btn-primary absolute right-0 top-0 z-[2] flex h-full items-center whitespace-nowrap px-2.5 text-[10px] leading-none tracking-normal sm:px-4 sm:text-xs"
          >
            Rechercher
          </button>
        </div>
      </form>

      <div className="flex min-w-0 flex-wrap gap-3 justify-center items-center">
        <FilterSelect
          className="input-field w-auto max-w-[9.25rem] text-xs sm:max-w-[10.5rem]"
          value={category}
          allValue={CATALOG_FILTER_ALL}
          allLabel={allCategoryLabel}
          aria-label={allCategoryLabel}
          onValueChange={(v) => push({ category: v === CATALOG_FILTER_ALL ? null : v })}
        >
          {categoryOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {categoryOptionLabel(c.name, c.depth ?? 0)}
            </option>
          ))}
        </FilterSelect>

        {showBrandFilter && (
          <FilterSelect
            className="input-field w-auto max-w-[9.25rem] text-xs sm:max-w-[10.5rem]"
            value={brand}
            allValue={CATALOG_FILTER_ALL}
            allLabel={allBrandLabel}
            aria-label={allBrandLabel}
            onValueChange={(v) => push({ brand: v === CATALOG_FILTER_ALL ? null : v })}
          >
            {brandOptions.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </FilterSelect>
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
          {category !== CATALOG_FILTER_ALL && (
            <> · {categoryOptions.find((c) => c.slug === category)?.name}</>
          )}
          {showBrandFilter && brand !== CATALOG_FILTER_ALL && (
            <> · {brandOptions.find((b) => b.slug === brand)?.name}</>
          )}
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
