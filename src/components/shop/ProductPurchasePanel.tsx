"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { formatPublicPrice, hasPublicPrice } from "@/lib/shop/public-price";
import { useCartStore } from "@/lib/store/cart";
import type { ShopVariant } from "@/lib/shop/variants";
import { productDisplayPrice, variantInStock } from "@/lib/shop/variants";
import { ProductVariantSelector } from "@/components/shop/ProductVariantSelector";

interface ProductPurchasePanelProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number | null;
    compareAtPrice?: number | null;
    image?: string;
  };
  variants: ShopVariant[];
}

export function ProductPurchasePanel({ product, variants }: ProductPurchasePanelProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [error, setError] = useState("");

  const defaultVariant = useMemo(() => {
    const inStock = variants.filter((v) => v.isActive && variantInStock(v));
    return inStock[0]?.id ?? variants[0]?.id ?? null;
  }, [variants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariant);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const pricing = selectedVariant
    ? {
        price: selectedVariant.price ?? product.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        fromPrice: false,
      }
    : productDisplayPrice(product.price, variants);

  const priceLabel = formatPublicPrice(pricing.price, {
    prefix: pricing.fromPrice ? "À partir de " : "",
  });

  const requiresVariant = variants.length > 0;
  const canAdd =
    hasPublicPrice(pricing.price) &&
    (!requiresVariant || Boolean(selectedVariant)) &&
    (!selectedVariant || variantInStock(selectedVariant));

  const handleAdd = () => {
    if (!canAdd) {
      setError(requiresVariant ? "Choisissez une taille et une couleur disponibles." : "Article indisponible.");
      return;
    }

    const price = selectedVariant?.price ?? product.price;
    if (!hasPublicPrice(price)) return;
    const result = addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: price!,
      quantity: 1,
      productType: "LUXE",
      image: product.image,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant?.name,
      sku: selectedVariant?.sku ?? undefined,
    });

    if (!result.ok) {
      setError(
        "Votre panier contient un accompagnement. Finalisez-le ou videz le panier avant d'ajouter des articles boutique."
      );
      return;
    }
    setError("");
  };

  return (
    <div>
      {priceLabel && (
      <div className="flex items-baseline gap-3 mb-8">
        <p className="text-2xl font-light">{priceLabel}</p>
        {pricing.compareAtPrice != null &&
          pricing.price != null &&
          pricing.compareAtPrice > pricing.price && (
          <p className="text-sm text-brand-400 line-through">{formatPrice(pricing.compareAtPrice)}</p>
        )}
      </div>
      )}

      {variants.length > 0 && (
        <div className="mb-8">
          <ProductVariantSelector
            variants={variants}
            selectedId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" />
          Ajouter au panier
        </button>
        <Link href="/panier" className="btn-secondary text-center inline-flex items-center justify-center">
          Voir le panier
        </Link>
      </div>
      {error && <p className="text-xs text-red-600 mb-4 max-w-sm">{error}</p>}
      {selectedVariant?.sku && (
        <p className="text-[10px] uppercase tracking-widest text-brand-400">Réf. {selectedVariant.sku}</p>
      )}
    </div>
  );
}
