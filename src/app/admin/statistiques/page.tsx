import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";

export default async function AdminStatistiquesPage() {
  let stats = {
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    clients: 0,
    conversionRate: 0,
    ordersByStatus: [] as { status: string; count: number }[],
    topProducts: [] as { name: string; count: number; revenue: number }[],
  };

  try {
    const [orders, clients, orderItems, statusGroups] = await Promise.all([
      prisma.order.findMany({ include: { items: { include: { product: true } } } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.orderItem.findMany({ include: { product: true } }),
      prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
    ]);

    const paidOrders = orders.filter((o) => !["PENDING_PAYMENT", "CANCELLED", "REFUNDED"].includes(o.status));
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);

    const productMap = new Map<string, { name: string; count: number; revenue: number }>();
    for (const item of orderItems) {
      const existing = productMap.get(item.productId) || { name: item.product.name, count: 0, revenue: 0 };
      existing.count += item.quantity;
      existing.revenue += item.total;
      productMap.set(item.productId, existing);
    }

    stats = {
      totalOrders: orders.length,
      totalRevenue,
      paidOrders: paidOrders.length,
      clients,
      conversionRate: orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0,
      ordersByStatus: statusGroups.map((g) => ({ status: g.status, count: g._count.status })),
      topProducts: Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue),
    };
  } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Statistiques</h1>
        <p className="text-brand-600">Indicateurs de performance et conversion</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Commandes totales", value: stats.totalOrders },
          { label: "Commandes payées", value: stats.paidOrders },
          { label: "Chiffre d'affaires", value: formatPrice(stats.totalRevenue) },
          { label: "Taux conversion", value: `${stats.conversionRate}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-brand-100 p-5">
            <p className="text-[10px] uppercase tracking-widest text-brand-400 mb-2">{s.label}</p>
            <p className="text-2xl font-light">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white border border-brand-100 p-6">
          <h2 className="font-display text-lg mb-6">Commandes par statut</h2>
          <div className="space-y-3">
            {stats.ordersByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-brand-600">{ORDER_STATUS_LABELS[item.status] || item.status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-950 rounded-full"
                      style={{ width: `${stats.totalOrders > 0 ? (item.count / stats.totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{item.count}</span>
                </div>
              </div>
            ))}
            {stats.ordersByStatus.length === 0 && <p className="text-brand-400 text-sm">Aucune donnée</p>}
          </div>
        </section>

        <section className="bg-white border border-brand-100 p-6">
          <h2 className="font-display text-lg mb-6">Performance par formule</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between py-2 border-b border-brand-50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-brand-400">{product.count} vente{product.count !== 1 ? "s" : ""}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(product.revenue)}</p>
              </div>
            ))}
            {stats.topProducts.length === 0 && <p className="text-brand-400 text-sm">Aucune donnée</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
