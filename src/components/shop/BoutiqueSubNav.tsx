"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import type { PublicCategoryTreeNode } from "@/lib/categories";

interface BoutiqueSubNavProps {
  roots: PublicCategoryTreeNode[];
}

export function BoutiqueSubNav({ roots }: BoutiqueSubNavProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const activeQ = searchParams.get("q");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState(activeQ ?? "");

  const flatLinks: { slug: string | null; name: string }[] = [
    { slug: null, name: "Tout voir" },
    ...roots.flatMap((root) => [
      { slug: root.slug, name: root.name },
      ...root.children.map((c) => ({ slug: c.slug, name: c.name })),
    ]),
  ];

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
    <div className="sticky top-16 lg:top-[4.25rem] z-40 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-brand-200/60 mt-6">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
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
                    ? "text-brand-950 border-brand-950"
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
              className="w-full max-w-md font-sans text-sm border-b border-brand-300 py-2 bg-transparent focus:outline-none focus:border-brand-950"
            />
          </form>
        )}
      </div>
    </div>
  );
}
