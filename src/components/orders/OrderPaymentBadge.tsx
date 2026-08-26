"use client";

import { useState } from "react";
import { PaymentMethodLogo, type PaymentMethodDisplay } from "@/components/payments/PaymentMethodLogo";
import { PaymentMethodDetailModal } from "@/components/payments/PaymentMethodDetailModal";
import { getProviderTemplate } from "@/lib/payment-providers";

interface OrderPaymentBadgeProps {
  methodCode: string;
  methodName: string;
  logoUrl?: string | null;
  description?: string | null;
  instructions?: string | null;
  provider?: string;
}

export function OrderPaymentBadge({
  methodCode,
  methodName,
  logoUrl,
  description,
  instructions,
  provider,
}: OrderPaymentBadgeProps) {
  const [open, setOpen] = useState(false);
  const template = getProviderTemplate(methodCode);

  const display: PaymentMethodDisplay = {
    code: methodCode,
    name: methodName,
    logoUrl: logoUrl ?? template?.logoUrl ?? null,
    description: description ?? template?.description ?? null,
    instructions: instructions ?? template?.instructions ?? null,
    provider: provider as PaymentMethodDisplay["provider"],
    apiChannel: template?.apiChannel ?? null,
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-1">
        <PaymentMethodLogo method={display} size="sm" clickable onClick={() => setOpen(true)} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-brand-500 hover:text-brand-800 underline-offset-2 hover:underline"
        >
          Paiement : {methodName}
        </button>
      </div>

      <PaymentMethodDetailModal method={display} open={open} onOpenChange={setOpen} />
    </>
  );
}
