import prisma from "@/lib/prisma";
import { getPlatformSettings } from "@/lib/platform-settings";

interface OrderNotificationInput {
  orderId: string;
  orderNumber: string;
  userId?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  total: number;
  orderKind: "LUXE" | "SERVICE";
}

export async function notifyOrderCreated(input: OrderNotificationInput): Promise<void> {
  const title =
    input.orderKind === "LUXE"
      ? `Commande boutique ${input.orderNumber}`
      : `Réservation ${input.orderNumber}`;

  const message =
    input.orderKind === "LUXE"
      ? `Votre commande de ${input.total.toLocaleString("fr-FR")} FCFA a été enregistrée. Nous vous contacterons pour la livraison.`
      : `Votre demande de réservation a été enregistrée. Nous vous recontacterons pour confirmer le créneau.`;

  if (input.userId) {
    await prisma.notification
      .create({
        data: {
          userId: input.userId,
          type: "IN_APP",
          title,
          message,
          metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
        },
      })
      .catch(() => {});
  }

  // WhatsApp admin alert (platform number) — metadata only, no external API yet
  const settings = await getPlatformSettings();
  if (settings.whatsappNumber) {
    await prisma.analyticsEvent
      .create({
        data: {
          event: "order_notify_whatsapp",
          userId: input.userId ?? undefined,
          metadata: {
            orderNumber: input.orderNumber,
            phone: input.guestPhone,
            email: input.guestEmail,
            whatsapp: settings.whatsappNumber,
          },
        },
      })
      .catch(() => {});
  }
}

export function isShopOrder(billingInfo: unknown): boolean {
  if (!billingInfo || typeof billingInfo !== "object") return false;
  return (billingInfo as { orderKind?: string }).orderKind === "LUXE";
}
