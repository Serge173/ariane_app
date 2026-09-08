import { buildVariantLabel } from "@/lib/shop/variants";

export interface VariantInput {
  id?: string;
  size?: string;
  color?: string;
  sku?: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock?: number | string;
  lowStockThreshold?: number | string;
  trackInventory?: boolean;
  isActive?: boolean;
  sortOrder?: number | string;
}

export function normalizeVariantInput(raw: VariantInput, index: number) {
  const size = raw.size?.trim() || null;
  const color = raw.color?.trim() || null;
  return {
    id: raw.id,
    name: buildVariantLabel(size, color),
    size,
    color,
    sku: raw.sku?.trim() || null,
    price: Number(raw.price),
    compareAtPrice:
      raw.compareAtPrice != null && raw.compareAtPrice !== ""
        ? Number(raw.compareAtPrice)
        : null,
    stock: Number(raw.stock ?? 0),
    lowStockThreshold: Number(raw.lowStockThreshold ?? 3),
    trackInventory: raw.trackInventory ?? true,
    isActive: raw.isActive ?? true,
    sortOrder: Number(raw.sortOrder ?? index),
  };
}
