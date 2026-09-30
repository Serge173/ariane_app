import prisma from "@/lib/prisma";
import { normalizeStoredPrice } from "@/lib/shop/public-price";
import type { Product } from "@prisma/client";

export type CatalogProduct = Product & { price: number | null };

function withNormalizedPrice<T extends { price: unknown }>(row: T): T & { price: number | null } {
  return { ...row, price: normalizeStoredPrice(row.price) };
}

export async function fetchActiveServiceProducts(): Promise<CatalogProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, productType: "SERVICE" },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(withNormalizedPrice);
  } catch (error) {
    console.error("[fetchActiveServiceProducts]", error);
    return [];
  }
}
