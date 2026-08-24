import {
  CreditCard,
  Smartphone,
  Truck,
  Banknote,
  Building2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { PaymentMethodContext, PaymentMethodProvider, PaymentMethod } from "@prisma/client";

export const PAYMENT_METHOD_CODES: PaymentMethod[] = [
  "CASH_ON_DELIVERY",
  "MOBILE_MONEY_ORANGE",
  "MOBILE_MONEY_MTN",
  "MOBILE_MONEY_MOOV",
  "MOBILE_MONEY_WAVE",
  "CARD",
  "BANK_TRANSFER",
];

export function isValidPaymentMethodCode(code: string): code is PaymentMethod {
  return PAYMENT_METHOD_CODES.includes(code as PaymentMethod);
}

export interface PaymentMethodOption {
  id: string;
  code: string;
  name: string;
  description: string | null;
  instructions: string | null;
  icon: string;
  context: PaymentMethodContext;
  provider: PaymentMethodProvider;
  isActive: boolean;
  sortOrder: number;
  minAmount: number | null;
  maxAmount: number | null;
}

export const PAYMENT_ICON_MAP: Record<string, LucideIcon> = {
  CreditCard,
  Smartphone,
  Truck,
  Banknote,
  Building2,
  Wallet,
};

export const PAYMENT_ICON_OPTIONS = Object.keys(PAYMENT_ICON_MAP);

export const PAYMENT_CONTEXT_LABELS: Record<PaymentMethodContext, string> = {
  BOUTIQUE: "Boutique uniquement",
  ACCOMPAGNEMENT: "Accompagnement uniquement",
  BOTH: "Boutique et accompagnement",
};

export const PAYMENT_PROVIDER_LABELS: Record<PaymentMethodProvider, string> = {
  CINETPAY: "Paiement en ligne (CinetPay)",
  CASH_ON_DELIVERY: "Paiement à la livraison",
  MANUAL: "Paiement manuel / sur place",
  BANK_TRANSFER: "Virement bancaire",
};

export function normalizePaymentCode(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "");
}

export function isOnlinePaymentProvider(provider: PaymentMethodProvider): boolean {
  return provider === "CINETPAY";
}

export function paymentMethodMatchesContext(
  context: PaymentMethodContext,
  orderKind: "LUXE" | "SERVICE"
): boolean {
  if (context === "BOTH") return true;
  if (orderKind === "LUXE") return context === "BOUTIQUE";
  return context === "ACCOMPAGNEMENT";
}

export function filterMethodsForContext(
  methods: PaymentMethodOption[],
  orderKind: "LUXE" | "SERVICE",
  amount: number
): PaymentMethodOption[] {
  return methods.filter((m) => {
    if (!m.isActive) return false;
    if (!paymentMethodMatchesContext(m.context, orderKind)) return false;
    if (m.minAmount != null && amount < m.minAmount) return false;
    if (m.maxAmount != null && amount > m.maxAmount) return false;
    return true;
  });
}
