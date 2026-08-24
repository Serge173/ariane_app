"use client";

import {
  CreditCard,
  Smartphone,
  Truck,
  Banknote,
  Building2,
  Wallet,
  Loader2,
} from "lucide-react";
import { PAYMENT_ICON_MAP, type PaymentMethodOption } from "@/lib/payment-methods";

const FALLBACK_ICON = CreditCard;

interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  value: string;
  onChange: (code: string) => void;
  loading?: boolean;
}

export function PaymentMethodSelector({
  methods,
  value,
  onChange,
  loading,
}: PaymentMethodSelectorProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <p className="text-sm text-brand-500 p-4 border border-brand-100 bg-brand-50">
        Aucun mode de paiement disponible pour le moment. Contactez-nous pour finaliser votre commande.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = PAYMENT_ICON_MAP[method.icon] || FALLBACK_ICON;
        return (
          <button
            key={method.code}
            type="button"
            onClick={() => onChange(method.code)}
            className={`w-full flex items-start gap-3 p-4 border transition-all text-left ${
              value === method.code ? "border-brand-950 bg-brand-50" : "border-brand-200 hover:border-brand-400"
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">
              {method.name}
              {method.description && (
                <span className="block text-xs text-brand-500 mt-0.5">{method.description}</span>
              )}
              {value === method.code && method.instructions && (
                <span className="block text-xs text-brand-600 mt-2 whitespace-pre-line">
                  {method.instructions}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function getPaymentButtonLabel(code: string, methods: PaymentMethodOption[]): string {
  const method = methods.find((m) => m.code === code);
  if (method?.provider === "CASH_ON_DELIVERY" || method?.provider === "MANUAL" || method?.provider === "BANK_TRANSFER") {
    return "Confirmer ma commande";
  }
  return "Confirmer et payer";
}

export function isCodPayment(code: string, methods: PaymentMethodOption[]): boolean {
  const method = methods.find((m) => m.code === code);
  return method?.provider === "CASH_ON_DELIVERY";
}
