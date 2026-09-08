import type { CartItem } from "@/lib/store/cart";

export function cartLineKey(item: Pick<CartItem, "productId" | "variantId">): string {
  return `${item.productId}:${item.variantId ?? ""}`;
}
