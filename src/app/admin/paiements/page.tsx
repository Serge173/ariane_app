import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { PaymentSubNav } from "@/components/admin/payments/PaymentSubNav";
import { CreditCard, Settings, Receipt, Plus } from "lucide-react";

export default async function AdminPaiementsHubPage() {
  let stats = { methods: 0, activeMethods: 0, transactions: 0, totalSuccess: 0 };

  try {
    const [methods, activeMethods, transactions, successPayments] = await Promise.all([
      prisma.paymentMethodConfig.count(),
      prisma.paymentMethodConfig.count({ where: { isActive: true } }),
      prisma.payment.count(),
      prisma.payment.findMany({ where: { status: "SUCCESS" }, select: { amount: true } }),
    ]);
    stats = {
      methods,
      activeMethods,
      transactions,
      totalSuccess: successPayments.reduce((s, p) => s + p.amount, 0),
    };
  } catch {}

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-section mb-2">Paiements</h1>
          <p className="text-brand-600">
            Total encaissé : <strong>{formatPrice(stats.totalSuccess)}</strong>
          </p>
        </div>
        <Link href="/admin/paiements/modes" className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" />
          Gérer les modes
        </Link>
      </div>

      <PaymentSubNav active="hub" />

      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        <Link href="/admin/paiements/modes" className="group p-6 bg-white border border-brand-100 hover:border-brand-950 transition-all">
          <Settings className="w-7 h-7 text-accent mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{stats.activeMethods}/{stats.methods}</p>
          <h2 className="font-display text-lg group-hover:text-accent transition-colors">Modes actifs</h2>
        </Link>
        <Link href="/admin/paiements/transactions" className="group p-6 bg-white border border-brand-100 hover:border-brand-950 transition-all">
          <Receipt className="w-7 h-7 text-brand-600 mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{stats.transactions}</p>
          <h2 className="font-display text-lg group-hover:text-accent transition-colors">Transactions</h2>
        </Link>
        <div className="p-6 bg-white border border-brand-100">
          <CreditCard className="w-7 h-7 text-green-600 mb-4" strokeWidth={1.5} />
          <p className="text-3xl font-light mb-1">{formatPrice(stats.totalSuccess)}</p>
          <h2 className="font-display text-lg">Encaissé</h2>
        </div>
      </div>
    </div>
  );
}
