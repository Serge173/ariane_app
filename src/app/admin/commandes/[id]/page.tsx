import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  formatPrice,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  formatDate,
} from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatusDot } from "@/components/admin/ui/StatusDot";
import { orderStatusTone, paymentStatusTone } from "@/lib/admin-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TIMELINE_STEPS = [
  { key: "created", label: "Commande créée" },
  { key: "paid", label: "Paiement reçu" },
  { key: "confirmed", label: "Confirmée / RDV" },
  { key: "completed", label: "Terminée" },
] as const;

function timelineStepIndex(status: string): number {
  if (status === "CANCELLED" || status === "REFUNDED") return -1;
  if (["COMPLETED", "COACHING_COMPLETED", "FOLLOW_UP"].includes(status)) return 3;
  if (["APPOINTMENT_CONFIRMED", "COACHING_SCHEDULED", "QUESTIONNAIRE_PENDING"].includes(status)) {
    return 2;
  }
  if (status === "PAID") return 1;
  return 0;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const step = timelineStepIndex(order.status);
  const clientName = order.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : [order.guestFirstName, order.guestLastName].filter(Boolean).join(" ") || "Invité";

  return (
    <div>
      <PageHeader
        title={order.orderNumber}
        description={`Créée le ${formatDate(order.createdAt)} — ${clientName}`}
        action={
          <Link href="/admin/commandes" className="text-xs text-admin-muted hover:text-accent">
            ← Retour aux commandes
          </Link>
        }
      />

      <div className="admin-detail-grid">
        <div className="lg:col-span-2 space-y-4">
          <section className="admin-detail-card">
            <h2 className="admin-detail-card-title">Parcours</h2>
            {step < 0 ? (
              <StatusDot
                label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                tone={orderStatusTone(order.status)}
              />
            ) : (
              <ol className="space-y-0">
                {TIMELINE_STEPS.map((item, index) => (
                  <li key={item.key} className="admin-timeline-item">
                    <span
                      className={`admin-timeline-dot ${index <= step ? "admin-timeline-dot--active" : "opacity-30"}`}
                    />
                    <div>
                      <p className="text-sm text-admin-ink">{item.label}</p>
                      {index === step && (
                        <p className="text-xs text-admin-muted mt-0.5">
                          {ORDER_STATUS_LABELS[order.status]}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="admin-detail-card">
            <h2 className="admin-detail-card-title">Lignes</h2>
            <div className="admin-table-wrap border-0">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Qté</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="admin-table-row">
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td className="text-right">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-admin-line flex justify-between text-sm">
              <span className="text-admin-muted">Total commande</span>
              <span className="font-medium text-admin-ink">{formatPrice(order.total)}</span>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="admin-detail-card">
            <h2 className="admin-detail-card-title">Client</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-admin-muted text-xs">Nom</dt>
                <dd className="text-admin-ink">{clientName}</dd>
              </div>
              <div>
                <dt className="text-admin-muted text-xs">Email</dt>
                <dd className="text-admin-ink break-all">
                  {order.user?.email ?? order.guestEmail ?? "—"}
                </dd>
              </div>
              {(order.user?.phone ?? order.guestPhone) && (
                <div>
                  <dt className="text-admin-muted text-xs">Téléphone</dt>
                  <dd className="text-admin-ink">{order.user?.phone ?? order.guestPhone}</dd>
                </div>
              )}
              {order.user && (
                <Link href={`/admin/clients`} className="text-xs text-accent hover:underline inline-block">
                  Voir les clients
                </Link>
              )}
            </dl>
          </section>

          <section className="admin-detail-card">
            <h2 className="admin-detail-card-title">Paiements</h2>
            {order.payments.length === 0 ? (
              <p className="text-sm text-admin-muted">Aucun paiement enregistré.</p>
            ) : (
              <ul className="space-y-3">
                {order.payments.map((payment) => (
                  <li key={payment.id} className="text-sm">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span>{formatPrice(payment.amount)}</span>
                      <StatusDot
                        label={payment.status}
                        tone={paymentStatusTone(payment.status)}
                      />
                    </div>
                    <p className="text-xs text-admin-muted">
                      {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {order.appointment && (
            <section className="admin-detail-card">
              <h2 className="admin-detail-card-title">Rendez-vous</h2>
              <p className="text-sm text-admin-ink">
                {formatDate(order.appointment.date)} — {order.appointment.startTime.replace(":", "h")}
              </p>
              <Link href="/admin/rendez-vous" className="text-xs text-accent hover:underline mt-2 inline-block">
                Voir le planning
              </Link>
            </section>
          )}

          {order.notes && (
            <section className="admin-detail-card">
              <h2 className="admin-detail-card-title">Notes</h2>
              <p className="text-sm text-admin-muted whitespace-pre-wrap">{order.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

async function getOrder(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: true } },
        payments: true,
        appointment: true,
      },
    });
  } catch {
    return null;
  }
}
