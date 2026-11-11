import prisma from "@/lib/prisma";
import { formatPrice, PAYMENT_METHOD_LABELS } from "@/lib/utils";
import { PaymentSubNav } from "@/components/admin/payments/PaymentSubNav";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminPaymentTransactionsPage() {
  let payments: Awaited<ReturnType<typeof getPayments>> = [];
  try {
    payments = await getPayments();
  } catch {}

  const totalSuccess = payments.filter((p) => p.status === "SUCCESS").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <AdminPageHeader
        section="Commerce"
        title="Transactions"
        description={`Total encaissé : ${formatPrice(totalSuccess)}`}
      />
      <PaymentSubNav active="transactions" />

      <div className="admin-table-wrap overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="py-4 px-4 font-medium text-brand-500">Commande</th>
              <th className="py-4 px-4 font-medium text-brand-500">Montant</th>
              <th className="py-4 px-4 font-medium text-brand-500">Méthode</th>
              <th className="py-4 px-4 font-medium text-brand-500">Statut</th>
              <th className="py-4 px-4 font-medium text-brand-500">Réf. provider</th>
              <th className="py-4 px-4 font-medium text-brand-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="admin-table-row">
                <td className="py-4 px-4 font-mono text-xs">{payment.order.orderNumber}</td>
                <td className="py-4 px-4 font-medium">{formatPrice(payment.amount)}</td>
                <td className="py-4 px-4 text-brand-600">
                  {PAYMENT_METHOD_LABELS[payment.method] || payment.method.replace(/_/g, " ")}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 ${
                      payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-brand-100"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-brand-400">{payment.providerRef || "—"}</td>
                <td className="py-4 px-4 text-brand-400">
                  {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <p className="text-center text-brand-400 py-12">Aucune transaction</p>
        )}
      </div>
    </div>
  );
}

async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });
}
