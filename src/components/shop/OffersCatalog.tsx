import Link from "next/link";
import { coachingImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { formatCategoryLabel } from "@/lib/categories";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

export interface OfferProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  images: string[];
  isFeatured?: boolean;
  categoryName?: string;
}

interface OffersCatalogProps {
  products: OfferProduct[];
}

export function OffersCatalog({ products }: OffersCatalogProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-brand-500 py-16">
        Aucun accompagnement dans cette catégorie pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={product.slug === "sur-mesure" ? "/contact?type=diagnostic" : `/offres/${product.slug}`}
          className="group card-premium overflow-hidden"
        >
          <div className="relative aspect-[3/4] product-frame">
            <ProductImage
              src={product.images[0]}
              fallback={coachingImage(product.slug)}
              alt={product.name}
              fill
              className="product-frame__image"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="product-frame__overlay" aria-hidden />
            <span className="product-frame__label">Voir</span>
            {product.isFeatured && (
              <span className="absolute top-4 left-4 z-10 bg-brand-950 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                Populaire
              </span>
            )}
          </div>
          <div className="p-6">
            <h3 className="product-title mb-2">
              {product.name}
            </h3>
            <p className="product-description mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {product.slug === "sur-mesure" ? "À partir de " : ""}
                {formatPrice(product.price)}
              </span>
              <ArrowRight className="w-4 h-4 text-brand-400" strokeWidth={1.5} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function mapDbOfferProducts(
  products: {
    id: string;
    slug: string;
    name: string;
    shortDescription: string | null;
    price: number;
    images: string[];
    isFeatured: boolean;
    category: { name: string; parent?: { name: string } | null };
  }[]
): OfferProduct[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    images: p.images,
    isFeatured: p.isFeatured,
    categoryName: formatCategoryLabel(p.category),
  }));
}
