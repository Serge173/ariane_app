import type { PaymentMethod, PaymentMethodProvider, PaymentMethodContext } from "@prisma/client";

/** Canaux CinetPay v2 — https://docs.cinetpay.com */
export type CinetPayChannel = "ALL" | "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET";

export interface PaymentProviderTemplate {
  code: PaymentMethod;
  name: string;
  description: string;
  instructions?: string;
  logoUrl: string;
  icon: string;
  provider: PaymentMethodProvider;
  apiChannel: CinetPayChannel | null;
  context: PaymentMethodContext;
  apiLabel: string;
}

export const PAYMENT_PROVIDER_TEMPLATES: PaymentProviderTemplate[] = [
  {
    code: "MOBILE_MONEY_ORANGE",
    name: "Orange Money",
    description: "Paiement sécurisé via Orange Money (CinetPay)",
    logoUrl: "/payments/orange-money.svg",
    icon: "Smartphone",
    provider: "CINETPAY",
    apiChannel: "MOBILE_MONEY",
    context: "BOTH",
    apiLabel: "CinetPay · Mobile Money",
  },
  {
    code: "MOBILE_MONEY_MTN",
    name: "MTN MoMo",
    description: "Paiement sécurisé via MTN Mobile Money (CinetPay)",
    logoUrl: "/payments/mtn-momo.svg",
    icon: "Smartphone",
    provider: "CINETPAY",
    apiChannel: "MOBILE_MONEY",
    context: "BOTH",
    apiLabel: "CinetPay · Mobile Money",
  },
  {
    code: "MOBILE_MONEY_WAVE",
    name: "Wave",
    description: "Paiement sécurisé via Wave (CinetPay)",
    logoUrl: "/payments/wave.svg",
    icon: "Smartphone",
    provider: "CINETPAY",
    apiChannel: "MOBILE_MONEY",
    context: "BOTH",
    apiLabel: "CinetPay · Mobile Money",
  },
  {
    code: "MOBILE_MONEY_MOOV",
    name: "Moov Money",
    description: "Paiement sécurisé via Moov Money (CinetPay)",
    logoUrl: "/payments/moov-money.svg",
    icon: "Smartphone",
    provider: "CINETPAY",
    apiChannel: "MOBILE_MONEY",
    context: "BOTH",
    apiLabel: "CinetPay · Mobile Money",
  },
  {
    code: "CARD",
    name: "Carte bancaire",
    description: "Visa, Mastercard via CinetPay",
    logoUrl: "/payments/card.svg",
    icon: "CreditCard",
    provider: "CINETPAY",
    apiChannel: "CREDIT_CARD",
    context: "BOTH",
    apiLabel: "CinetPay · Carte bancaire",
  },
  {
    code: "CASH_ON_DELIVERY",
    name: "Paiement à la livraison",
    description: "Payez en espèces ou Mobile Money à la réception",
    instructions: "Préparez le montant exact ou votre téléphone pour Mobile Money lors de la livraison.",
    logoUrl: "/payments/cash-on-delivery.svg",
    icon: "Truck",
    provider: "CASH_ON_DELIVERY",
    apiChannel: null,
    context: "BOUTIQUE",
    apiLabel: "Hors ligne · À la livraison",
  },
  {
    code: "BANK_TRANSFER",
    name: "Virement bancaire",
    description: "Paiement par virement sous 48 h",
    instructions: "Les coordonnées bancaires vous seront envoyées par email après validation de la commande.",
    logoUrl: "/payments/bank-transfer.svg",
    icon: "Building2",
    provider: "BANK_TRANSFER",
    apiChannel: null,
    context: "BOTH",
    apiLabel: "Hors ligne · Virement",
  },
];

export function getProviderTemplate(code: string): PaymentProviderTemplate | undefined {
  return PAYMENT_PROVIDER_TEMPLATES.find((t) => t.code === code);
}

export function getCinetPayChannel(apiChannel: string | null | undefined): CinetPayChannel {
  if (apiChannel === "MOBILE_MONEY" || apiChannel === "CREDIT_CARD" || apiChannel === "WALLET") {
    return apiChannel;
  }
  return "ALL";
}
