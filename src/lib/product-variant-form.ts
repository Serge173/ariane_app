export interface VariantFormRow {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  lowStockThreshold: string;
  trackInventory: boolean;
  isActive: boolean;
}

export function variantsToFormRows(
  variants: Array<{
    id: string;
    size: string | null;
    color: string | null;
    sku: string | null;
    price: number | null | { toString(): string };
    compareAtPrice: number | null | { toString(): string };
    stock: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    isActive: boolean;
  }>
): VariantFormRow[] {
  return variants.map((v) => ({
    id: v.id,
    size: v.size ?? "",
    color: v.color ?? "",
    sku: v.sku ?? "",
    price: String(v.price),
    compareAtPrice: v.compareAtPrice != null ? String(v.compareAtPrice) : "",
    stock: String(v.stock),
    lowStockThreshold: String(v.lowStockThreshold),
    trackInventory: v.trackInventory,
    isActive: v.isActive,
  }));
}
