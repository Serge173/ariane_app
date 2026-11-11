"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  isAggregateCatalogCategory,
  type PublicCategoryTreeNode,
} from "@/lib/categories";
import { SHOPPING_LINE_OPTIONS, shoppingHref } from "@/lib/shopping";
import { cn } from "@/lib/utils";

interface BoutiqueSubNavProps {
  roots: PublicCategoryTreeNode[];
}

export function BoutiqueSubNav({ roots }: BoutiqueSubNavProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const activeQ = searchParams.get("q");
  const activeLine = searchParams.get("line");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState(activeQ ?? "");

  const flatLinks: { slug: string | null; name: string }[] = [];
  const seenSlugs = new Set<string>();
  const pushLink = (slug: string | null, name: string) => {
    const key = slug ?? "__all__";
    if (seenSlugs.has(key)) return;
    seenSlugs.add(key);
    flatLinks.push({ slug, name });
  };

  const isCatalogAll = !activeCategory && !activeQ && !activeBrand;
  if (!isCatalogAll) {
    pushLink(null, "Tout voir");
  }
  for (const root of roots) {
    if (!isAggregateCatalogCategory(root)) pushLink(root.slug, root.name);
    for (const child of root.children) {
      if (!isAggregateCatalogCategory(child)) pushLink(child.slug, child.name);
    }
  }

  const hrefFor = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug) params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    return qs ? `/boutique?${qs}` : "/boutique";
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.push(`/boutique?${params.toString()}`);
    setSearchOpen(false);
  };

  const isActive = (slug: string | null) =>
    slug === null ? !activeCategory && !activeQ && !activeBrand : activeCategory === slug;

  return (
    <div className="sticky top-14 sm:top-16 lg:top-[4.25rem] z-30 bg-surface-cream/95 backdrop-blur-md border-b border-brand-300/50 -mx-4 px-4 sm:mx-0 sm:px-0 mt-4 sm:mt-6">
      <div className="max-w-[1600px] mx-auto lg:px-2">
        <div className="flex items-center gap-4 py-2 border-b border-brand-300/40">
          {SHOPPING_LINE_OPTIONS.map(({ name, line }) => (
            <Link
              key={line}
              href={shoppingHref(line)}
              className={cn(
                "font-sans text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors pb-0.5 border-b-2",
                activeLine === line
                  ? "text-accent border-accent"
                  : "text-brand-500 border-transparent hover:text-brand-950"
              )}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 h-12">
          <nav
            className="flex items-center gap-5 overflow-x-auto scrollbar-hide flex-1 min-w-0"
            aria-label="Catégories boutique"
          >
            {flatLinks.map((link) => (
              <Link
                key={link.slug ?? "all"}
                href={hrefFor(link.slug)}
                className={`font-sans text-[11px] uppercase tracking-widest whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
                  isActive(link.slug)
                    ? "text-accent border-accent"
                    : "text-brand-500 border-transparent hover:text-brand-950"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="shrink-0 p-2 text-brand-600 hover:text-brand-950 transition-colors"
            aria-label="Rechercher"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {searchOpen && (
          <form onSubmit={onSearch} className="pb-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher..."
              autoFocus
              className="w-full max-w-md font-sans text-sm border border-brand-300/70 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </form>
        )}
      </div>
    </div>
  );
}
