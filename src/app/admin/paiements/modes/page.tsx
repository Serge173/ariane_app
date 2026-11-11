import prisma from "@/lib/prisma";
import { PaymentSubNav } from "@/components/admin/payments/PaymentSubNav";
import { PaymentMethodManager } from "@/components/admin/payments/PaymentMethodManager";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminPaymentModesPage() {
  let methods: Awaited<ReturnType<typeof getMethods>> = [];
  try {
    methods = await getMethods();
  } catch {}

  return (
    <div>
      <AdminPageHeader
        section="Commerce"
        title="Modes de paiement"
        description="Logo, API, canal CinetPay et consignes par mode"
      />
      <PaymentSubNav active="modes" />
      <PaymentMethodManager initial={methods} />
    </div>
  );
}

async function getMethods() {
  return prisma.paymentMethodConfig.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}
