import type { PrismaClient } from "@prisma/client";
import { buildVariantLabel } from "@/lib/shop/variants";

export interface OrderLineInput {
  productId?: string;
  productSlug?: string;
  variantId?: string;
  quantity?: number;
}

export interface ResolvedOrderLine {
  productId: string;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  productType: string;
  mode?: string;
}

export class OrderPricingError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export async function resolveOrderLines(
  prisma: PrismaClient,
  items: OrderLineInput[]
): Promise<{ lines: ResolvedOrderLine[]; subtotal: number }> {
  const lines: ResolvedOrderLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    let product;
    if (item.productId) {
      product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        },
      });
    } else if (item.productSlug) {
      product = await prisma.product.findUnique({
        where: { slug: item.productSlug },
        include: {
          variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        },
      });
    }

    if (!product || !product.isActive) continue;

    const quantity = Math.max(1, item.quantity ?? 1);
    const activeVariants = product.variants.filter((v) => v.isActive);

    let unitPrice = product.price;
    let variantId: string | null = null;
    let variantLabel: string | null = null;

    if (activeVariants.length > 0) {
      if (!item.variantId) {
        throw new OrderPricingError(`Variante requise pour « ${product.name} »`);
      }
      const variant = activeVariants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new OrderPricingError(`Variante invalide pour « ${product.name} »`);
      }
      if (variant.trackInventory && variant.stock < quantity) {
        throw new OrderPricingError(
          `Stock insuffisant pour « ${product.name} » (${variant.name})`
        );
      }
      unitPrice = variant.price;
      variantId = variant.id;
      variantLabel = variant.name || buildVariantLabel(variant.size, variant.color);
    }

    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    lines.push({
      productId: product.id,
      variantId,
      variantLabel,
      quantity,
      unitPrice,
      total: lineTotal,
      productType: product.productType,
      mode: product.mode,
    });
  }

  if (lines.length === 0) {
    throw new OrderPricingError("Aucun produit valide");
  }

  return { lines, subtotal };
}
