"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { type PaymentMethodOption } from "@/lib/payment-methods";
import { BOOKING_COPY, getBookingPaymentButtonLabel, type BookingPaymentContext } from "@/lib/booking-copy";
import { PaymentMethodCard } from "@/components/payments/PaymentMethodCard";
import { PaymentMethodDetailContent } from "@/components/payments/PaymentMethodDetailContent";

interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  value: string;
  onChange: (code: string) => void;
  loading?: boolean;
  context?: "boutique" | "appointment";
}

export function PaymentMethodSelector({
  methods,
  value,
  onChange,
  loading,
  context = "boutique",
}: PaymentMethodSelectorProps) {
  const copy = BOOKING_COPY[context];
  const [focusedCode, setFocusedCode] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) setFocusedCode(value);
  }, [value]);

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
        {copy.emptyPayment}
      </p>
    );
  }

  const focusedMethod = methods.find((m) => m.code === (focusedCode ?? value)) ?? methods[0];

  const handleSelect = (code: string) => {
    onChange(code);
    setFocusedCode(code);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.code}
            method={method}
            selected={value === method.code}
            onSelect={() => handleSelect(method.code)}
          />
        ))}
      </div>

      {focusedMethod && (
        <div
          id="payment-method-detail"
          className="p-6 bg-brand-50 border border-brand-200 scroll-mt-24"
        >
          <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-4">
            Informations du mode sélectionné
          </p>
          <PaymentMethodDetailContent method={focusedMethod} />
          {focusedMethod.instructions && value === focusedMethod.code && (
            <p className="mt-4 text-xs text-brand-600 bg-white border border-brand-100 p-3">
              {copy.paymentSelected}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function getPaymentButtonLabel(
  code: string,
  methods: PaymentMethodOption[],
  context: BookingPaymentContext = "boutique"
): string {
  return getBookingPaymentButtonLabel(code, methods, context);
}

export function isCodPayment(code: string, methods: PaymentMethodOption[]): boolean {
  const method = methods.find((m) => m.code === code);
  return method?.provider === "CASH_ON_DELIVERY";
}
