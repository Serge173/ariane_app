export interface ShopVariant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  sku: string | null;
  price: number;
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

export function productDisplayPrice(
  basePrice: number,
  variants: ShopVariant[]
): { price: number; compareAtPrice: number | null; fromPrice: boolean } {
  const active = variants.filter((v) => v.isActive);
  if (active.length === 0) {
    return { price: basePrice, compareAtPrice: null, fromPrice: false };
  }
  const min = active.reduce((acc, v) => (v.price < acc.price ? v : acc), active[0]);
  return {
    price: min.price,
    compareAtPrice: min.compareAtPrice,
    fromPrice: active.length > 1 || min.price !== basePrice,
  };
}
