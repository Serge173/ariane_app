"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { luxeImage } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import type { BoutiqueProduct } from "@/components/shop/BoutiqueCatalog";

export function BoutiqueFeaturedRow({ products }: { products: BoutiqueProduct[] }) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section className="mb-14 lg:mb-20">
      <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-500 text-center mb-8">
        Sélection
      </h2>
      <div className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {featured.map((product) => (
          <Link
            key={product.id}
            href={`/boutique/${product.slug}`}
            className="group shrink-0 w-[42vw] sm:w-[28vw] lg:w-[22vw] max-w-[280px]"
          >
            <div className="relative aspect-[3/4] product-frame mb-3">
              <ProductImage
                src={product.images[0]}
                fallback={luxeImage(product.slug)}
                alt={product.name}
                fill
                className="product-frame__image"
                sizes="280px"
              />
              <div className="product-frame__overlay" aria-hidden />
              <span className="product-frame__label">Voir</span>
            </div>
            {product.brand && (
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-400 mb-1 truncate">
                {product.brand}
              </p>
            )}
            <p className="font-sans text-sm text-brand-950 mb-1 line-clamp-2 group-hover:underline underline-offset-2">
              {product.name}
            </p>
            <p className="font-sans text-sm text-brand-700">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
