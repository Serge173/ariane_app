import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminKpi, DashboardPanel, DashboardRow } from "@/components/admin/ui/AdminKpi";
import { StatusDot } from "@/components/admin/ui/StatusDot";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { orderStatusTone } from "@/lib/admin-status";

export default async function AdminDashboard() {
  let stats = { orders: 0, revenue: 0, clients: 0, appointments: 0, pendingMessages: 0 };
  let recentOrders: Awaited<ReturnType<typeof getRecentOrders>> = [];
  let upcomingAppointments: Awaited<ReturnType<typeof getUpcomingAppointments>> = [];
  let pendingOrders: Awaited<ReturnType<typeof getPendingOrders>> = [];

  try {
    const [orderCount, revenue, clientCount, appointmentCount, messages, orders, appointments, pending] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ where: { status: { notIn: ["CANCELLED", "REFUNDED"] } }, _sum: { total: true } }),
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.appointment.count({ where: { status: { in: ["SCHEDULED", "CONFIRMED"] } } }),
        prisma.contactRequest.count({ where: { isRead: false } }),
        getRecentOrders(),
        getUpcomingAppointments(),
        getPendingOrders(),
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
    pendingOrders = pending;
  } catch {}

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <AdminKpi label="Commandes" value={stats.orders} href="/admin/commandes" />
        <AdminKpi label="Chiffre d'affaires" value={formatPrice(stats.revenue)} href="/admin/statistiques" />
        <AdminKpi label="Clients" value={stats.clients} href="/admin/clients" />
        <AdminKpi
          label="Messages non lus"
          value={stats.pendingMessages}
          href="/admin/messages"
          highlight={stats.pendingMessages > 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <DashboardPanel title="Commandes à traiter" href="/admin/commandes">
          {pendingOrders.length === 0 ? (
            <EmptyState title="Aucune commande en attente" description="Tout est à jour." />
          ) : (
            pendingOrders.slice(0, 6).map((order) => (
              <DashboardRow
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                primary={order.orderNumber}
                secondary={
                  order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.guestEmail ?? "Invité"
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

        <DashboardPanel title="Prochains rendez-vous" href="/admin/rendez-vous">
          {upcomingAppointments.length === 0 ? (
            <EmptyState title="Aucun rendez-vous planifié" />
          ) : (
            upcomingAppointments.slice(0, 6).map((apt) => (
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

      {recentOrders.length > 0 && (
        <div className="mt-4">
          <DashboardPanel title="Activité récente" href="/admin/commandes" linkLabel="Toutes les commandes">
            {recentOrders.slice(0, 5).map((order) => (
              <DashboardRow
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                primary={order.orderNumber}
                secondary={new Date(order.createdAt).toLocaleDateString("fr-FR")}
                meta={formatPrice(order.total)}
              />
            ))}
          </DashboardPanel>
        </div>
      )}
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
