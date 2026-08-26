"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PaymentMethodLogo, type PaymentMethodDisplay } from "./PaymentMethodLogo";
import {
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_CONTEXT_LABELS,
} from "@/lib/payment-methods";
import { getProviderTemplate } from "@/lib/payment-providers";

interface PaymentMethodDetailModalProps {
  method: PaymentMethodDisplay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodDetailModal({ method, open, onOpenChange }: PaymentMethodDetailModalProps) {
  if (!method) return null;

  const template = getProviderTemplate(method.code);
  const apiLabel =
    template?.apiLabel ??
    (method.provider ? PAYMENT_PROVIDER_LABELS[method.provider] : null);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 bg-white border border-brand-100 shadow-xl p-6 focus:outline-none">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <PaymentMethodLogo method={method} size="lg" />
              <div>
                <Dialog.Title className="font-display text-xl">{method.name}</Dialog.Title>
                <p className="text-xs font-mono text-brand-400 mt-0.5">{method.code}</p>
              </div>
            </div>
            <Dialog.Close className="p-1 hover:bg-brand-50 rounded" aria-label="Fermer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 text-sm">
            {method.description && (
              <p className="text-brand-600">{method.description}</p>
            )}

            {apiLabel && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brand-400 mb-1">API / Traitement</p>
                <p className="text-brand-800">{apiLabel}</p>
                {method.apiChannel && (
                  <p className="text-xs text-brand-500 mt-0.5">Canal CinetPay : {method.apiChannel}</p>
                )}
              </div>
            )}

            {method.context && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brand-400 mb-1">Contexte</p>
                <p>{PAYMENT_CONTEXT_LABELS[method.context]}</p>
              </div>
            )}

            {(method.minAmount != null || method.maxAmount != null) && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brand-400 mb-1">Montants</p>
                <p className="text-brand-700">
                  {method.minAmount != null && `Min. ${method.minAmount.toLocaleString("fr-FR")} FCFA`}
                  {method.minAmount != null && method.maxAmount != null && " · "}
                  {method.maxAmount != null && `Max. ${method.maxAmount.toLocaleString("fr-FR")} FCFA`}
                </p>
              </div>
            )}

            {method.instructions && (
              <div className="border-t border-brand-100 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-brand-400 mb-2">Instructions</p>
                <p className="text-brand-600 whitespace-pre-line">{method.instructions}</p>
              </div>
            )}

            {method.isActive === false && (
              <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 border border-amber-100">
                Ce mode de paiement est actuellement inactif.
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
