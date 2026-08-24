"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { getCartKind } from "@/lib/cart";
import { filterMethodsForContext, type PaymentMethodOption } from "@/lib/payment-methods";
import {
  PaymentMethodSelector,
  getPaymentButtonLabel,
} from "@/components/checkout/PaymentMethodSelector";
import { Calendar, Clock } from "lucide-react";

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00",
];

interface DirectProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  productType: string;
}

function ReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [directProduct, setDirectProduct] = useState<DirectProduct | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    mode: "IN_PERSON" as "IN_PERSON" | "DIGITAL" | "HYBRID",
    notes: "",
    paymentMethod: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);

  const productSlug = searchParams.get("product");
  const cartKind = getCartKind(items);
  const hasCartItems = items.length > 0;
  const isDirectBooking = !hasCartItems && Boolean(productSlug);

  useEffect(() => {
    if (hasCartItems && cartKind === "LUXE") {
      router.replace("/checkout");
    } else if (hasCartItems && cartKind === "MIXED") {
      router.replace("/panier");
    } else if (!hasCartItems && !productSlug) {
      router.replace("/offres");
    }
  }, [hasCartItems, cartKind, productSlug, router]);

  useEffect(() => {
    if (!productSlug || hasCartItems) return;
    fetch(`/api/catalogue/product?slug=${encodeURIComponent(productSlug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.productType === "SERVICE") setDirectProduct(data);
      })
      .catch(() => {});
  }, [productSlug, hasCartItems]);

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

  const cartTotal = hasCartItems ? total() : directProduct?.price || 0;

  useEffect(() => {
    setMethodsLoading(true);
    fetch("/api/payment-methods?context=accompagnement")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PaymentMethodOption[]) => {
        const filtered = filterMethodsForContext(Array.isArray(data) ? data : [], "SERVICE", cartTotal);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderKind: "SERVICE",
          items: hasCartItems
            ? items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
            : productSlug
            ? [{ productSlug, quantity: 1 }]
            : [],
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        clearCart();
        router.push(`/reservation/confirmation?order=${data.orderNumber}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if ((!hasCartItems && !productSlug) || (hasCartItems && cartKind !== "SERVICE")) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <p className="text-overline mb-2">Accompagnement</p>
        <h1 className="heading-section mb-4">Réserver votre accompagnement</h1>
        <p className="text-brand-600 mb-12">
          Étape {step} sur 3 — {step === 1 ? "Vos coordonnées" : step === 2 ? "Date et créneau" : "Paiement"}
        </p>

        <div className="h-1 bg-brand-100 mb-12">
          <div className="h-full bg-brand-950 transition-all" style={{ width: `${(step / 3) * 100}%` }} />
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
            <div>
              <label className="label-field">Mode d&apos;accompagnement</label>
              <select className="input-field" value={form.mode} onChange={(e) => updateForm("mode", e.target.value)}>
                <option value="IN_PERSON">Présentiel (Abidjan)</option>
                <option value="DIGITAL">100% Digital</option>
                <option value="HYBRID">Hybride</option>
              </select>
            </div>
            <div>
              <label className="label-field">Notes ou besoins particuliers</label>
              <textarea className="input-field min-h-[100px]" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
            </div>
            <button onClick={() => setStep(2)} className="btn-primary" disabled={!form.firstName || !form.email || !form.phone}>
              Continuer
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="label-field flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date souhaitée *
              </label>
              <input type="date" className="input-field" min={minDateStr} value={form.date} onChange={(e) => updateForm("date", e.target.value)} required />
            </div>
            <div>
              <label className="label-field flex items-center gap-2">
                <Clock className="w-4 h-4" /> Créneau horaire *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateForm("time", time)}
                    className={`py-3 text-sm border transition-all ${
                      form.time === time ? "border-brand-950 bg-brand-50" : "border-brand-200 hover:border-brand-400"
                    }`}
                  >
                    {time.replace(":", "h")}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">Retour</button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary" disabled={!form.date || !form.time}>
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 bg-brand-50 border border-brand-100 mb-6">
              <h3 className="font-display text-lg mb-4">Récapitulatif accompagnement</h3>
              {hasCartItems ? (
                items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : directProduct ? (
                <div className="flex justify-between text-sm mb-2">
                  <span>{directProduct.name}</span>
                  <span>{formatPrice(directProduct.price)}</span>
                </div>
              ) : (
                <p className="text-sm text-brand-600">Formule : {productSlug}</p>
              )}
              <div className="flex justify-between font-medium mt-4 pt-4 border-t border-brand-200">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-brand-500 mt-2">
                Rendez-vous : {form.date} à {form.time?.replace(":", "h")} —{" "}
                {form.mode === "IN_PERSON" ? "Présentiel" : form.mode === "DIGITAL" ? "Digital" : "Hybride"}
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
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">Retour</button>
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

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Chargement...</div>}>
      <ReservationForm />
    </Suspense>
  );
}
