import prisma from "@/lib/prisma";
import { PaymentSubNav } from "@/components/admin/payments/PaymentSubNav";
import { PaymentMethodManager } from "@/components/admin/payments/PaymentMethodManager";

export default async function AdminPaymentModesPage() {
  let methods: Awaited<ReturnType<typeof getMethods>> = [];
  try {
    methods = await getMethods();
  } catch {}

  return (
    <div>
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
