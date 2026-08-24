"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { luxeImage } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";

export interface BoutiqueProduct {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  shortDescription: string | null;
  price: number;
  images: string[];
  isFeatured?: boolean;
  categorySlug?: string;
  categoryName?: string;
}

interface BoutiqueCatalogProps {
  products: BoutiqueProduct[];
  categories: { slug: string; name: string }[];
  hideCategoryFilter?: boolean;
}

export function BoutiqueCatalog({ products, categories, hideCategoryFilter }: BoutiqueCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    hideCategoryFilter || activeCategory === "all"
      ? products
      : products.filter((p) => p.categorySlug === activeCategory);

  return (
    <>
      {categories.length > 0 && !hideCategoryFilter && (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
              activeCategory === "all"
                ? "bg-brand-950 text-white border-brand-950"
                : "border-brand-200 text-brand-600 hover:border-brand-950"
            }`}
          >
            Tout voir
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
                activeCategory === cat.slug
                  ? "bg-brand-950 text-white border-brand-950"
                  : "border-brand-200 text-brand-600 hover:border-brand-950"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filtered.map((product) => (
          <BoutiqueProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-brand-500 py-16">Aucun article dans cette catégorie.</p>
      )}
    </>
  );
}

function BoutiqueProductCard({ product }: { product: BoutiqueProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      productType: "LUXE",
      image: product.images[0],
    });
    if (!result.ok) {
      setError("Votre panier contient un accompagnement. Videz-le ou finalisez-le avant d'ajouter des articles.");
      return;
    }
    setError("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const href = `/boutique/${product.slug}`;

  return (
    <article className="group card-premium overflow-hidden flex flex-col">
      <Link href={href} className="block relative aspect-[3/4] overflow-hidden bg-brand-100">
        <ProductImage
          src={product.images[0]}
          fallback={luxeImage(product.slug)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {product.isFeatured && (
          <span className="absolute top-4 left-4 bg-brand-950 text-white text-[10px] uppercase tracking-widest px-3 py-1">
            Exclusif
          </span>
        )}
        {product.categoryName && (
          <span className="absolute top-4 right-4 bg-white/90 text-brand-700 text-[10px] uppercase tracking-widest px-3 py-1">
            {product.categoryName}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-1">{product.brand}</p>
        )}
        <Link href={href}>
          <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-brand-500 mb-4 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>
        <p className="text-sm font-medium mb-4">{formatPrice(product.price)}</p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAdd}
            className="btn-primary flex-1 text-[10px] py-2.5 inline-flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {added ? "Ajouté ✓" : "Ajouter"}
          </button>
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
