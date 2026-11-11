"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatPublicPrice, hasPublicPrice } from "@/lib/shop/public-price";
import { useCartStore } from "@/lib/store/cart";
import { luxeImage } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import { filterCatalogCategoryOptions } from "@/lib/categories";

export interface BoutiqueProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  shortDescription: string | null;
  price: number | null;
  images: string[];
  isFeatured?: boolean;
  categorySlug?: string;
  categoryName?: string;
  hasVariants?: boolean;
  fromPrice?: boolean;
}

interface BoutiqueCatalogProps {
  products: BoutiqueProduct[];
  categories: { slug: string; name: string }[];
  hideCategoryFilter?: boolean;
  variant?: "default" | "lancel" | "wix";
}

export function BoutiqueCatalog({
  products,
  categories,
  hideCategoryFilter,
  variant = "wix",
}: BoutiqueCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const categoryFilters = filterCatalogCategoryOptions(categories);

  const filtered =
    hideCategoryFilter || activeCategory === "all"
      ? products
      : products.filter((p) => p.categorySlug === activeCategory);

  return (
    <>
      {categoryFilters.length > 0 && !hideCategoryFilter && (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="px-5 py-2.5 text-xs uppercase tracking-widest border rounded-full transition-colors border-brand-300/60 text-brand-600 hover:border-accent/60 bg-white"
            >
              Tout voir
            </button>
          )}
          {categoryFilters.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest border rounded-full transition-colors ${
                activeCategory === cat.slug
                  ? "bg-accent text-white border-accent"
                  : "border-brand-300/60 text-brand-600 hover:border-accent/60 bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div
        className={
          variant === "wix"
            ? "grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14"
            : variant === "lancel"
            ? "grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 lg:gap-x-4 lg:gap-y-12"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        }
      >
        {filtered.map((product) => (
          <BoutiqueProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-brand-500 public-card py-14 px-6">Aucun article dans cette catégorie.</p>
      )}
    </>
  );
}

function BoutiqueProductCard({
  product,
  variant = "wix",
}: {
  product: BoutiqueProduct;
  variant?: "default" | "lancel" | "wix";
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [error, setError] = useState("");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.hasVariants || !hasPublicPrice(product.price)) return;
    const result = addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price!,
      quantity: 1,
      productType: "LUXE",
      image: product.images[0],
    });
    if (!result.ok) {
      setError("Votre panier contient un accompagnement. Videz-le ou finalisez-le avant d'ajouter des articles.");
      return;
    }
    setError("");
  };

  const href = `/boutique/${product.slug}`;
  const priceLabel = formatPublicPrice(product.price, {
    prefix: product.fromPrice ? "À partir de " : "",
  });

  if (variant === "wix") {
    return (
      <article className="group text-center">
        <Link
          href={href}
          className="block relative aspect-[3/4] product-frame mb-4 rounded-2xl overflow-hidden border border-brand-300/45 bg-white shadow-[0_8px_28px_-18px_rgba(40,36,31,0.2)]"
        >
          <ProductImage
            src={product.images[0]}
            fallback={luxeImage(product.slug)}
            alt={product.name}
            fill
            className="product-frame__image"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="product-frame__overlay" aria-hidden />
          <span className="product-frame__label">Voir</span>
        </Link>
        <Link href={href}>
          <h3 className="font-sans text-sm text-brand-950 mb-1 line-clamp-2 group-hover:opacity-70 transition-opacity">
            {product.name}
          </h3>
        </Link>
        {priceLabel && <p className="font-sans text-sm text-brand-600">{priceLabel}</p>}
      </article>
    );
  }

  if (variant === "lancel") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] product-frame mb-3">
          <ProductImage
            src={product.images[0]}
            fallback={luxeImage(product.slug)}
            alt={product.name}
            fill
            className="product-frame__image"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="product-frame__overlay" aria-hidden />
          <span className="product-frame__label">Voir</span>
        </div>
        {product.brand && (
          <p className="font-sans text-[10px] uppercase tracking-widest text-brand-400 mb-1 truncate">
            {product.brand}
          </p>
        )}
        <h3 className="font-sans text-sm text-brand-950 mb-1 line-clamp-2 group-hover:underline underline-offset-2">
          {product.name}
        </h3>
        {priceLabel && <p className="font-sans text-sm text-brand-700">{priceLabel}</p>}
      </Link>
    );
  }

  return (
    <article className="group card-premium overflow-hidden flex flex-col">
      <Link href={href} className="block relative aspect-[3/4] product-frame">
        <ProductImage
          src={product.images[0]}
          fallback={luxeImage(product.slug)}
          alt={product.name}
          fill
          className="product-frame__image"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="product-frame__overlay" aria-hidden />
        <span className="product-frame__label">Voir</span>
        {product.isFeatured && (
          <span className="absolute top-4 left-4 z-10 bg-brand-950 text-white text-[10px] uppercase tracking-widest px-3 py-1">
            Exclusif
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-1">{product.brand}</p>
        )}
        <Link href={href}>
          <h3 className="product-title mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="product-description mb-4 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>
        {priceLabel && <p className="text-sm font-medium mb-4">{priceLabel}</p>}

        <div className="flex gap-2 mt-auto">
          {hasPublicPrice(product.price) && !product.hasVariants && (
          <button
            onClick={handleAdd}
            className="btn-primary flex-1 text-[10px] py-2.5 inline-flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ajouter
          </button>
          )}
          <Link
            href={href}
            className="btn-secondary px-4 text-[10px] py-2.5 inline-flex items-center justify-center"
            aria-label="Voir l'article"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {error && <p className="text-[10px] text-red-600 mt-2">{error}</p>}
      </div>
    </article>
  );
}
