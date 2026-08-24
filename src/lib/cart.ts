import type { CartItem } from "@/lib/store/cart";

export type CartProductType = "LUXE" | "SERVICE";

export type CartKind = CartProductType | "MIXED" | "EMPTY" | "UNKNOWN";

export function getCartKind(items: CartItem[]): CartKind {
  if (items.length === 0) return "EMPTY";

  const types = new Set(
    items.map((i) => i.productType).filter((t): t is CartProductType => Boolean(t))
  );

  if (types.size === 0) return "UNKNOWN";
  if (types.size > 1) return "MIXED";
  return [...types][0];
}

export function cartCheckoutPath(kind: CartKind): string | null {
  if (kind === "LUXE") return "/checkout";
  if (kind === "SERVICE") return "/reservation";
  return null;
}

export function cartKindLabel(kind: CartKind): string {
  switch (kind) {
    case "LUXE":
      return "Boutique";
    case "SERVICE":
      return "Accompagnement";
    case "MIXED":
      return "Panier mixte";
    default:
      return "Panier";
  }
}
