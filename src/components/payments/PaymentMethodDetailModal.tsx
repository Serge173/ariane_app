"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { PaymentMethodDisplay } from "./PaymentMethodLogo";
import { PaymentMethodDetailContent } from "./PaymentMethodDetailContent";

interface PaymentMethodDetailModalProps {
  method: PaymentMethodDisplay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodDetailModal({ method, open, onOpenChange }: PaymentMethodDetailModalProps) {
  if (!method) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 bg-white border border-brand-100 shadow-xl p-6 focus:outline-none max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-2">
            <Dialog.Title className="sr-only">{method.name}</Dialog.Title>
            <Dialog.Close className="ml-auto p-1 hover:bg-brand-50 rounded flex-shrink-0" aria-label="Fermer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>
          <PaymentMethodDetailContent method={method} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
