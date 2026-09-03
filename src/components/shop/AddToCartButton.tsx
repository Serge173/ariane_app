"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import type { CartProductType } from "@/lib/cart";
import { ShoppingBag, Calendar } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
  productType: CartProductType;
  variant?: "primary" | "secondary";
}

export function AddToCartButton({ product, productType, variant = "primary" }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [error, setError] = useState("");

  const isLuxe = productType === "LUXE";
  const label = isLuxe ? "Ajouter au panier" : "Choisir cette formule";
  const Icon = isLuxe ? ShoppingBag : Calendar;

  const handleAdd = () => {
    const result = addItem({ ...product, productType, quantity: 1 });
    if (!result.ok) {
      setError(
        isLuxe
          ? "Votre panier contient un accompagnement. Finalisez-le ou videz le panier avant d'ajouter des articles boutique."
          : "Votre panier contient des articles boutique. Finalisez votre commande ou videz le panier avant de choisir un forfait."
      );
      return;
    }
    setError("");
  };

  const btnClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <div>
      <button type="button" onClick={handleAdd} className={`${btnClass} inline-flex items-center gap-2`}>
        <Icon className="w-4 h-4" />
        {label}
      </button>
      {error && <p className="text-xs text-red-600 mt-2 max-w-sm">{error}</p>}
    </div>
  );
}
