export type BookingPaymentContext = "boutique" | "appointment";

/** Formulaire de demande de RDV conseil en image (sans achat boutique). */
export const APPOINTMENT_REQUEST_PATH = "/reservation?intent=rdv";

export const BOOKING_COPY = {  boutique: {
    pageTitle: "Finaliser ma commande",
    stepLabel: (step: number) =>
      step === 1 ? "Coordonnées et livraison" : "Paiement",
    recapTitle: "Récapitulatif boutique",
    continueLabel: "Continuer vers le paiement",
    emptyPayment: "Contactez-nous pour finaliser votre commande.",
    paymentSelected: "Ce mode est sélectionné pour votre commande.",
    confirmManual: "Confirmer ma commande",
    confirmOnline: "Confirmer et payer",
  },
  appointment: {
    pageTitle: "Finaliser ma demande de RDV ARIANE DAGO",
    stepLabel: (step: number, totalSteps: number) => {
      if (totalSteps === 2) {
        return step === 1 ? "Vos coordonnées" : "Date et créneau";
      }
      return step === 1 ? "Vos coordonnées" : step === 2 ? "Date et créneau" : "Paiement";
    },
    recapTitle: "Récapitulatif de votre demande",
    continueLabel: "Continuer",
    submitDiscovery: "Envoyer ma demande de RDV",
    emptyPayment: "Contactez-nous pour finaliser votre demande de rendez-vous.",
    paymentSelected: "Ce mode est sélectionné pour votre accompagnement.",
    confirmManual: "Confirmer ma demande de RDV",
    confirmOnline: "Confirmer et payer",
  },
} as const;

export function getBookingPaymentButtonLabel(
  code: string,
  methods: { code: string; provider?: string | null }[],
  context: BookingPaymentContext
): string {
  const copy = BOOKING_COPY[context];
  const method = methods.find((m) => m.code === code);
  if (method?.provider === "CASH_ON_DELIVERY" || method?.provider === "MANUAL" || method?.provider === "BANK_TRANSFER") {
    return copy.confirmManual;
  }
  return copy.confirmOnline;
}
