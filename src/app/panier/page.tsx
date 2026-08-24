"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { cartCheckoutPath, cartKindLabel, getCartKind } from "@/lib/cart";
import { Trash2, ArrowRight, AlertTriangle } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const cartKind = getCartKind(items);
  const checkoutPath = cartCheckoutPath(cartKind);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container-premium max-w-2xl text-center">
          <h1 className="heading-section mb-4">Votre panier</h1>
          <p className="text-brand-600 mb-8">Votre panier est vide.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
              Voir la boutique
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/offres" className="btn-secondary inline-flex items-center gap-2">
              Voir les accompagnements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="heading-section">Votre panier</h1>
          <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-brand-100 text-brand-700">
            {cartKindLabel(cartKind)}
          </span>
        </div>

        {cartKind === "MIXED" && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 flex gap-3 text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Panier incompatible</p>
              <p>
                Les articles boutique et les accompagnements ne peuvent pas être commandés ensemble.
                Retirez les articles d&apos;un parcours pour continuer.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-12">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-6 p-6 border border-brand-100">
              {item.image && (
                <div className="relative w-24 h-32 flex-shrink-0 bg-brand-100">
                  <ProductImage src={item.image} fallback={IMAGES.productFallback} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">
                  {item.productType === "LUXE" ? "Boutique" : "Accompagnement"}
                </p>
                <h3 className="font-display text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-brand-500 mb-4">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-brand-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-brand-50"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-brand-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-brand-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-200 pt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Total</span>
            <span className="text-2xl font-light">{formatPrice(total())}</span>
          </div>

          {cartKind === "LUXE" && (
            <p className="text-sm text-brand-500 mb-6">
              Livraison soignée à Abidjan — vous renseignerez votre adresse à l&apos;étape suivante.
            </p>
          )}
          {cartKind === "SERVICE" && (
            <p className="text-sm text-brand-500 mb-6">
              Vous choisirez ensuite la date et le créneau de votre premier rendez-vous.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {checkoutPath ? (
              <Link
                href={checkoutPath}
                className="btn-primary flex-1 text-center inline-flex items-center justify-center gap-2"
              >
                {cartKind === "LUXE" ? "Commander" : "Réserver mon accompagnement"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button type="button" disabled className="btn-primary flex-1 opacity-50 cursor-not-allowed">
                Corrigez votre panier pour continuer
              </button>
            )}
            <button onClick={clearCart} className="btn-ghost">
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
