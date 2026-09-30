import { formatPrice } from "@/lib/utils";

/** Prix renseigné en admin (vide = pas de prix public). */
export function parseAdminPriceInput(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.round(n);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return null;
    return Math.round(value);
  }
  return null;
}

export function hasPublicPrice(price: number | null | undefined): boolean {
  return price != null && price > 0;
}

/** Libellé prix client ou `null` si rien à afficher. */
export function formatPublicPrice(
  price: number | null | undefined,
  options?: { prefix?: string }
): string | null {
  if (!hasPublicPrice(price)) return null;
  const prefix = options?.prefix ?? "";
  return `${prefix}${formatPrice(price!)}`;
}

export function productPublicPricing(
  basePrice: number | null | undefined,
  variants: Array<{ price: number | null; compareAtPrice?: number | null; isActive: boolean }>
): { price: number | null; compareAtPrice: number | null; fromPrice: boolean } {
  const activePriced = variants.filter((v) => v.isActive && hasPublicPrice(v.price));
  if (activePriced.length > 0) {
    const min = activePriced.reduce(
      (acc, v) => (v.price! < acc.price! ? v : acc),
      activePriced[0]
    );
    return {
      price: min.price,
      compareAtPrice: min.compareAtPrice ?? null,
      fromPrice:
        activePriced.length > 1 ||
        (hasPublicPrice(basePrice) && min.price !== basePrice),
    };
  }
  if (hasPublicPrice(basePrice)) {
    return { price: basePrice!, compareAtPrice: null, fromPrice: false };
  }
  return { price: null, compareAtPrice: null, fromPrice: false };
}
