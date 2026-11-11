import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicCategoryTreeNode } from "@/lib/categories";

const AUDIENCE_ORDER = ["particuliers", "entreprises"] as const;

const HUB_SUBTITLE: Record<(typeof AUDIENCE_ORDER)[number], string> = {
  particuliers: "Formules & coaching",
  entreprises: "Entreprises & équipes",
};

export function OffersHubChooser({ roots }: { roots: PublicCategoryTreeNode[] }) {
  const ordered = AUDIENCE_ORDER.map((slug) => roots.find((r) => r.slug === slug)).filter(
    (r): r is PublicCategoryTreeNode => r != null
  );

  if (ordered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
      {ordered.map((root) => (
        <Link
          key={root.slug}
          href={`/offres?category=${root.slug}`}
          className="offres-hub-card group flex flex-col justify-between min-h-[12rem] p-8 border"
        >
          <div>
            <p className="text-overline mb-3">{root.name}</p>
            <p className="font-display text-2xl sm:text-3xl mb-3 leading-tight">
              {HUB_SUBTITLE[root.slug as (typeof AUDIENCE_ORDER)[number]] ?? root.name}
            </p>
            {root.description ? (
              <p className="text-sm leading-relaxed max-w-md">{root.description}</p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mt-8 group-hover:gap-3 transition-all">
            Explorer
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </span>
        </Link>
      ))}
    </div>
  );
}
