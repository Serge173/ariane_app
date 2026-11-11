import { productPublicPricing } from "@/lib/shop/public-price";

export interface ShopVariant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  trackInventory: boolean;
  isActive: boolean;
}

export function buildVariantLabel(size?: string | null, color?: string | null): string {
  const parts = [size?.trim(), color?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "Standard";
}

export function variantInStock(variant: Pick<ShopVariant, "stock" | "trackInventory">): boolean {
  if (!variant.trackInventory) return true;
  return variant.stock > 0;
}

export function firstPurchasableVariantId(variants: ShopVariant[]): string | null {
  const pick = variants.find((v) => v.isActive && variantInStock(v));
  return pick?.id ?? null;
}

export function resolveVariantLinePrice(
  variant: ShopVariant | null,
  basePrice: number | null | undefined,
  variants: ShopVariant[]
): number | null {
  const fromVariant = variant?.price ?? null;
  if (fromVariant != null && fromVariant > 0) return fromVariant;
  const fromBase = basePrice ?? null;
  if (fromBase != null && fromBase > 0) return fromBase;
  return productDisplayPrice(basePrice, variants).price;
}

export function productDisplayPrice(
  basePrice: number | null | undefined,
  variants: ShopVariant[]
): { price: number | null; compareAtPrice: number | null; fromPrice: boolean } {
  return productPublicPricing(basePrice, variants);
}
