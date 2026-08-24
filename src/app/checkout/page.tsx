"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { getCartKind } from "@/lib/cart";
import { filterMethodsForContext, type PaymentMethodOption } from "@/lib/payment-methods";
import {
  PaymentMethodSelector,
  getPaymentButtonLabel,
  isCodPayment,
} from "@/components/checkout/PaymentMethodSelector";
import { MapPin, Truck } from "lucide-react";

function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Abidjan",
    deliveryNotes: "",
    paymentMethod: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const cartTotal = total();

  const cartKind = getCartKind(items);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/panier");
      return;
    }
    if (cartKind === "SERVICE") {
      router.replace("/reservation");
    } else if (cartKind === "MIXED") {
      router.replace("/panier");
    }
  }, [items.length, cartKind, router]);

  useEffect(() => {
    if (session?.user?.email) {
      const nameParts = (session.user.name || "").split(" ");
      setForm((f) => ({
        ...f,
        email: session.user.email || "",
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    setMethodsLoading(true);
    fetch("/api/payment-methods?context=boutique")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PaymentMethodOption[]) => {
        const filtered = filterMethodsForContext(Array.isArray(data) ? data : [], "LUXE", cartTotal);
        setPaymentMethods(filtered);
        setForm((f) => ({
          ...f,
          paymentMethod: f.paymentMethod && filtered.some((m) => m.code === f.paymentMethod)
            ? f.paymentMethod
            : filtered[0]?.code || "",
        }));
      })
      .finally(() => setMethodsLoading(false));
  }, [cartTotal]);

  const updateForm = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderKind: "LUXE",
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        clearCart();
        const codParam = isCodPayment(form.paymentMethod, paymentMethods) ? "&payment=cod" : "";
        router.push(`/checkout/confirmation?order=${data.orderNumber}${codParam}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 || cartKind !== "LUXE") {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <h1 className="heading-section mb-4">Finaliser ma commande</h1>
        <p className="text-brand-600 mb-12">
          Étape {step} sur 2 — {step === 1 ? "Coordonnées et livraison" : "Paiement"}
        </p>

        <div className="h-1 bg-brand-100 mb-12">
          <div className="h-full bg-brand-950 transition-all" style={{ width: `${(step / 2) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="label-field">Prénom *</label>
                <input className="input-field" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} required />
              </div>
              <div>
                <label className="label-field">Nom *</label>
                <input className="input-field" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required />
            </div>
            <div>
              <label className="label-field">Téléphone / WhatsApp *</label>
              <input type="tel" className="input-field" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+225..." required />
            </div>

            <div className="pt-4 border-t border-brand-100">
              <p className="text-overline mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Livraison
              </p>
              <div>
                <label className="label-field flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Adresse de livraison *
                </label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="Quartier, rue, repères..."
                  required
                />
              </div>
              <div className="mt-4">
                <label className="label-field">Ville *</label>
                <input className="input-field" value={form.city} onChange={(e) => updateForm("city", e.target.value)} required />
              </div>
              <div className="mt-4">
                <label className="label-field">Instructions de livraison (optionnel)</label>
                <textarea
                  className="input-field min-h-[60px]"
                  value={form.deliveryNotes}
                  onChange={(e) => updateForm("deliveryNotes", e.target.value)}
                  placeholder="Horaires préférés, digicode..."
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              disabled={!form.firstName || !form.email || !form.phone || !form.address}
            >
              Continuer vers le paiement
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 bg-brand-50 border border-brand-100">
              <h3 className="font-display text-lg mb-4">Récapitulatif boutique</h3>
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm mb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium mt-4 pt-4 border-t border-brand-200">
                <span>Total</span>
                <span>{formatPrice(total())}</span>
              </div>
              <p className="text-xs text-brand-500 mt-3">
                Livraison : {form.address}, {form.city}
              </p>
            </div>

            <div>
              <label className="label-field">Mode de paiement *</label>
              <PaymentMethodSelector
                methods={paymentMethods}
                value={form.paymentMethod}
                onChange={(code) => updateForm("paymentMethod", code)}
                loading={methodsLoading}
              />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">Retour</button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary flex-1"
                disabled={loading || !form.paymentMethod || methodsLoading}
              >
                {loading ? "Traitement..." : getPaymentButtonLabel(form.paymentMethod, paymentMethods)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Chargement...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
