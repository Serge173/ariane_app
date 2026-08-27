import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Calendar, ShoppingBag, FileText, ArrowRight, ClipboardList } from "lucide-react";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;

  let user = null;
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  let documents: Awaited<ReturnType<typeof getDocuments>> = [];

  try {
    [user, orders, documents] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true } }),
      getOrders(userId),
      getDocuments(userId),
    ]);
  } catch {}

  const activeOrder = orders.find((o) => !["COMPLETED", "CANCELLED", "REFUNDED"].includes(o.status));
  const activeIsCoaching = activeOrder?.appointment != null;
  const activeIsBoutique =
    activeOrder?.items.some((i) => i.product?.productType === "LUXE") ?? false;
  const nextAppointment = orders.find((o) => o.appointment)?.appointment;
  const firstName = user?.firstName || session?.user?.name?.split(" ")[0] || "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Bonjour, {firstName}</h1>
        <p className="text-brand-600">{CLIENT_SPACE_COPY.welcomeSubtitle}</p>
      </div>

      <p className="mb-8 p-4 bg-brand-50 border border-brand-100 text-sm text-brand-600 leading-relaxed">
        {CLIENT_SPACE_COPY.introBanner}
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Commandes", value: orders.length, href: "/mon-espace/commandes", icon: ShoppingBag },
          { label: "Rendez-vous", value: orders.filter((o) => o.appointment).length, href: "/mon-espace/rendez-vous", icon: Calendar },
          { label: "Documents", value: documents.length, href: "/mon-espace/documents", icon: FileText },
          { label: "Questionnaires", value: "—", href: "/mon-espace/questionnaire", icon: ClipboardList },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white border border-brand-100 p-5 hover:shadow-md transition-shadow group">
            <stat.icon className="w-5 h-5 text-accent mb-3" strokeWidth={1.5} />
            <p className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-light">{stat.value}</p>
          </Link>
        ))}
      </div>

      {activeOrder && (
        <section className="mb-8 p-6 bg-brand-950 text-white">
          <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-2">
            {activeIsBoutique && !activeIsCoaching ? "Commande en cours" : "Parcours en cours"}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl mb-1">{activeOrder.items[0]?.product?.name || "Accompagnement"}</h2>
              <p className="text-sm text-brand-300">Statut : {ORDER_STATUS_LABELS[activeOrder.status]}</p>
              {activeOrder.appointment && (
                <p className="text-sm text-brand-400 mt-1">
                  Prochain RDV : {formatDate(activeOrder.appointment.date)} à {activeOrder.appointment.startTime.replace(":", "h")}
                </p>
              )}
            </div>
            {(activeOrder.status === "PAID" || activeOrder.status === "QUESTIONNAIRE_PENDING") && activeIsCoaching && (
              <Link href="/mon-espace/questionnaire" className="btn-primary bg-white text-brand-950 hover:bg-brand-100 inline-flex items-center gap-2 text-xs">
                Compléter le questionnaire <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {activeIsBoutique && !activeIsCoaching && (
              <Link href="/mon-espace/commandes" className="btn-primary bg-white text-brand-950 hover:bg-brand-100 inline-flex items-center gap-2 text-xs">
                Suivre ma commande <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>
      )}

      {nextAppointment && !activeOrder && (
        <section className="mb-8 p-6 bg-brand-50 border border-brand-100">
          <p className="text-[10px] uppercase tracking-ultra text-brand-400 mb-2">Prochain rendez-vous</p>
          <p className="font-display text-xl">
            {formatDate(nextAppointment.date)} à {nextAppointment.startTime.replace(":", "h")}
          </p>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white border border-brand-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">Dernières commandes</h2>
            <Link href="/mon-espace/commandes" className="text-xs text-accent hover:underline">Voir tout</Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-400 text-sm mb-4">Aucune commande pour le moment</p>
              <Link href="/boutique" className="btn-primary text-xs">Découvrir la boutique</Link>
              <Link href="/offres" className="btn-secondary text-xs mt-3 inline-block">Voir nos prestations</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex justify-between py-3 border-b border-brand-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.items[0]?.product?.name}</p>
                    <p className="text-xs text-brand-400">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatPrice(order.total)}</p>
                    <span className="text-[10px] uppercase tracking-wider text-brand-400">{ORDER_STATUS_LABELS[order.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-brand-100 p-6">
          <h2 className="font-display text-lg mb-6">Actions rapides</h2>
          <div className="space-y-3">
            {[
              { label: "Suivre mes commandes", href: "/mon-espace/commandes" },
              { label: "Réserver une prestation", href: "/offres" },
              { label: "Acheter en boutique", href: "/boutique" },
              { label: "Trouver mon accompagnement", href: "/orientation" },
              { label: "Compléter mon questionnaire", href: "/mon-espace/questionnaire" },
              { label: "Mettre à jour mon profil", href: "/mon-espace/profil" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between p-4 border border-brand-100 hover:border-brand-300 transition-colors group text-sm">
                {action.label}
                <ArrowRight className="w-4 h-4 text-brand-300 group-hover:text-brand-950 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, appointment: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getDocuments(userId: string) {
  return prisma.clientDocument.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}
