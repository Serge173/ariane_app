import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Crown,
  Diamond,
  FileText,
} from "lucide-react";
import { PersonalShoppingBanner } from "@/components/home/PersonalShoppingBanner";
import type { PersonalShoppingSettings } from "@/lib/homepage-settings";
import { OfferHangerIcon } from "@/components/offres/OfferMaquetteIcons";
import { ProductImage } from "@/components/ui/ProductImage";
import { coachingImage } from "@/lib/images";
import {
  getOfferHeroScopeLine,
  resolveOfferDescription,
} from "@/lib/offer-forfait-content";
import { pickOfferFeatureIcon } from "@/lib/offer-feature-icons";
import { OfferForfaitBreadcrumb } from "@/components/offres/OfferForfaitBreadcrumb";
import type { ServiceAudienceSlug } from "@/lib/categories";
export interface OfferForfaitProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  duration?: string | null;
  images: string[];
}

interface OfferForfaitDetailProps {
  product: OfferForfaitProduct;
  slug: string;
  isSurMesure: boolean;
  personalShopping: PersonalShoppingSettings;
  audienceSlug?: ServiceAudienceSlug | null;
  audienceLabel?: string | null;
}

export function OfferForfaitDetail({
  product,
  slug,
  isSurMesure,
  personalShopping,
  audienceSlug = null,
  audienceLabel = null,
}: OfferForfaitDetailProps) {
  const scopeLine = getOfferHeroScopeLine(slug);
  const showCrown = slug === "platinum";
  const durationLabel = product.duration?.trim() ? `Durée : ${product.duration}` : null;
  const descriptionBody = resolveOfferDescription(
    product.description,
    product.features,
    product.shortDescription
  );

  return (
    <div className="offres-forfait-page min-h-screen w-full pt-20 lg:pt-24 pb-16 lg:pb-24">
      <section className="offer-forfait-hero relative mb-12 lg:mb-16">
        <div className="container-premium relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
            <div className="order-2 lg:order-1 min-w-0">
              <OfferForfaitBreadcrumb
                audienceSlug={audienceSlug}
                audienceLabel={audienceLabel}
                productName={product.name}
              />
              <span className="offer-forfait-badge inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-medium text-brand-800 mb-5">
                <Diamond className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={1.5} />
                Accompagnement
              </span>

              <div className="relative mb-4">
                {showCrown && (
                  <Crown
                    className="absolute -top-1 left-[4.5rem] sm:left-[5.5rem] w-7 h-7 text-accent/80 hidden sm:block"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                )}
                <h1 className="heading-display text-brand-950 pr-4">{product.name}</h1>
              </div>

              {product.shortDescription.trim() && (
                <p className="font-display text-lg sm:text-xl font-light italic text-brand-800 leading-snug mb-8 max-w-xl">
                  {product.shortDescription.trim()}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-8">
                {durationLabel && (
                  <div className="offer-forfait-meta-pill flex items-center gap-2.5 rounded-xl border border-brand-200 bg-white px-3.5 py-3">
                    <Clock className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
                    <span className="text-xs sm:text-sm text-brand-900 leading-snug">{durationLabel}</span>
                  </div>
                )}
                <div className="offer-forfait-meta-pill flex items-center gap-2.5 rounded-xl border border-brand-200 bg-white px-3.5 py-3">
                  <OfferHangerIcon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="text-xs sm:text-sm text-brand-900 leading-snug line-clamp-2">
                    {scopeLine}
                  </span>
                </div>
              </div>

              <div className="max-w-md">
                {isSurMesure ? (
                  <Link
                    href="/contact?type=diagnostic"
                    className="btn-primary inline-flex items-center justify-center gap-2 w-full py-3.5"
                  >
                    Demander mon diagnostic
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/reservation?product=${product.slug}`}
                    className="btn-primary inline-flex items-center justify-center gap-2 w-full py-3.5"
                  >
                    <Calendar className="w-4 h-4" />
                    Réserver directement
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="offer-forfait-hero-photo relative w-full max-w-md lg:max-w-none lg:w-full aspect-[4/5] max-h-[min(72vh,640px)] overflow-hidden">
                <ProductImage
                  src={product.images[0]}
                  fallback={coachingImage(slug, 1200)}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-premium space-y-12 lg:space-y-16">
        {descriptionBody && (
          <section className="max-w-4xl">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <h2 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-brand-950 shrink-0">
                Description
              </h2>
              <span className="hidden sm:block flex-1 h-px bg-brand-200" aria-hidden />
            </div>
            <p className="text-base leading-relaxed text-brand-800 max-w-3xl">{descriptionBody}</p>
          </section>
        )}

        {product.features.length > 0 && (
          <section>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {product.features.map((feature, index) => {
                const Icon = pickOfferFeatureIcon(feature, index);
                return (
                  <li
                    key={`${feature}-${index}`}
                    className="offer-forfait-feature-card flex flex-col items-center text-center rounded-2xl border border-brand-200 bg-white px-3 py-5 sm:px-4 sm:py-6 min-h-[8.5rem]"
                  >
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-brand-100 bg-brand-50 mb-3">
                      <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    </span>
                    <span className="text-[11px] sm:text-xs leading-snug text-brand-900 font-medium">
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

      </div>

      <PersonalShoppingBanner settings={personalShopping} />
    </div>
  );
}
