"use client";

import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { DataTable } from "@/components/admin/ui/DataTable";
import { StatusDot } from "@/components/admin/ui/StatusDot";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { orderStatusTone } from "@/lib/admin-status";

export interface OrderListItem {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  guestEmail: string | null;
  user: { firstName: string; lastName: string } | null;
  items: { product: { name: string } | null }[];
}

export function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  return (
    <DataTable<OrderListItem>
      columns={[
        {
          key: "ref",
          header: "Réf.",
          mono: true,
          render: (o) => o.orderNumber,
        },
        {
          key: "client",
          header: "Client",
          render: (o) =>
            o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestEmail ?? "Invité",
        },
        {
          key: "product",
          header: "Produit",
          render: (o) => o.items[0]?.product?.name ?? "—",
        },
        {
          key: "total",
          header: "Montant",
          render: (o) => formatPrice(o.total),
        },
        {
          key: "status",
          header: "Statut",
          render: (o) => (
            <StatusDot
              label={ORDER_STATUS_LABELS[o.status] ?? o.status}
              tone={orderStatusTone(o.status)}
            />
          ),
        },
        {
          key: "date",
          header: "Date",
          className: "text-admin-muted",
          render: (o) => new Date(o.createdAt).toLocaleDateString("fr-FR"),
        },
      ]}
      rows={orders}
      rowKey={(o) => o.id}
      href={(o) => `/admin/commandes/${o.id}`}
      empty={
        <EmptyState
          title="Aucune commande"
          description="Les commandes boutique et accompagnements apparaîtront ici."
        />
      }
    />
  );
}
