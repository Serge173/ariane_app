"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { formatPublicPrice, hasPublicPrice } from "@/lib/shop/public-price";
import { useCartStore } from "@/lib/store/cart";
import type { ShopVariant } from "@/lib/shop/variants";
import {
  firstPurchasableVariantId,
  productDisplayPrice,
  resolveVariantLinePrice,
  variantInStock,
} from "@/lib/shop/variants";
import { ProductVariantSelector } from "@/components/shop/ProductVariantSelector";
import { cn } from "@/lib/utils";

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

function compareAtForVariant(
  variant: ShopVariant | null,
  productCompare: number | null | undefined
): number | null {
  if (variant?.compareAtPrice != null) return variant.compareAtPrice;
  return productCompare ?? null;
}

export function ProductPurchasePanel({ product, variants }: ProductPurchasePanelProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [error, setError] = useState("");

  const defaultVariantId = useMemo(() => firstPurchasableVariantId(variants), [variants]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId);

  useEffect(() => {
    if (!selectedVariantId || !variants.some((v) => v.id === selectedVariantId)) {
      setSelectedVariantId(defaultVariantId);
    }
  }, [defaultVariantId, selectedVariantId, variants]);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const requiresVariant = variants.length > 0;

  const linePrice = resolveVariantLinePrice(selectedVariant, product.price, variants);

  const pricing = selectedVariant
    ? {
        price: linePrice,
        compareAtPrice: compareAtForVariant(selectedVariant, product.compareAtPrice),
        fromPrice: false,
      }
    : productDisplayPrice(product.price, variants);

  const priceLabel = formatPublicPrice(pricing.price, {
    prefix: pricing.fromPrice ? "À partir de " : "",
  });

  const canAdd =
    hasPublicPrice(pricing.price) &&
    (!requiresVariant || Boolean(selectedVariant)) &&
    (!selectedVariant || (selectedVariant.isActive && variantInStock(selectedVariant)));

  const blockReason = useMemo(() => {
    if (!hasPublicPrice(pricing.price)) {
      return "Prix non disponible pour cet article. Merci de nous contacter ou de compléter le prix dans l'admin boutique.";
    }
    if (requiresVariant && !selectedVariant) {
      return "Choisissez une taille et une couleur pour continuer.";
    }
    if (selectedVariant && !selectedVariant.isActive) {
      return "Cette option n'est plus disponible.";
    }
    if (selectedVariant && !variantInStock(selectedVariant)) {
      return "Rupture de stock pour cette option.";
    }
    return null;
  }, [pricing.price, requiresVariant, selectedVariant]);

  const handleAdd = () => {
    if (!canAdd) {
      setError(
        blockReason ??
          (requiresVariant ? "Choisissez une taille et une couleur disponibles." : "Article indisponible.")
      );
      return;
    }

    const price = linePrice;
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
            onSelect={(id) => {
              setSelectedVariantId(id);
              setError("");
            }}
          />
        </div>
      )}

      {blockReason && !error && (
        <p className="text-sm text-brand-600 mb-3 max-w-md leading-relaxed" role="status">
          {blockReason}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "btn-primary inline-flex items-center justify-center gap-2",
            !canAdd && "opacity-60 hover:opacity-70"
          )}
          aria-disabled={!canAdd}
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
