import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminKpi, DashboardPanel, DashboardRow } from "@/components/admin/ui/AdminKpi";
import { AdminQuickAccess } from "@/components/admin/ui/AdminQuickAccess";
import { StatusDot } from "@/components/admin/ui/StatusDot";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { orderStatusTone } from "@/lib/admin-status";
import {
  ShoppingCart,
  CreditCard,
  Users,
  CalendarCheck,
  Calendar,
} from "lucide-react";

export default async function AdminDashboard() {
  let stats = {
    orders: 0,
    revenue: 0,
    clients: 0,
    pendingRdvRequests: 0,
  };
  let upcomingAppointments: Awaited<ReturnType<typeof getUpcomingAppointments>> = [];
  let pendingOrders: Awaited<ReturnType<typeof getPendingOrders>> = [];
  let recentRdvRequests: Awaited<ReturnType<typeof getRecentRdvRequests>> = [];

  try {
    const [orderCount, revenue, clientCount, rdvRequests, pending, rdvRecent, appointments] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
          _sum: { total: true },
        }),
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.contactRequest.count({ where: { isRead: false, type: "rdv" } }),
        getPendingOrders(),
        getRecentRdvRequests(),
        getUpcomingAppointments(),
      ]);
    stats = {
      orders: orderCount,
      revenue: revenue._sum.total || 0,
      clients: clientCount,
      pendingRdvRequests: rdvRequests,
    };
    pendingOrders = pending;
    recentRdvRequests = rdvRecent;
    upcomingAppointments = appointments;
  } catch {
    /* base indisponible */
  }

  return (
    <div>
      <PageHeader
        overline="Votre espace de pilotage"
        title="Tableau de bord"
        description="Une vue claire sur votre activité."
        showViewSite
        showAccentRule
      />

      <div className="admin-dash-kpis grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <AdminKpi
          label="Commandes"
          value={stats.orders}
          href="/admin/commandes"
          icon={ShoppingCart}
        />
        <AdminKpi
          label="Chiffre d'affaires"
          value={formatPrice(stats.revenue)}
          href="/admin/statistiques"
          icon={CreditCard}
        />
        <AdminKpi label="Clients" value={stats.clients} href="/admin/clients" icon={Users} />
        <AdminKpi
          label="Demandes RDV"
          value={stats.pendingRdvRequests}
          href="/admin/rendez-vous"
          icon={CalendarCheck}
          highlight={stats.pendingRdvRequests > 0}
        />
      </div>

      <div className="admin-dash-panels grid grid-cols-1 xl:grid-cols-[1fr_1fr_minmax(240px,280px)] gap-3 sm:gap-4 mb-3 sm:mb-4">
        <DashboardPanel title="Commandes à traiter" href="/admin/commandes">
          {pendingOrders.length === 0 ? (
            <EmptyState
              variant="panel"
              icon={ShoppingCart}
              title="Tout est à jour"
              description="Aucune commande à traiter pour le moment."
            />
          ) : (
            pendingOrders.slice(0, 6).map((order) => (
              <DashboardRow
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                primary={order.orderNumber}
                secondary={
                  order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : (order.guestEmail ?? "Invité")
                }
                meta={formatPrice(order.total)}
                status={
                  <StatusDot
                    label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                    tone={orderStatusTone(order.status)}
                  />
                }
              />
            ))
          )}
        </DashboardPanel>

        <DashboardPanel title="Demandes de RDV récentes" href="/admin/rendez-vous">
          {recentRdvRequests.length === 0 ? (
            <EmptyState
              variant="panel"
              icon={CalendarCheck}
              title="Aucune demande en attente"
              description="Toutes les demandes de rendez-vous ont été traitées."
            />
          ) : (
            recentRdvRequests.slice(0, 6).map((req) => (
              <DashboardRow
                key={req.id}
                href="/admin/rendez-vous"
                primary={`${req.firstName} ${req.lastName}`}
                secondary={req.email}
                meta={new Date(req.createdAt).toLocaleDateString("fr-FR")}
                status={
                  req.isRead ? (
                    <StatusDot label="Lu" tone="neutral" />
                  ) : (
                    <StatusDot label="Nouveau" tone="attention" />
                  )
                }
              />
            ))
          )}
        </DashboardPanel>

        <div className="hidden xl:block min-h-0">
          <AdminQuickAccess />
        </div>
      </div>

      <DashboardPanel title="Prochains rendez-vous confirmés" href="/admin/rendez-vous" className="admin-dash-panel-last">
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            variant="panel"
            icon={Calendar}
            title="Aucun rendez-vous planifié"
            description="Il n'y a pas de rendez-vous confirmé à venir."
          />
        ) : (
          upcomingAppointments.slice(0, 8).map((apt) => (
            <DashboardRow
              key={apt.id}
              href="/admin/rendez-vous"
              primary={apt.user ? `${apt.user.firstName} ${apt.user.lastName}` : "Client invité"}
              secondary={`${formatDate(apt.date)} — ${apt.startTime.replace(":", "h")}`}
              status={<StatusDot label={apt.status} tone="neutral" />}
            />
          ))
        )}
      </DashboardPanel>
    </div>
  );
}

async function getPendingOrders() {
  return prisma.order.findMany({
    where: { status: { in: ["PENDING_PAYMENT", "PAID", "APPOINTMENT_CONFIRMED"] } },
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

async function getRecentRdvRequests() {
  return prisma.contactRequest.findMany({
    where: { type: "rdv" },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
}
