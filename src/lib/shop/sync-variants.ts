import type { PrismaClient } from "@prisma/client";
import { normalizeVariantInput, type VariantInput } from "@/lib/shop/variant-input";

type Db = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function syncProductVariants(
  db: Db,
  productId: string,
  variants?: VariantInput[]
): Promise<void> {
  if (variants === undefined) return;

  const normalized = variants
    .filter((v) => v.price != null && v.price !== "")
    .map((v, index) => normalizeVariantInput(v, index));

  const existing = await db.productVariant.findMany({ where: { productId } });
  const incomingIds = new Set(normalized.filter((v) => v.id).map((v) => v.id!));

  for (const variant of existing) {
    if (!incomingIds.has(variant.id)) {
      const used = await db.orderItem.count({ where: { variantId: variant.id } });
      if (used === 0) {
        await db.productVariant.delete({ where: { id: variant.id } });
      } else {
        await db.productVariant.update({
          where: { id: variant.id },
          data: { isActive: false },
        });
      }
    }
  }

  for (const variant of normalized) {
    const { id, ...data } = variant;
    if (id) {
      await db.productVariant.update({ where: { id }, data });
    } else {
      await db.productVariant.create({ data: { ...data, productId } });
    }
  }
}
