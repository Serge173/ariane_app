import Link from "next/link";
import { coachingImage } from "@/lib/images";
import { formatPublicPrice } from "@/lib/shop/public-price";
import { fetchActiveServiceProducts } from "@/lib/shop/catalog-products";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

export async function OffersGrid({ compact = false }: { compact?: boolean }) {
  const products = await fetchActiveServiceProducts();

  return (
    <StaggerReveal
      className={
        compact
          ? "grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 w-full min-w-0"
          : "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 w-full min-w-0"
      }
    >
      {products.map((product) => {
        const priceLabel = formatPublicPrice(product.price, {
          prefix: product.slug === "sur-mesure" ? "Dès " : "",
        });
        return (
        <Link
          key={product.id}
          href={product.slug === "sur-mesure" ? "/contact?type=diagnostic" : `/offres/${product.slug}`}
          className="group card-premium overflow-hidden min-w-0 w-full"
        >
          <div className="relative aspect-square sm:aspect-[3/4] product-frame">
            <ProductImage
              src={product.images[0]}
              fallback={coachingImage(product.slug)}
              alt={product.name}
              fill
              className="product-frame__image"
              sizes="(max-width: 640px) 46vw, 25vw"
            />
            <div className="product-frame__overlay" aria-hidden />
            <span className="product-frame__label hidden sm:flex">Voir</span>
            {"isFeatured" in product && product.isFeatured && (
              <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-brand-950 text-white text-[8px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 sm:px-3 sm:py-1">
                Populaire
              </span>
            )}
          </div>
          <div className="p-2.5 sm:p-6 min-w-0">
            <h3 className="font-sans text-sm sm:text-xl font-medium tracking-tight text-brand-950 mb-1 sm:mb-2 truncate">
              {product.name}
            </h3>
            <p className="hidden sm:block font-sans text-sm text-brand-600 leading-relaxed mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="flex items-center justify-between gap-1 min-w-0">
              {priceLabel ? (
                <span className="text-[10px] sm:text-sm font-medium truncate">{priceLabel}</span>
              ) : (
                <span className="flex-1 min-w-0" />
              )}
              <ArrowRight className="hidden sm:block w-4 h-4 text-brand-400 shrink-0" strokeWidth={1.5} />
            </div>
          </div>
        </Link>
        );
      })}
    </StaggerReveal>
  );
}
