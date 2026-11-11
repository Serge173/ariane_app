import prisma from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { OrdersTable, type OrderListItem } from "@/components/admin/orders/OrdersTable";

export default async function AdminCommandesPage() {
  let orders: OrderListItem[] = [];
  try {
    const rows = await getOrders();
    orders = rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      guestEmail: o.guestEmail,
      user: o.user
        ? { firstName: o.user.firstName, lastName: o.user.lastName }
        : null,
      items: o.items.map((item) => ({
        product: item.product ? { name: item.product.name } : null,
      })),
    }));
  } catch {}

  return (
    <div>
      <AdminPageHeader
        section="Commerce"
        title="Commandes"
        description={`${orders.length} commande${orders.length !== 1 ? "s" : ""} au total`}
      />

      <OrdersTable orders={orders} />
    </div>
  );
}

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } } },
  });
}
