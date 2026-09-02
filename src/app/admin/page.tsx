import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, ORDER_STATUS_LABELS, formatDate } from "@/lib/utils";
import { ArrowRight, TrendingUp, Users, Calendar, CreditCard } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  let stats = { orders: 0, revenue: 0, clients: 0, appointments: 0, pendingMessages: 0 };
  let recentOrders: Awaited<ReturnType<typeof getRecentOrders>> = [];
  let upcomingAppointments: Awaited<ReturnType<typeof getUpcomingAppointments>> = [];

  try {
    const [orderCount, revenue, clientCount, appointmentCount, messages, orders, appointments] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ where: { status: { notIn: ["CANCELLED", "REFUNDED"] } }, _sum: { total: true } }),
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.appointment.count({ where: { status: { in: ["SCHEDULED", "CONFIRMED"] } } }),
        prisma.contactRequest.count({ where: { isRead: false } }),
        getRecentOrders(),
        getUpcomingAppointments(),
      ]);
    stats = {
      orders: orderCount,
      revenue: revenue._sum.total || 0,
      clients: clientCount,
      appointments: appointmentCount,
      pendingMessages: messages,
    };
    recentOrders = orders;
    upcomingAppointments = appointments;
  } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Tableau de bord</h1>
        <p className="text-brand-600">
          Bienvenue {session?.user?.name?.split(" ")[0]} — vue d&apos;ensemble de l&apos;activité
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Commandes", value: stats.orders, href: "/admin/commandes", icon: CreditCard, color: "text-blue-600" },
          { label: "Chiffre d'affaires", value: formatPrice(stats.revenue), href: "/admin/statistiques", icon: TrendingUp, color: "text-green-600" },
          { label: "Clients", value: stats.clients, href: "/admin/clients", icon: Users, color: "text-purple-600" },
          { label: "RDV à venir", value: stats.appointments, href: "/admin/rendez-vous", icon: Calendar, color: "text-orange-600" },
          { label: "Messages non lus", value: stats.pendingMessages, href: "/admin/messages", icon: CreditCard, color: "text-red-600" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white border border-brand-100 p-5 hover:shadow-md transition-shadow group">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} strokeWidth={1.5} />
            <p className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">{stat.label}</p>
            <p className="text-xl font-light group-hover:text-brand-700 transition-colors">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white border border-brand-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">Commandes récentes</h2>
            <Link href="/admin/commandes" className="text-xs text-accent hover:underline">Voir tout</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-brand-400 text-sm text-center py-8">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-brand-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-brand-400">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatPrice(order.total)}</p>
                    <span className="text-[10px] uppercase tracking-wider text-brand-400">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-brand-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">Prochains rendez-vous</h2>
            <Link href="/admin/rendez-vous" className="text-xs text-accent hover:underline">Voir tout</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="text-brand-400 text-sm text-center py-8">Aucun rendez-vous</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-3 border-b border-brand-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      {apt.user ? `${apt.user.firstName} ${apt.user.lastName}` : "Client invité"}
                    </p>
                    <p className="text-xs text-brand-400">
                      {formatDate(apt.date)} — {apt.startTime.replace(":", "h")}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-100">{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Guide d'utilisation", href: "/admin/guide" },
          { label: "Catalogue boutique", href: "/admin/catalogue" },
          { label: "Ajouter un produit", href: "/admin/catalogue/produits/nouveau" },
          { label: "Voir les clients", href: "/admin/clients" },
          { label: "Messages contact", href: "/admin/messages" },
          { label: "Statistiques", href: "/admin/statistiques" },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="flex items-center justify-between p-4 bg-brand-950 text-white text-sm hover:bg-brand-800 transition-colors group">
            {action.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}

async function getUpcomingAppointments() {
  return prisma.appointment.findMany({
    where: { status: { in: ["SCHEDULED", "CONFIRMED"] } },
    take: 10,
    orderBy: { date: "asc" },
    include: { user: true },
  });
}
