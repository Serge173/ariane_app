import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicCategoryTreeNode } from "@/lib/categories";
import { cn } from "@/lib/utils";

const AUDIENCE_ORDER = ["particuliers", "entreprises"] as const;

export function OffersAudienceBar({
  roots,
  activeSlug,
  searchQuery,
}: {
  roots: PublicCategoryTreeNode[];
  activeSlug?: string;
  searchQuery?: string;
}) {
  const ordered = AUDIENCE_ORDER.map((slug) => roots.find((r) => r.slug === slug)).filter(
    (r): r is PublicCategoryTreeNode => r != null
  );

  if (ordered.length === 0) return null;

  const q = searchQuery?.trim();
  const hrefFor = (slug: string) => {
    const params = new URLSearchParams({ category: slug });
    if (q) params.set("q", q);
    return `/offres?${params.toString()}`;
  };

  return (
    <div className="offres-audience-bar mb-8 sm:mb-10">
      <Link
        href="/offres"
        className="offres-audience-bar__back inline-flex items-center gap-2 text-xs sm:text-sm text-brand-600 hover:text-brand-950 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} aria-hidden />
        Toutes les offres
      </Link>
      <div
        className="offres-audience-bar__tabs flex flex-wrap gap-2 sm:gap-3 max-w-2xl mx-auto sm:max-w-none sm:justify-center"
        role="tablist"
        aria-label="Type d'accompagnement"
      >
        {ordered.map((root) => {
          const isActive = activeSlug === root.slug;
          return (
            <Link
              key={root.slug}
              href={hrefFor(root.slug)}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "offres-audience-tab rounded-full border px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors",
                isActive
                  ? "offres-audience-pill--active offres-audience-tab--active border-transparent"
                  : "offres-audience-pill--idle offres-audience-tab--idle"
              )}
            >
              {root.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
