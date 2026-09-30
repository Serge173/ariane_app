import { formatPrice } from "@/lib/utils";

/** Valeur lue en base ou API → prix public affichable ou null. */
export function normalizeStoredPrice(price: unknown): number | null {
  if (price == null) return null;
  if (typeof price === "object" && price !== null && "toNumber" in price) {
    return normalizeStoredPrice(Number((price as { toNumber: () => number }).toNumber()));
  }
  const n = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

/** Prix saisi en admin (vide ou 0 = pas de prix public). */
export function parseAdminPriceInput(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    return normalizeStoredPrice(Number(trimmed));
  }
  if (typeof value === "number") {
    return normalizeStoredPrice(value);
  }
  return null;
}

export function hasPublicPrice(price: unknown): boolean {
  return normalizeStoredPrice(price) != null;
}

/** Libellé prix client ou `null` si rien à afficher. */
export function formatPublicPrice(price: unknown, options?: { prefix?: string }): string | null {
  const amount = normalizeStoredPrice(price);
  if (amount == null) return null;
  const prefix = options?.prefix ?? "";
  return `${prefix}${formatPrice(amount)}`;
}

export function productPublicPricing(
  basePrice: unknown,
  variants: Array<{ price: unknown; compareAtPrice?: unknown; isActive: boolean }>
): { price: number | null; compareAtPrice: number | null; fromPrice: boolean } {
  const base = normalizeStoredPrice(basePrice);
  const activePriced = variants
    .filter((v) => v.isActive)
    .map((v) => ({ ...v, normalized: normalizeStoredPrice(v.price) }))
    .filter((v) => v.normalized != null) as Array<{
    price: unknown;
    compareAtPrice?: unknown;
    isActive: boolean;
    normalized: number;
  }>;

  if (activePriced.length > 0) {
    const min = activePriced.reduce(
      (acc, v) => (v.normalized < acc.normalized ? v : acc),
      activePriced[0]
    );
    const compare = normalizeStoredPrice(min.compareAtPrice);
    return {
      price: min.normalized,
      compareAtPrice: compare,
      fromPrice: activePriced.length > 1 || (base != null && min.normalized !== base),
    };
  }
  if (base != null) {
    return { price: base, compareAtPrice: null, fromPrice: false };
  }
  return { price: null, compareAtPrice: null, fromPrice: false };
}
