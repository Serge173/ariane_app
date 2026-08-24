import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { ProductManager } from "@/components/admin/catalogue/ProductManager";

async function getMeta() {
  try {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, parentId: true, sortOrder: true, scope: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);
    return { categories, brands };
  } catch {
    return { categories: [], brands: [] };
  }
}

export default async function AdminProductsPage() {
  const { categories, brands } = await getMeta();

  return (
    <div>
      <CatalogueSubNav active="products" />
      <Suspense fallback={<p className="text-brand-400">Chargement...</p>}>
        <ProductManager initialCategories={categories} initialBrands={brands} />
      </Suspense>
    </div>
  );
}
