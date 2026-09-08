"use client";

import type { ShopVariant } from "@/lib/shop/variants";
import { variantInStock } from "@/lib/shop/variants";

interface ProductVariantSelectorProps {
  variants: ShopVariant[];
  selectedId: string | null;
  onSelect: (variantId: string) => void;
}

export function ProductVariantSelector({
  variants,
  selectedId,
  onSelect,
}: ProductVariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[];

  const selected = variants.find((v) => v.id === selectedId) ?? null;
  const selectedSize = selected?.size ?? null;
  const selectedColor = selected?.color ?? null;

  const pickVariant = (size: string | null, color: string | null) => {
    const match = variants.find((v) => v.size === size && v.color === color);
    if (match) onSelect(match.id);
  };

  if (variants.length === 0) return null;

  if (sizes.length === 0 && colors.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-overline text-brand-500">Options</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const inStock = variantInStock(variant);
            return (
              <button
                key={variant.id}
                type="button"
                disabled={!inStock}
                onClick={() => onSelect(variant.id)}
                className={`min-w-[3rem] px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                  selectedId === variant.id
                    ? "border-brand-950 bg-brand-950 text-white"
                    : inStock
                    ? "border-brand-200 hover:border-brand-950"
                    : "border-brand-100 text-brand-300 line-through cursor-not-allowed"
                }`}
              >
                {variant.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-overline text-brand-500">Taille</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const hasStock = variants.some(
                (v) =>
                  v.size === size &&
                  (!selectedColor || v.color === selectedColor) &&
                  variantInStock(v)
              );
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!hasStock}
                  onClick={() => pickVariant(size, selectedColor)}
                  className={`min-w-[2.5rem] px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                    isActive
                      ? "border-brand-950 bg-brand-950 text-white"
                      : hasStock
                      ? "border-brand-200 hover:border-brand-950"
                      : "border-brand-100 text-brand-300 line-through cursor-not-allowed"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-overline text-brand-500">Couleur</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const hasStock = variants.some(
                (v) =>
                  v.color === color &&
                  (!selectedSize || v.size === selectedSize) &&
                  variantInStock(v)
              );
              const isActive = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  disabled={!hasStock}
                  onClick={() => pickVariant(selectedSize, color)}
                  className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                    isActive
                      ? "border-brand-950 bg-brand-950 text-white"
                      : hasStock
                      ? "border-brand-200 hover:border-brand-950"
                      : "border-brand-100 text-brand-300 line-through cursor-not-allowed"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && !variantInStock(selected) && (
        <p className="text-xs text-red-600">Rupture de stock pour cette combinaison.</p>
      )}
    </div>
  );
}
