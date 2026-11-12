import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicCategoryTreeNode } from "@/lib/categories";
import type { OffersAudienceHubSettings } from "@/lib/public-pages-settings";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";

const AUDIENCE_ORDER = ["particuliers", "entreprises"] as const;

type AudienceSlug = (typeof AUDIENCE_ORDER)[number];

export function OffersHubChooser({
  roots,
  audienceHub,
}: {
  roots: PublicCategoryTreeNode[];
  audienceHub: OffersAudienceHubSettings;
}) {
  const rootsBySlug = Object.fromEntries(roots.map((r) => [r.slug, r])) as Partial<
    Record<AudienceSlug, PublicCategoryTreeNode>
  >;

  return (
    <div className="offres-hub-grid grid grid-cols-2 gap-3 sm:gap-6 lg:gap-5 mb-6 w-full lg:max-w-3xl lg:mx-auto xl:max-w-4xl">
      {AUDIENCE_ORDER.map((slug, index) => {
        const root = rootsBySlug[slug];
        const card = audienceHub[slug];
        const eyebrow = card.eyebrow || root?.name || slug;
        const description = card.description.trim() || root?.description || "";
        const exploreLabel = `Explorer les offres ${eyebrow}`;

        return (
          <Link
            key={slug}
            href={`/offres?category=${slug}`}
            aria-label={exploreLabel}
            className="offres-hub-tile group relative block overflow-hidden rounded-xl sm:rounded-2xl border border-black/10 aspect-[3/4] sm:aspect-[5/4] lg:aspect-[4/3] min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <ProductImage
              src={card.image}
              fallback={slug === "particuliers" ? IMAGES.coaching.gold : IMAGES.coaching.platinum}
              alt={card.imageAlt || eyebrow}
              fill
              fit="cover"
              priority={index < 2}
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 42vw, 320px"
              className="offres-hub-tile__image transition-transform duration-700 ease-[var(--ease-couture, ease-out)] group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 offres-hub-tile__scrim pointer-events-none"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-8 lg:p-6 text-white z-10 offres-hub-tile__body">
              <h2 className="offres-hub-tile__audience font-display text-lg sm:text-3xl lg:text-2xl font-bold leading-tight text-white mb-1 sm:mb-3 lg:mb-2 line-clamp-2">
                {eyebrow}
              </h2>
              <p className="offres-hub-tile__heading font-display text-sm sm:text-3xl lg:text-xl font-light leading-snug sm:leading-tight text-white mb-1 sm:mb-3 lg:mb-2 line-clamp-2">
                {card.title}
              </p>
              {description ? (
                <p className="offres-hub-tile__desc text-[11px] sm:text-[0.95rem] lg:text-sm leading-relaxed text-white/90 max-w-md line-clamp-2 sm:line-clamp-3 lg:line-clamp-2">
                  {description}
                </p>
              ) : null}
              <span className="offres-hub-tile__cta inline-flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] mt-2 sm:mt-8 lg:mt-4 text-white group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                <span className="line-clamp-1">{card.ctaLabel}</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
