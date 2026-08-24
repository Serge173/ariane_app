import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";

export default async function ClientCommandesPage() {
  const session = await getServerSession(authOptions);
  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id },
    include: { items: { include: { product: true } }, appointment: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Mes commandes</h1>
        <p className="text-brand-600">Historique de vos commandes boutique et accompagnements</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-brand-100 text-center py-16">
          <p className="text-brand-500 mb-6">Vous n&apos;avez pas encore de commande</p>
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
                  {order.payments[0] && (
                    <p className="text-xs text-brand-500 mt-1">
                      Paiement : {PAYMENT_METHOD_LABELS[order.payments[0].method] || order.payments[0].method}
                    </p>
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
