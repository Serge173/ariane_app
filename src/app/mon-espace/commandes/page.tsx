import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";
import { OrderPaymentBadge } from "@/components/orders/OrderPaymentBadge";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";

export default async function ClientCommandesPage() {
  const session = await getServerSession(authOptions);
  const [orders, paymentConfigs] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session!.user!.id },
      include: { items: { include: { product: true } }, appointment: true, payments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.paymentMethodConfig.findMany(),
  ]);

  const configByCode = Object.fromEntries(paymentConfigs.map((c) => [c.code, c]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Mes commandes</h1>
        <p className="text-brand-600">{CLIENT_SPACE_COPY.commandesSubtitle}</p>
      </div>

      <p className="mb-8 text-sm text-brand-500 leading-relaxed max-w-3xl">
        Retrouvez ici le détail de chaque commande passée : référence, statut, mode de paiement et adresse de livraison le cas échéant.
      </p>

      {orders.length === 0 ? (
        <div className="bg-white border border-brand-100 text-center py-16">
          <p className="text-brand-500 mb-6">{CLIENT_SPACE_COPY.commandesEmpty}</p>
          <Link href="/offres" className="btn-primary text-xs">Découvrir nos offres</Link>
          <Link href="/boutique" className="btn-secondary text-xs mt-3 inline-block">Voir la boutique</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const billing = order.billingInfo as {
              orderKind?: string;
              shipping?: { address: string; city: string };
            } | null;
            const isBoutique =
              billing?.orderKind === "LUXE" ||
              order.items.some((i) => i.product?.productType === "LUXE");

            const isCod = order.payments.some((p) => p.method === "CASH_ON_DELIVERY");
            const payment = order.payments[0];
            const config = payment ? configByCode[payment.method] : null;

            return (
            <div key={order.id} className="bg-white border border-brand-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-lg">{order.items[0]?.product?.name || "Commande"}</p>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-100">
                      {isBoutique ? "Boutique" : "Accompagnement"}
                    </span>
                  </div>
                  <p className="text-xs text-brand-400 mt-1">Réf. {order.orderNumber}</p>
                  <p className="text-xs text-brand-400">Commandé le {formatDate(order.createdAt)}</p>
                  {payment && (
                    config ? (
                      <OrderPaymentBadge
                        methodCode={payment.method}
                        methodName={config.name}
                        logoUrl={config.logoUrl}
                        description={config.description}
                        instructions={config.instructions}
                        provider={config.provider}
                      />
                    ) : (
                      <p className="text-xs text-brand-500 mt-1">
                        Paiement : {PAYMENT_METHOD_LABELS[payment.method] || payment.method}
                      </p>
                    )
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-light">{formatPrice(order.total)}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-widest px-3 py-1 bg-brand-100">
                    {isCod && order.status === "PENDING_PAYMENT"
                      ? "Confirmée — paiement à la livraison"
                      : ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
              {order.appointment && (
                <p className="text-sm text-brand-600 border-t border-brand-50 pt-4">
                  Rendez-vous : {formatDate(order.appointment.date)} à {order.appointment.startTime.replace(":", "h")}
                  {" · "}{order.appointment.mode === "IN_PERSON" ? "Présentiel" : order.appointment.mode === "DIGITAL" ? "Digital" : "Hybride"}
                </p>
              )}
              {isBoutique && billing?.shipping && (
                <p className="text-sm text-brand-600 border-t border-brand-50 pt-4">
                  Livraison : {billing.shipping.address}, {billing.shipping.city}
                </p>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
