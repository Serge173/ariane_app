"use client";

import Image from "next/image";
import { useState } from "react";
import { PAYMENT_ICON_MAP, PAYMENT_PROVIDER_LABELS, PAYMENT_CONTEXT_LABELS } from "@/lib/payment-methods";
import { getProviderTemplate } from "@/lib/payment-providers";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentMethodDisplay {
  code: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  logoUrl?: string | null;
  icon?: string;
  provider?: keyof typeof PAYMENT_PROVIDER_LABELS;
  context?: keyof typeof PAYMENT_CONTEXT_LABELS;
  apiChannel?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  isActive?: boolean;
}

interface PaymentMethodLogoProps {
  method: PaymentMethodDisplay;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

const SIZES = { sm: 36, md: 48, lg: 64 };

export function PaymentMethodLogo({
  method,
  size = "md",
  className,
  onClick,
  clickable = false,
}: PaymentMethodLogoProps) {
  const [errored, setErrored] = useState(false);
  const dim = SIZES[size];
  const logoUrl = method.logoUrl || getProviderTemplate(method.code)?.logoUrl;
  const Icon = PAYMENT_ICON_MAP[method.icon || ""] || CreditCard;

  const wrapperClass = cn(
    "relative flex-shrink-0 rounded-lg overflow-hidden bg-brand-50 border border-brand-100",
    (clickable || onClick) && "cursor-pointer hover:ring-2 hover:ring-brand-400 transition-shadow",
    className
  );

  const content =
    logoUrl && !errored ? (
      <Image
        src={logoUrl}
        alt={method.name}
        width={dim}
        height={dim}
        className="object-cover w-full h-full"
        onError={() => setErrored(true)}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-brand-100" style={{ width: dim, height: dim }}>
        <Icon className="w-1/2 h-1/2 text-brand-600" />
      </div>
    );

  if (onClick || clickable) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={wrapperClass}
        style={{ width: dim, height: dim }}
        title={`Voir les détails — ${method.name}`}
        aria-label={`Détails du mode de paiement ${method.name}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={wrapperClass} style={{ width: dim, height: dim }}>
      {content}
    </div>
  );
}
