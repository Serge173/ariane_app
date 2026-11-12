import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function OfferForfaitBreadcrumb({
  audienceSlug,
  audienceLabel,
  productName,
}: {
  audienceSlug?: "particuliers" | "entreprises" | null;
  audienceLabel?: string | null;
  productName: string;
}) {
  return (
    <nav
      className="offer-forfait-breadcrumb flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-brand-600 mb-6 max-w-xl"
      aria-label="Fil d'Ariane"
    >
      <Link href="/offres" className="hover:text-brand-950 transition-colors">
        Offres
      </Link>
      {audienceSlug && audienceLabel ? (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" aria-hidden />
          <Link
            href={`/offres?category=${audienceSlug}`}
            className="hover:text-brand-950 transition-colors"
          >
            {audienceLabel}
          </Link>
        </>
      ) : null}
      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" aria-hidden />
      <span className="text-brand-900 truncate" aria-current="page">
        {productName}
      </span>
    </nav>
  );
}
