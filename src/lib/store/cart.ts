import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProductType } from "@/lib/cart";
import { cartLineKey } from "@/lib/cart-line";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  productType: CartProductType;
  image?: string;
  mode?: "IN_PERSON" | "DIGITAL" | "HYBRID";
  variantId?: string;
  variantLabel?: string;
  sku?: string;
}

type AddItemResult = { ok: true } | { ok: false; error: "mixed" };

interface CartStore {
  items: CartItem[];
  toastAt: number;
  toastMessage: string | null;
  addItem: (item: CartItem) => AddItemResult;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
  pulseAt: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      toastAt: 0,
      toastMessage: null,
      pulseAt: 0,
      addItem: (item) => {
        const existing = get().items;
        if (existing.length > 0 && item.productType && existing[0].productType) {
          if (item.productType !== existing[0].productType) {
            return { ok: false, error: "mixed" };
          }
        }

        const key = cartLineKey(item);
        const found = existing.find((i) => cartLineKey(i) === key);
        if (found) {
          set({
            items: existing.map((i) =>
              cartLineKey(i) === key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            toastAt: Date.now(),
            toastMessage: "Ajouté",
            pulseAt: Date.now(),
          });
        } else {
          set({
            items: [...existing, item],
            toastAt: Date.now(),
            toastMessage: "Ajouté",
            pulseAt: Date.now(),
          });
        }
        return { ok: true };
      },
      removeItem: (lineKey) => {
        set({ items: get().items.filter((i) => cartLineKey(i) !== lineKey) });
      },
      updateQuantity: (lineKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            cartLineKey(i) === lineKey ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
