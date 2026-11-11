import Link from "next/link";
import type { PublicCategoryTreeNode } from "@/lib/categories";
import { cn } from "@/lib/utils";

const AUDIENCE_ORDER = ["particuliers", "entreprises"];

export function OffersAudienceNav({
  roots,
  activeSlug,
}: {
  roots: PublicCategoryTreeNode[];
  activeSlug?: string;
}) {
  const ordered = AUDIENCE_ORDER.map((slug) => roots.find((r) => r.slug === slug)).filter(
    (r): r is PublicCategoryTreeNode => r != null
  );

  if (ordered.length === 0) return null;

  return (
    <nav className="offres-audience-nav" aria-label="Type d'accompagnement">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {ordered.map((root) => {
          const isActive = activeSlug === root.slug;
          return (
            <Link
              key={root.slug}
              href={`/offres?category=${root.slug}`}
              className={cn(
                "offres-audience-pill group block text-left p-5 sm:p-6 border transition-colors",
                isActive ? "offres-audience-pill--active" : "offres-audience-pill--idle"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <p className="text-overline mb-2">{root.name}</p>
              {root.description ? (
                <p className="text-sm leading-relaxed opacity-90">{root.description}</p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
