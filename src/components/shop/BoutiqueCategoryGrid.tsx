"use client";

import Link from "next/link";
import type { PublicCategoryTreeNode } from "@/lib/categories";

interface CatalogCategoryGridProps {
  roots: PublicCategoryTreeNode[];
  activeSlug?: string;
  basePath?: string;
}

export function CatalogCategoryGrid({
  roots,
  activeSlug,
  basePath = "/boutique",
}: CatalogCategoryGridProps) {
  if (roots.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 overflow-visible">
      {roots.map((root) => {
        const isActive = activeSlug === root.slug;
        const hasActiveChild = root.children.some((c) => c.slug === activeSlug);

        return (
          <div
            key={root.slug}
            className={`group relative border bg-brand-50/50 transition-colors ${
              root.children.length > 0 ? "mb-6" : ""
            } ${
              isActive || hasActiveChild
                ? "border-brand-950 ring-1 ring-brand-950"
                : "border-brand-100"
            }`}
          >
            <Link
              href={`${basePath}?category=${root.slug}`}
              className="block text-center p-5 hover:bg-brand-50 transition-colors"
            >
              <p className="text-overline mb-1">{root.name}</p>
              {root.description && (
                <p className="text-xs text-brand-500 line-clamp-2">{root.description}</p>
              )}
              {root.children.length > 0 && (
                <p className="hidden md:block text-[10px] text-brand-400 mt-2 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Survoler pour voir les sous-catégories
                </p>
              )}
            </Link>

            {root.children.length > 0 && (
              <>
                <div className="absolute left-0 right-0 top-full h-2 z-10 hidden group-hover:block" aria-hidden />
                <div
                  className={`absolute left-0 right-0 top-full z-20 pt-1 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto ${
                    hasActiveChild
                      ? "opacity-100 visible translate-y-0 pointer-events-auto"
                      : "opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                  }`}
                >
                  <div className="border border-brand-100 bg-white shadow-lg px-3 py-2 flex flex-wrap gap-1.5 justify-center">
                    {root.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`${basePath}?category=${child.slug}`}
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                          activeSlug === child.slug
                            ? "bg-brand-950 text-white border-brand-950"
                            : "bg-white text-brand-600 border-brand-200 hover:border-brand-950 hover:bg-brand-50"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** @deprecated Utiliser CatalogCategoryGrid */
export function BoutiqueCategoryGrid({
  roots,
  activeSlug,
}: {
  roots: PublicCategoryTreeNode[];
  activeSlug?: string;
}) {
  return <CatalogCategoryGrid roots={roots} activeSlug={activeSlug} basePath="/boutique" />;
}
