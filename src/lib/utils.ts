import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "XOF"): string {
  if (currency === "XOF") {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount) + " FCFA";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  return time.replace(":", "h");
}

export function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "CIA";
  const timestamp = date.getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const OFFERS = {
  standard: { slug: "standard", name: "Standard", price: 60000 },
  gold: { slug: "gold", name: "Gold", price: 150000 },
  platinum: { slug: "platinum", name: "Platinum", price: 350000 },
  surMesure: { slug: "sur-mesure", name: "Sur-mesure", price: 500000 },
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MOBILE_MONEY_ORANGE: "Orange Money",
  MOBILE_MONEY_MTN: "MTN MoMo",
  MOBILE_MONEY_MOOV: "Moov Money",
  MOBILE_MONEY_WAVE: "Wave",
  CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CASH_ON_DELIVERY: "Paiement à la livraison",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  APPOINTMENT_CONFIRMED: "Rendez-vous confirmé",
  QUESTIONNAIRE_PENDING: "Questionnaire à compléter",
  COACHING_SCHEDULED: "Coaching planifié",
  COACHING_COMPLETED: "Coaching réalisé",
  FOLLOW_UP: "Suivi en cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Planifié",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  NO_SHOW: "Absent",
  RESCHEDULED: "Reprogrammé",
};
