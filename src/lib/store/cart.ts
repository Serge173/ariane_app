import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProductType } from "@/lib/cart";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  productType: CartProductType;
  image?: string;
  mode?: "IN_PERSON" | "DIGITAL" | "HYBRID";
}

type AddItemResult = { ok: true } | { ok: false; error: "mixed" };

interface CartStore {
  items: CartItem[];
  toastAt: number;
  toastMessage: string | null;
  addItem: (item: CartItem) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

        const found = existing.find((i) => i.productId === item.productId);
        if (found) {
          set({
            items: existing.map((i) =>
              i.productId === item.productId
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
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
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
