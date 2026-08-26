"use client";

import { cn } from "@/lib/utils";
import { PaymentMethodLogo, type PaymentMethodDisplay } from "./PaymentMethodLogo";
import { Check } from "lucide-react";

interface PaymentMethodCardProps {
  method: PaymentMethodDisplay;
  selected?: boolean;
  onSelect: () => void;
  className?: string;
  footer?: React.ReactNode;
}

export function PaymentMethodCard({
  method,
  selected = false,
  onSelect,
  className,
  footer,
}: PaymentMethodCardProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col bg-white border transition-all text-left",
        selected
          ? "border-brand-950 ring-2 ring-brand-950 shadow-md"
          : "border-brand-200 hover:border-brand-400 hover:shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-col items-center gap-3 p-6 w-full min-h-[160px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-950 focus-visible:ring-offset-2"
      >
        {selected && (
          <span className="absolute top-3 right-3 w-6 h-6 bg-brand-950 text-white rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        )}
        <PaymentMethodLogo method={method} size="lg" />
        <div className="text-center w-full">
          <p className="text-sm font-medium text-brand-950">{method.name}</p>
          {method.description && (
            <p className="text-xs text-brand-500 mt-1 line-clamp-2">{method.description}</p>
          )}
        </div>
      </button>
      {footer && (
        <div className="border-t border-brand-100 px-4 py-3 flex items-center justify-center gap-2">
          {footer}
        </div>
      )}
    </article>
  );
}
