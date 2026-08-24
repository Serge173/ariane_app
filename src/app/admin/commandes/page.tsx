import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default async function AdminCommandesPage() {
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  try { orders = await getOrders(); } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Commandes</h1>
        <p className="text-brand-600">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
      </div>

      <div className="bg-white border border-brand-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-left bg-brand-50">
              <th className="py-4 px-4 font-medium text-brand-500">Réf.</th>
              <th className="py-4 px-4 font-medium text-brand-500">Client</th>
              <th className="py-4 px-4 font-medium text-brand-500">Produit</th>
              <th className="py-4 px-4 font-medium text-brand-500">Montant</th>
              <th className="py-4 px-4 font-medium text-brand-500">Statut</th>
              <th className="py-4 px-4 font-medium text-brand-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-brand-50 hover:bg-brand-50/50">
                <td className="py-4 px-4 font-mono text-xs">{order.orderNumber}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {order.user && (
                      <ProfileAvatar src={order.user.avatar} firstName={order.user.firstName} lastName={order.user.lastName} size="sm" />
                    )}
                    <span>{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail}</span>
                  </div>
                </td>
                <td className="py-4 px-4">{order.items[0]?.product?.name || "—"}</td>
                <td className="py-4 px-4 font-medium">{formatPrice(order.total)}</td>
                <td className="py-4 px-4">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-brand-100">{ORDER_STATUS_LABELS[order.status]}</span>
                </td>
                <td className="py-4 px-4 text-brand-400">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-brand-400 py-12">Aucune commande</p>}
      </div>
    </div>
  );
}

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } }, appointment: true, payments: true },
  });
}
