import type { PrismaClient } from "@prisma/client";
import type { ResolvedOrderLine } from "@/lib/shop/pricing";

export async function decrementStockForOrder(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  lines: ResolvedOrderLine[]
): Promise<void> {
  for (const line of lines) {
    if (!line.variantId) continue;

    const variant = await tx.productVariant.findUnique({ where: { id: line.variantId } });
    if (!variant?.trackInventory) continue;

    const updated = await tx.productVariant.updateMany({
      where: {
        id: line.variantId,
        stock: { gte: line.quantity },
      },
      data: { stock: { decrement: line.quantity } },
    });

    if (updated.count === 0) {
      throw new Error(`Stock insuffisant pour la variante ${line.variantId}`);
    }
  }
}

export async function restoreStockForOrder(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  orderId: string
): Promise<void> {
  const items = await tx.orderItem.findMany({
    where: { orderId, variantId: { not: null } },
    include: { variant: true },
  });

  for (const item of items) {
    if (!item.variantId || !item.variant?.trackInventory) continue;
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });
  }
}
